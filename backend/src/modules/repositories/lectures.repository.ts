import { Lectures } from "../entity/Lectures.entity";
import { BaseRepository } from "./base.repository";

export class LecturesRepository extends BaseRepository<Lectures> {
    constructor() {
        super(Lectures);
    }

    async find(options: any): Promise<Lectures[]> {
        return this.repository.find(options);
    }

    async findById(lecture_id: number): Promise<Lectures> {
        return this.repository.findOneBy({ lecture_id });
    }

    async save(lecture: Lectures): Promise<Lectures> {
        return this.repository.save(lecture);
    }

    async update(lecture_id: number, lecture: Lectures): Promise<Lectures> {
        await this.repository.update(lecture_id, lecture);
        return this.repository.findOneBy({ lecture_id });
    }

    async delete(lecture_id: number): Promise<Lectures> {
        const lecture = await this.repository.findOneBy({ lecture_id });
        return this.repository.remove(lecture);
    }

}