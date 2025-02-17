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
let Classes = class Classes {
    class_id;
    class_name;
    description;
    teacher_id;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Classes.prototype, "class_id", void 0);
__decorate([
    Column({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Classes.prototype, "class_name", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Classes.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Classes.prototype, "teacher_id", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Classes.prototype, "created_at", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Classes.prototype, "updated_at", void 0);
Classes = __decorate([
    Entity({ schema: "teaching" })
], Classes);
export { Classes };
//# sourceMappingURL=Classes.entity.js.map