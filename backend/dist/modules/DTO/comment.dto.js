var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
export class CommentDTO {
    user_id;
    target_id;
    target_type;
    content;
    is_private;
    created_id;
}
export class CommentDTOPost {
    user_id;
    target_id;
    content;
    is_private;
}
__decorate([
    IsNumber(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CommentDTOPost.prototype, "user_id", void 0);
__decorate([
    IsNumber(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CommentDTOPost.prototype, "target_id", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CommentDTOPost.prototype, "content", void 0);
__decorate([
    IsNumber(),
    IsNotEmpty(),
    Min(0),
    Max(1),
    __metadata("design:type", Number)
], CommentDTOPost.prototype, "is_private", void 0);
//# sourceMappingURL=comment.dto.js.map