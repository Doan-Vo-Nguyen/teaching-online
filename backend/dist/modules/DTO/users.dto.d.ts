import { Role } from './../entity/User.entity';
export declare class UserDTO {
    user_id: number;
    username: string;
    fullname: string;
    password: string;
    role: Role;
    email: string;
    profile_picture: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
}
export declare class UserDTOPost {
    username: string;
    password: string;
    email: string;
    phone: string;
    role: Role;
}
