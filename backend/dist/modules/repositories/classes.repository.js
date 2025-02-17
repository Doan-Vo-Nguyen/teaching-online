import { AppDataSource } from "../../data-source";
import { Classes } from "../entity/Classes.entity";
export class ClassesRepository {
    repository = AppDataSource.getRepository(Classes);
    async find(options) {
        return this.repository.find(options);
    }
    async findById(class_id) {
        return this.repository.findOneBy({ class_id });
    }
    async save(classes) {
        return this.repository.save(classes);
    }
    async update(class_id, classes) {
        await this.repository.update(class_id, classes);
        return this.repository.findOneBy({ class_id });
    }
    async delete(class_id) {
        const classes = await this.repository.findOneBy({ class_id });
        return this.repository.remove(classes);
    }
}
//# sourceMappingURL=classes.repository.js.map