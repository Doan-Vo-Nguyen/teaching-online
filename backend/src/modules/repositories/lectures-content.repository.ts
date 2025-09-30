import { LectureType } from "../constant";
import { LecturesContent } from "../entity/LecturesContent.entity";
import { BaseRepository } from "./base.repository";

export class LecturesContentRepository extends BaseRepository<LecturesContent> {
    constructor() {
        super(LecturesContent);
    }

    async find(options: any): Promise<LecturesContent[]> {
    return this.repository.find(options);
    }

    async findById(id: number): Promise<LecturesContent> {
        return this.repository.findOneBy({ id });
    }

    async findByLectureId(lecture_id: number): Promise<LecturesContent[]> {
        return this.repository.find({ where: { lecture_id } });
    }

    async save(lectureContent: LecturesContent): Promise<LecturesContent> {
        return this.repository.save(lectureContent);
    }

    async update(id: number, lectureContent: LecturesContent): Promise<LecturesContent> {
        await this.repository.update(id, lectureContent);
        return this.findById(id);
    }

    async delete(id: number): Promise<LecturesContent> {
        const lectureContent = await this.repository.findOneBy({ id });
        return this.repository.remove(lectureContent);
    }

    async getAllLecturesContentByLectureId(lecture_id: number): Promise<LecturesContent[]> {
        return this.repository.find({ where: { lecture_id } });
    }

    async getLectureContentDetailsByLectureId(id: number, lecture_id: number): Promise<LecturesContent[]> {
        return this.repository.find({ where: { id, lecture_id } });
    }

    async getLecturesContentById(lecture_id: number): Promise<LecturesContent[]> {
        return this.repository.find({ where: { lecture_id } });
    }

    async addLecturesContent(lecture_id: number, content: string, type: LectureType): Promise<LecturesContent> {
        const lectureContent = new LecturesContent();
        lectureContent.lecture_id = lecture_id;
        lectureContent.content = content;
        lectureContent.type = type;
        return this.repository.save(lectureContent);
    }
    
    async deleteLecturesContent(lectureId: number, lectureContentId: number): Promise<LecturesContent> {
        const lectureContent = await this.repository.findOneBy({ lecture_id: lectureId, id: lectureContentId });
        return this.repository.remove(lectureContent);
    }
}