// src/repositories/BaseRepository.ts
import { Repository, EntityTarget, DataSource } from 'typeorm';

export class BaseRepository<T> {
    private readonly repository: Repository<T>;

    constructor(private readonly entity: EntityTarget<T>, private readonly dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(this.entity);
    }

    async find(options: any): Promise<T[]> {
        return this.repository.find(options);
    }

    async save(entity: T): Promise<T> {
        return this.repository.save(entity);
    }

    // async update(criteria: any, partialEntity: Partial<T>): Promise<void> {
    //     await this.repository.update(criteria, partialEntity);
    // }

    async remove(entity: T): Promise<void> {
        await this.repository.remove(entity);
    }

    // Other common methods can be added here
}
