import { AppDataSource } from './../../data-source';
// src/repositories/BaseRepository.ts
import { Repository, EntityTarget, FindOptionsWhere, UpdateResult, DeepPartial} from 'typeorm';

export class BaseRepository<T> {
    protected readonly repository: Repository<T>;

    constructor(private readonly entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(this.entity);
    }

    async find(options: any): Promise<T[]> {
        return this.repository.find(options);
    }

    // Dynamically find by primary key
    async findById(id: number): Promise<T | null> {
        const primaryColumns = this.repository.metadata.primaryColumns;
        if (primaryColumns.length !== 1) {
          throw new Error(`Entity must have exactly one primary column.`);
        }
    
        const primaryKey = primaryColumns[0].propertyName; // Dynamically get primary key name
        return this.repository.findOneBy({ [primaryKey]: id } as any);
      }

    async save(entity: T): Promise<T> {
        return this.repository.save(entity);
    }

    async update(criteria: number, partialEntity: DeepPartial<T>): Promise<UpdateResult> {
        return this.repository.update(criteria, partialEntity as any);
    }

    async delete(id: number): Promise<T> {
        const primaryColumns = this.repository.metadata.primaryColumns;
        if (primaryColumns.length !== 1) {
          throw new Error(`Entity must have exactly one primary column.`);
        }
    
        const primaryKey = primaryColumns[0].propertyName; // Dynamically get primary key name
        const entity = await this.repository.findOneBy({ [primaryKey]: id } as any);
        if (!entity) {
            throw new Error(`Entity with id ${id} not found.`);
        }
        return this.repository.remove(entity);
    }

    // Other common methods can be added here
}
