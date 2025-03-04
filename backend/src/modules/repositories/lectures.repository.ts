import { Lectures } from "../entity/Lectures.entity";
import { BaseRepository } from "./base.repository";
import { ClassesRepository } from "./classes.repository";

export class LecturesRepository extends BaseRepository<Lectures> {
    private readonly classRepository: ClassesRepository = new ClassesRepository();
    constructor() {
        super(Lectures);
    }

    async find(options: any): Promise<Lectures[]> {
        return this.repository.find(options);
    }

    async findById(lecture_id: number): Promise<Lectures> {
        return this.repository.findOneBy({ lecture_id });
    }

    async findByClassId(class_id: number): Promise<Lectures[]> {
        return this.repository.find({ where: { class_id } });
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

    async findLectureByClassIdAndLectureId(lecture_id: number, class_id: number): Promise<Lectures> {
        return this.repository.findOneBy({ lecture_id, class_id });
    }

    async getAllLecturesByClassId(class_id: number): Promise<Lectures[]> {
        const classes = await this.classRepository.findById(class_id);
        const lectures = await this.repository.find({ where: { class_id: classes.class_id } });
        return lectures;
    }

    async getLecturesDetailsByClassId(lecture_id: number, class_id: number): Promise<Lectures[]> {
       const classes = await this.classRepository.findById(class_id);
       const lectures = await this.repository.find({ where: { lecture_id, class_id: classes.class_id } });
       return lectures;
    }

    async createLectureByClassId(class_id: number, data: Lectures): Promise<Lectures> {
        const classes = await this.classRepository.findById(class_id);
        const lecture = await this.repository.save({ ...data, class_id: classes.class_id });
        return lecture;
    }

    async updateLectureByClassId(lecture_id: number, class_id: number, data: Lectures): Promise<Lectures> {
        await this.repository.update({ lecture_id, class_id }, data);
        return this.repository.findOneBy({ lecture_id, class_id });
    }

    async deleteLectureByClassId(lecture_id: number, class_id: number): Promise<Lectures[]> {
        const classes = await this.classRepository.findById(class_id);
        const lectures = await this.repository.find({ where: { lecture_id, class_id: classes.class_id } });
        return await this.repository.remove(lectures);
    }

    async addFileToLectureByClassId(class_id: number, title: string, content: string): Promise<Lectures> {
        const classes = await this.classRepository.findById(class_id);
        const lecture = await this.repository.save({ class_id: classes.class_id, title, content });
        return lecture;
    }

    async deleteFileFromLecture(lecture_id: number, class_id: number): Promise<Lectures> {
        const classes = await this.classRepository.findById(class_id);
        const lecture = await this.repository.findOneBy({ lecture_id, class_id: classes.class_id });
        return this.repository.remove(lecture);
    }
}