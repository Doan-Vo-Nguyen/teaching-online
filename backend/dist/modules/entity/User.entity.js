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
export var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["TEACHER"] = "teacher";
    Role["STUDENT"] = "student";
})(Role || (Role = {}));
let Users = class Users {
    user_id;
    username;
    fullname;
    password;
    role;
    email;
    profile_picture;
    phone;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Users.prototype, "user_id", void 0);
__decorate([
    Column({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    Column({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Users.prototype, "fullname", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT
    }),
    __metadata("design:type", String)
], Users.prototype, "role", void 0);
__decorate([
    Column({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    Column({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Users.prototype, "profile_picture", void 0);
__decorate([
    Column({ type: "varchar", length: 10 }),
    __metadata("design:type", String)
], Users.prototype, "phone", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Users.prototype, "created_at", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Users.prototype, "updated_at", void 0);
Users = __decorate([
    Entity({ schema: "teaching" })
], Users);
export { Users };
//# sourceMappingURL=User.entity.js.map