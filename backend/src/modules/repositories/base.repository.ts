import { IBaseRepository } from '../interfaces/base.interface';
import { AppDataSource } from './../../data-source';
// src/repositories/BaseRepository.ts
import { Repository, EntityTarget} from 'typeorm';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    protected readonly repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async find(options: any): Promise<T[]> {
        return this.repository.find(options);
    }

    // Dynamically find by primary key
    async findById(id: number | string): Promise<T | null> {
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

    async update(id: number | string, entity: Partial<T>): Promise<T> {
        await this.repository.update(id as any, entity as any);
        return this.findById(id);
    }

    async delete(id: number | string): Promise<T> {
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
}
