import { IBaseRepository } from "./base.interface";
import { RefreshToken } from "../entity/refreshToken.entity";

export interface IRefreshToken extends IBaseRepository<RefreshToken> {
    findByToken(token: string): Promise<RefreshToken | undefined>
    findByUserId(user_id: number): Promise<RefreshToken[]>
    revoke(token: string): Promise<void>
    create(refreshToken: RefreshToken): Promise<RefreshToken>
}
