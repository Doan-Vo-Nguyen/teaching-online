import { DataSource } from 'typeorm';
import { Role, Users } from '../entity/User.entity';


export const seedData = async (dataSource: DataSource) => {
    console.log('Seeding data...');

    const userRepository = dataSource.getRepository(Users);

    // Create a new user
    const user = [
        {
            username: 'Lichdepzai',
            fullname: 'Dương Thanh Lịch',
            password: 'lịch@123',
            role: Role.STUDENT,
            email: 'lich@gmail.com',
            profile_picture: 'lich.jpg',
            phone: '0123456789',
            created_at: new Date(),
            updated_at: new Date()
        }
    ]
    await userRepository.save(user);
};