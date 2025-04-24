import bcrypt from "bcrypt";
import crypto from "crypto";
import { IUserRepository } from "../interfaces/users.interface";
import { UserRepository } from "../repositories/users.repository";
import { IRefreshToken } from "../interfaces/refresh-token.interface";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { Logger } from "../config/logger";
import { generateResetToken } from "../utils/GenerateCode";
import { sendMailResetPassword } from "../utils/mailer";
import { REFRESH_TOKEN_EXPIRE, RESET_CODE_EXPIRE } from "../constant";
import {
  LOGIN_FAILED,
  FIELD_REQUIRED,
  USER_EXISTS,
  CREATED_USER_FAILED,
  USER_NOT_EXISTS,
  INVALID_RESET_CODE,
  TIME_EXPIRED,
  INVALID_TOKEN,
} from "../DTO/resDto/BaseErrorDto";
import { badRequest, unauthorized, notFound, conflict } from "../types/ApiError";

/**
 * Service for handling authentication-related operations
 */
export class AuthenService {
  private readonly userRepository: IUserRepository;
  private readonly refreshTokenRepository: IRefreshToken;
  private readonly SALT_ROUNDS = 10;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  /**
   * Authenticate user and generate tokens
   * @param email - User's email
   * @param password - User's password
   * @returns Access and refresh tokens
   */
  public async authenticate(email: string, password: string) {
    this.validateCredentials(email, password);
    
    const user = await this.validateUser(email);
    await this.validatePassword(email, password);

    const [accessToken, refreshToken] = await Promise.all([
      this.userRepository.generateToken(email),
      this.generateRefreshToken(user.user_id)
    ]);
    
    return { accessToken, refreshToken };
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Created user
   */
  public async register(userData: any) {
    const { email, password, fullname } = userData;
    await this.validateUserNotExists(email);

    const hashedPassword = this.hashPassword(password);
    const newUser = await this.userRepository.save({
      ...userData,
      password: hashedPassword,
      fullname
    });

    this.validateUserCreated(newUser);
    return newUser;
  }

  /**
   * Generate a new refresh token
   * @param user_id - User ID
   * @returns Refresh token
   */
  public async generateRefreshToken(user_id: number): Promise<string> {
    Logger.debug('Generating refresh token', { user_id, ctx: 'auth' });
    
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE * 1000);

    const refreshToken = await this.refreshTokenRepository.create({
      user_id,
      token,
      expires_at: expiresAt,
      is_revoked: false,
      id: 0
    });

    const savedToken = await this.refreshTokenRepository.save(refreshToken);
    return savedToken.token;
  }

  /**
   * Verify and refresh access token
   * @param token - Refresh token
   * @returns New access token
   */
  public async verifyRefreshToken(token: string): Promise<string> {
    const refreshToken = await this.validateRefreshToken(token);
    return this.userRepository.generateToken(refreshToken.user.email);
  }

  /**
   * Revoke a refresh token
   * @param token - Refresh token to revoke
   */
  public async revokeRefreshToken(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);
    if (refreshToken) {
      refreshToken.is_revoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
  }

  /**
   * Handle password reset request
   * @param email - User's email
   */
  public async forgotPassword(email: string) {
    this.validateEmail(email);
    const user = await this.validateUserExists(email);
    
    const token = generateResetToken();
    await this.updateUserResetCode(user, token);
    await this.sendResetPasswordEmail(email, token);

    return { message: "Reset link sent to email" };
  }

  /**
   * Reset user password
   * @param email - User's email
   * @param code - Reset code
   * @param newPassword - New password
   */
  public async resetPassword(email: string, code: string, newPassword: string) {
    this.validateResetPasswordInputs(email, code, newPassword);
    const user = await this.validateUserAndCode(email, code);
    
    this.checkResetCodeExpiry(user);
    await this.updateUserPassword(user, newPassword);

    return { message: "Password reset successfully" };
  }

  /**
   * Logout user and invalidate tokens
   * @param user_id - User ID
   */
  public async logout(user_id: number) {
    await this.revokeAllRefreshTokens(user_id);
    Logger.info('User logged out', { user_id, ctx: 'auth' });
  }

  // Private helper methods
  private validateCredentials(email: string, password: string) {
    if (!email || !password) {
      throw badRequest(FIELD_REQUIRED.error.message);
    }
  }

  private async validateUser(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw unauthorized(LOGIN_FAILED.error.message);
    }
    return user;
  }

  private async validatePassword(email: string, password: string) {
    const isValid = await this.userRepository.comparePassword(email, password);
    if (!isValid) {
      throw unauthorized(LOGIN_FAILED.error.message);
    }
  }

  private async validateUserNotExists(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw conflict(USER_EXISTS.error.message);
    }
  }

  private validateUserCreated(user: any) {
    if (!user) {
      throw badRequest(CREATED_USER_FAILED.error.message);
    }
  }

  private async validateRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);
    
    if (!refreshToken || refreshToken.is_revoked) {
      throw unauthorized(INVALID_TOKEN.error.message);
    }

    if (new Date() > refreshToken.expires_at) {
      throw unauthorized(TIME_EXPIRED.error.message);
    }

    return refreshToken;
  }

  private validateEmail(email: string) {
    if (!email) {
      throw badRequest(FIELD_REQUIRED.error.message);
    }
  }

  private async validateUserExists(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw notFound(USER_NOT_EXISTS.error.message);
    }
    return user;
  }

  private async updateUserResetCode(user: any, token: string) {
    user.code = token;
    user.updated_at = new Date();
    await this.userRepository.update(user.user_id, user);
  }

  private async sendResetPasswordEmail(email: string, token: string) {
    try {
      await sendMailResetPassword(email, token);
      Logger.info('Reset password email sent', { email, ctx: 'email' });
    } catch (error) {
      Logger.error('Failed to send reset password email', undefined, { email, ctx: 'email', error });
      throw error;
    }
  }

  private validateResetPasswordInputs(email: string, code: string, newPassword: string) {
    if (!email || !code || !newPassword) {
      throw badRequest(FIELD_REQUIRED.error.message);
    }
  }

  private async validateUserAndCode(email: string, code: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw notFound(USER_NOT_EXISTS.error.message);
    }
    if (user.code !== code) {
      throw badRequest(INVALID_RESET_CODE.error.message);
    }
    return user;
  }

  private checkResetCodeExpiry(user: any) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - user.updated_at.getTime();

    if (elapsedTime > RESET_CODE_EXPIRE) {
      const minutesAgo = Math.floor((elapsedTime - RESET_CODE_EXPIRE) / (1000 * 60));
      throw badRequest(`${TIME_EXPIRED.error.message}. Code expired ${minutesAgo} minutes ago.`);
    }
  }

  private async updateUserPassword(user: any, newPassword: string) {
    user.password = this.hashPassword(newPassword);
    await this.userRepository.update(user.user_id, user);
  }

  private async revokeAllRefreshTokens(user_id: number) {
    const refreshTokens = await this.refreshTokenRepository.findByUserId(user_id);
    await Promise.all(
      refreshTokens.map(token => {
        token.is_revoked = true;
        return this.refreshTokenRepository.save(token);
      })
    );
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.SALT_ROUNDS);
  }
}
