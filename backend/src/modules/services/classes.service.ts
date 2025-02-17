import { ClassesDTO } from "../DTO/classes.dto";
import { BaseRepository } from "../repositories/base.repository";
import { Classes } from "../entity/Classes.entity";
import { Logger } from "../config/logger";

class ClassesService{
    constructor(private readonly classesRepository: BaseRepository<Classes>) {}

    async getAll(): Promise<ClassesDTO[]> {
        try {
            const listClasses = await this.classesRepository.find({
                select: ['class_id','class_name', 'description', 'teacher_id', 'created_at', 'updated_at'],
            });
            return listClasses;
        } catch (error) {
            Logger.error(error);
            throw new Error('Error fetching classes');
        }
    }

    async getById(class_id: number): Promise<ClassesDTO> {
        try {
            const classes = await this.classesRepository.findById(class_id);
            return classes;
        } catch (error) {
            Logger.error(error);
            throw new Error('Error fetching class');
        }
    }

    async create(classes: ClassesDTO): Promise<ClassesDTO> {
        try {
            const newClasses = await this.classesRepository.save(classes);
            return newClasses;
        } catch (error) {
            throw new Error('Error creating class');
        }
    }

    async update(class_id: number, classes: ClassesDTO): Promise<ClassesDTO> {
        try {
            await this.classesRepository.update(class_id, classes);
            const updatedClasses = await this.classesRepository.findById(class_id);
            return updatedClasses;
        } catch (error) {
            throw new Error('Error updating class');
        }
    }

    async delete(class_id: number): Promise<ClassesDTO> {
        try {
            const deletedClasses = await this.classesRepository.delete(class_id);
            return deletedClasses;
        } catch (error) {
            Logger.error(error);
            throw new Error('Error deleting class');
        }
    }

}

export default ClassesService;