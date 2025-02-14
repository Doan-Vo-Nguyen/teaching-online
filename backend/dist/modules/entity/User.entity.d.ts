export declare enum Role {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student"
}
export declare class Users {
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
