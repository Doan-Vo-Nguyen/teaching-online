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

  async findByClassCode(class_code: string): Promise<Classes> {
    const classes = await this.repository.findOneBy({ class_code });
    return classes;
  }

  async findByClassName(class_name: string): Promise<Classes> {
    const classes = await this.repository.findOneBy({ class_name });
    return classes;
  }
  async addClass(teacher_id: number, classData: Classes): Promise<Classes> {
    // Create a new class instance with the teacher_id properly set
    const newClass = this.repository.create({
      ...classData,
      teacher_id: teacher_id,
    });

    // Save the new class to the database
    await this.repository.save(newClass);
    return newClass;
  }
}
