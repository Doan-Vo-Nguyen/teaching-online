var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class ExamDTO {
    exam_id;
    class_id;
    title;
    description;
    due_date;
    created_id;
    updated_at;
}
export class ExamDTOPost {
    class_id;
    title;
    description;
    due_date;
}
__decorate([
    IsNumber(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], ExamDTOPost.prototype, "class_id", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ExamDTOPost.prototype, "title", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ExamDTOPost.prototype, "description", void 0);
__decorate([
    IsNotEmpty(),
    __metadata("design:type", Date)
], ExamDTOPost.prototype, "due_date", void 0);
//# sourceMappingURL=exam.dto.js.map