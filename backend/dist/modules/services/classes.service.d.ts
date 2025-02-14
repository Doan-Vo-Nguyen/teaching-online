import { ClassesDTO } from "../DTO/classes.dto";
import { BaseRepository } from "../repositories/base.repository";
import { Classes } from "../entity/Classes.entity";
declare class ClassesService {
    private readonly classesRepository;
    constructor(classesRepository: BaseRepository<Classes>);
    getAll(): Promise<ClassesDTO[]>;
    getById(class_id: number): Promise<ClassesDTO>;
    create(classes: ClassesDTO): Promise<ClassesDTO>;
    update(class_id: number, classes: ClassesDTO): Promise<ClassesDTO>;
    delete(class_id: number): Promise<ClassesDTO>;
}
export default ClassesService;
