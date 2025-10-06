import { LanguageCode } from "../entity/LanguageCode.entity"
import { IBaseRepository } from "./base.interface"

export interface ILanguageCodeRepository extends IBaseRepository<LanguageCode> {
    findByName(name: string): Promise<LanguageCode>
    findById(id: string): Promise<LanguageCode>
    findByLanguageId(language_id: number): Promise<LanguageCode>
}
