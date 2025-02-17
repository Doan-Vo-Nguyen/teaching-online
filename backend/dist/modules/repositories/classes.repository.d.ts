import { Classes } from "../entity/Classes.entity";
import { IClassesRepository } from "../interfaces/classes.interface";
export declare class ClassesRepository implements IClassesRepository {
    private readonly repository;
    find(options: any): Promise<Classes[]>;
    findById(class_id: number): Promise<Classes>;
    save(classes: Classes): Promise<Classes>;
    update(class_id: number, classes: Classes): Promise<Classes>;
    delete(class_id: number): Promise<Classes>;
}
