import { IBaseResDto } from "./IBaseResDto";
export interface IBaseError extends IBaseResDto {
    error: {
        code: number;
        message: string;
        details: string | null;
        validationErrors: Array<Object> | null;
        stackTrace: string | null;
    };
}
