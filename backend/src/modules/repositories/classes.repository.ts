import { Classes } from "../entity/Classes.entity";
import { BaseRepository } from "./base.repository";

export class ClassesRepository extends BaseRepository<Classes> {
    constructor() {
        super(Classes);
    }

    async find(options: any): Promise<Classes[]> {
        return this.repository.find(options);
    }

    async findById(class_id: number): Promise<Classes> {
        return this.repository.findOneBy({ class_id });
    }

    async save(classes: Classes): Promise<Classes> {
        return this.repository.save(classes);
    }

    async update(class_id: number, classes: Classes): Promise<Classes> {
        await this.repository.update(class_id, classes);
        return this.repository.findOneBy({ class_id });
    }

    async delete(class_id: number): Promise<Classes> {
        const classes = await this.repository.findOneBy({ class_id });
        return this.repository.remove(classes);
    }

}