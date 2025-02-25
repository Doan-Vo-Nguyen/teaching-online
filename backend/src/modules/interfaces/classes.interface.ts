import { Classes } from "../entity/Classes.entity";
import { IBaseRepository } from "./base.interface";

export interface IClassesRepository extends IBaseRepository<Classes> {
    findByClassCode(class_code: string): Promise<Classes>
}