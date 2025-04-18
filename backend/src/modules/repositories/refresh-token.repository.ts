import { RefreshToken } from "../entity/refreshToken.entity";
import { BaseRepository } from "./base.repository";
import { Logger } from "../config/logger";

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
    constructor() {
        super(RefreshToken)
    }

    async findByToken(token: string): Promise<RefreshToken | undefined> {
        return this.repository.findOne({ 
            where: { token },
            relations: ['user']
        });
    }

    async findByUserId(user_id: number): Promise<RefreshToken[]> {
        try {
            return this.repository.find({ 
                where: { user_id },
                relations: ['user'] 
            });
        } catch (error) {
            Logger.error('Error finding refresh tokens by user ID', undefined, { user_id, error });
            return [];
        }
    }

    async revoke(token: string): Promise<void> {
        try {
            const result = await this.repository.update({ token }, { is_revoked: true });
            if (result.affected === 0) {
                Logger.warn('No refresh token was updated during revocation', { token });
            }
        } catch (error) {
            Logger.error('Failed to revoke refresh token', undefined, { token, error });
            throw error;
        }
    }

    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
        try {
            return this.repository.save(refreshToken);
        } catch (error) {
            Logger.error('Failed to create refresh token', undefined, { error });
            throw error;
        }
    }
}
