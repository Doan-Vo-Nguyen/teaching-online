import { Classes } from "../entity/Classes.entity";

export interface IClassesRepository {
    find(options: any): Promise<Classes[]>
    findById(class_id: number): Promise<Classes>
    save(classes: Classes): Promise<Classes>
    update(class_id: number, classes: Classes): Promise<Classes>
    delete(class_id: number): Promise<Classes>
}