import { RefreshToken } from "../entity/refreshToken.entity";
import { BaseRepository } from "./base.repository";

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
    constructor() {
        super(RefreshToken)
    }

    async findByToken(token: string): Promise<RefreshToken | undefined> {
        return this.repository.findOne({ where: { token } })
    }

    async findByUserId(user_id: number): Promise<RefreshToken[]> {
        return this.repository.find({ where: { user_id } })
    }

    async revoke(token: string): Promise<void> {
        await this.repository.update(token, { is_revoked: true })
    }

    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
        return this.repository.save(refreshToken)
    }
    
    
}
