import { LanguageCode } from "../entity/LanguageCode.entity";
import { BaseRepository } from "./base.repository";

export class LanguageCodeRepository extends BaseRepository<LanguageCode> {
    constructor() {
        super(LanguageCode)
    }

    async findByName(name: string): Promise<LanguageCode> {
        return this.repository.findOneBy({ name })
    }

    async findById(id: number): Promise<LanguageCode> {
        return this.repository.findOneBy({ id })
    }
}

