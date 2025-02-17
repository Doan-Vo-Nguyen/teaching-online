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
let Submissions = class Submissions {
    submission_id;
    assignment_id;
    student_id;
    file_content;
    submitted_at;
    grade;
    feedback;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Submissions.prototype, "submission_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Submissions.prototype, "assignment_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Submissions.prototype, "student_id", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Submissions.prototype, "file_content", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Submissions.prototype, "submitted_at", void 0);
__decorate([
    Column({ type: "decimal", precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Submissions.prototype, "grade", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Submissions.prototype, "feedback", void 0);
Submissions = __decorate([
    Entity({ schema: "teaching" })
], Submissions);
export { Submissions };
//# sourceMappingURL=Submission.entity.js.map