var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Role } from './../entity/User.entity';
import { IsString, IsNotEmpty } from 'class-validator';
export class UserDTO {
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
}
export class UserDTOPost {
    username;
    password;
    email;
    phone;
    role;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], UserDTOPost.prototype, "username", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], UserDTOPost.prototype, "password", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], UserDTOPost.prototype, "email", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], UserDTOPost.prototype, "phone", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], UserDTOPost.prototype, "role", void 0);
//# sourceMappingURL=users.dto.js.map