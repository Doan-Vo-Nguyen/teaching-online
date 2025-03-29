import bcrypt from "bcrypt";
import { IUserRepository } from "../interfaces/users.interface";
import { UserRepository } from "../repositories/users.repository";
import { ApiError } from "../types/ApiError";
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
import { REFRESH_TOKEN_EXPIRE, RESET_CODE_EXPIRE } from "../constant";
import { generateResetToken } from "../utils/GenerateCode";
import { sendMailResetPassword } from "../utils/mailer";
import crypto from "crypto";
import { IRefreshToken } from "../interfaces/refresh-token.interface";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";

class AuthenService {
  private readonly userRepository: IUserRepository = new UserRepository();
  private readonly refreshTokenRepository: IRefreshToken = new RefreshTokenRepository()

  public async authenticate(email: string, password: string) {
    if (!email || !password) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedUser = await this.userRepository.findByEmail(email);
    if (!existedUser) {
      throw new ApiError(
        500,
        LOGIN_FAILED.error.message,
        LOGIN_FAILED.error.details
      );
    }

    const checkPass = await this.userRepository.comparePassword(
      email,
      password
    );
    if (!checkPass) {
      throw new ApiError(
        500,
        LOGIN_FAILED.error.message,
        LOGIN_FAILED.error.details
      );
    }

    const accessToken = await this.userRepository.generateToken(email);
    // const refreshToken = await this.generateRefreshToken(existedUser.user_id);
    
    return { accessToken};
  }

  public async generateRefreshToken(user_id: number): Promise<string> {
    console.log('Generating refresh token for user_id:', user_id);
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE * 1000); // Convert seconds to milliseconds

    const refreshToken = this.refreshTokenRepository.create({
      user_id,
      token,
      expires_at: expiresAt,
      is_revoked: false,
      id: 0,

    });

    const savedToken = await this.refreshTokenRepository.save(await refreshToken);
    return savedToken.token;
  }

  public async verifyRefreshToken(token: string): Promise<string> {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);

    if (!refreshToken) {
      throw new ApiError(401, INVALID_TOKEN.error.message, INVALID_TOKEN.error.details);
    }

    if (refreshToken.is_revoked) {
      throw new ApiError(401, INVALID_TOKEN.error.message, INVALID_TOKEN.error.details);
    }

    if (new Date() > refreshToken.expires_at) {
      throw new ApiError(401, TIME_EXPIRED.error.message, TIME_EXPIRED.error.details);
    }

    // Generate new access token
    const accessToken = await this.userRepository.generateToken(refreshToken.user.email);
    return accessToken;
  }

  public async revokeRefreshToken(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);

    if (refreshToken) {
      refreshToken.is_revoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
  }

  public async register(userData: any) {
    const saltRound = 10;
    const { fullname, email } = userData;
    const existedUser = await this.userRepository.findByEmail(email);
    if (existedUser) {
      throw new ApiError(
        500,
        USER_EXISTS.error.message,
        USER_EXISTS.error.details
      );
    }

    userData.password = bcrypt.hashSync(userData.password, saltRound);
    userData.fullname = fullname;
    const newUser = await this.userRepository.save(userData);
    if (!newUser) {
      throw new ApiError(
        400,
        CREATED_USER_FAILED.error.message,
        CREATED_USER_FAILED.error.details
      );
    }
    return newUser;
  }

  public async forgotPassword(email: string) {
    this.validateEmail(email);

    const user = await this.userRepository.findByEmail(email);
    this.validateUserExists(user);

    const token = generateResetToken();
    user.code = token;

    await this.sendResetPasswordEmail(email, token);
    user.updated_at = new Date();
    await this.userRepository.update(user.user_id, user);

    return { message: "Reset link sent to email" };
  }

  public async logout(user_id: number) {
    const refreshTokens = await this.refreshTokenRepository.findByUserId(user_id);
    for (const token of refreshTokens) {
      token.is_revoked = true;
      await this.refreshTokenRepository.save(token);
    }
  }

  private validateEmail(email: string) {
    if (!email) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
  }

  private validateUserExists(user: any) {
    if (!user) {
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    }
  }

  private async sendResetPasswordEmail(email: string, token: string) {
    try {
      await sendMailResetPassword(email, token);
      console.log(`Mail sent to ${email} with reset link`);
    } catch (error) {
      console.error(`Failed to send mail to ${email}:`, error);
    }
  }

  public async resetPassword(email: string, code: string, newPassword: string) {
    this.validateResetPasswordInputs(email, code, newPassword);

    const user = await this.userRepository.findByEmail(email);
    this.validateUserAndCode(user, code);

    this.checkResetCodeExpiry(user);

    user.password = this.hashPassword(newPassword);
    await this.userRepository.update(user.user_id, user);

    return { message: "Password reset successfully" };
  }

  private validateResetPasswordInputs(
    email: string,
    code: string,
    newPassword: string
  ) {
    if (!email || !code || !newPassword) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
  }

  private validateUserAndCode(user: any, code: string) {
    if (!user) {
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    }
    if (user.code !== code) {
      throw new ApiError(
        400,
        INVALID_RESET_CODE.error.message,
        INVALID_RESET_CODE.error.details
      );
    }
  }

  private checkResetCodeExpiry(user: any) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - user.updated_at;

    if (elapsedTime > RESET_CODE_EXPIRE) {
      const minutesAgo = Math.floor(
        (elapsedTime - RESET_CODE_EXPIRE) / (1000 * 60)
      );
      throw new ApiError(
        400,
        `${TIME_EXPIRED.error.message}. Code expired ${minutesAgo} minutes ago.`,
        TIME_EXPIRED.error.details
      );
    }
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}

export default AuthenService;
