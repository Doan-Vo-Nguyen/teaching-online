import { TOKEN_EXPIRE } from "../../constant";
import { IAuthResultDto } from "../../types/IAuthResultDto";

export const AuthResultDto: IAuthResultDto = {
    accessToken: null,
    encryptedAccessToken: 'whatisyourname',
    expireInSeconds: TOKEN_EXPIRE,
    userId: null,
}