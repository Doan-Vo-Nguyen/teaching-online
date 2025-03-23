import { LanguageCode } from "../entity/LanguageCode.entity"
import { IBaseRepository } from "./base.interface"

export interface ILanguageCodeRepository extends IBaseRepository<LanguageCode> {
    findByName(name: string): Promise<LanguageCode>
    findById(id: number): Promise<LanguageCode>
}
