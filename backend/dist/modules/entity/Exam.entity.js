var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
let Exam = class Exam {
    exam_id;
    class_id;
    title;
    description;
    due_date;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Exam.prototype, "exam_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Exam.prototype, "class_id", void 0);
__decorate([
    Column({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Exam.prototype, "title", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Exam.prototype, "description", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Exam.prototype, "due_date", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Exam.prototype, "created_at", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Exam.prototype, "updated_at", void 0);
Exam = __decorate([
    Entity({ schema: "teaching" })
], Exam);
export { Exam };
//# sourceMappingURL=Exam.entity.js.map