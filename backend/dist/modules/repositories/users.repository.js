import { AppDataSource } from "../../data-source";
import { Users } from "../entity/User.entity";
export class UserRepository {
    repository = AppDataSource.getRepository(Users);
    async find(options) {
        return this.repository.find(options);
    }
    async findById(user_id) {
        return this.repository.findOneBy({ user_id });
    }
    async save(user) {
        return this.repository.save(user);
    }
    async update(user_id, user) {
        await this.repository.update(user_id, user);
        return this.repository.findOneBy({ user_id });
    }
    async updateRole(user_id, role) {
        const user = await this.repository.findOneBy({ user_id });
        user.role = role;
        return this.repository.save(user);
    }
    async delete(user_id) {
        const user = await this.repository.findOneBy({ user_id });
        return this.repository.remove(user);
    }
}
//# sourceMappingURL=users.repository.js.map