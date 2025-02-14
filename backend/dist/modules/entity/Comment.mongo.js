var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm";
export var Type;
(function (Type) {
    Type["LECTURE"] = "lecture";
    Type["ASSIGNMENT"] = "assignment";
    Type["MEETING"] = "meeting";
})(Type || (Type = {}));
let Comment = class Comment {
    id;
    comment_id;
    user_id;
    target_id;
    target_type;
    content;
    is_private;
    created_id;
};
__decorate([
    ObjectIdColumn(),
    __metadata("design:type", ObjectId)
], Comment.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Comment.prototype, "comment_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Comment.prototype, "user_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Comment.prototype, "target_id", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: Type,
        default: Type.LECTURE
    }),
    __metadata("design:type", String)
], Comment.prototype, "target_type", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    Column(),
    __metadata("design:type", Boolean)
], Comment.prototype, "is_private", void 0);
__decorate([
    Column(),
    __metadata("design:type", Date)
], Comment.prototype, "created_id", void 0);
Comment = __decorate([
    Entity()
], Comment);
export { Comment };
//# sourceMappingURL=Comment.mongo.js.map