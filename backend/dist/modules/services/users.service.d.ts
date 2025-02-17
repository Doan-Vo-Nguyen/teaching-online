import { UserDTO } from "../DTO/users.dto";
import { IUserRepository } from "../interfaces/users.interface";
declare class UserService {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    getAll(): Promise<UserDTO[]>;
    getById(user_id: number): Promise<UserDTO>;
    create(user: UserDTO): Promise<UserDTO>;
    update(user_id: number, user: UserDTO): Promise<UserDTO>;
    updateRole(user_id: number, role: string): Promise<UserDTO>;
    delete(user_id: number): Promise<UserDTO>;
}
export default UserService;
