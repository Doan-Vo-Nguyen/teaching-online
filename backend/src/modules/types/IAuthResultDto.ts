export interface IAuthResultDto {
    accessToken: string | null;
    encryptedAccessToken: string | null;
    expireInSeconds: number;
    userId: number | null;
}