import { Repository, EntityTarget, UpdateResult, DeepPartial } from 'typeorm';
export declare class BaseRepository<T> {
    private readonly entity;
    protected readonly repository: Repository<T>;
    constructor(entity: EntityTarget<T>);
    find(options: any): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    save(entity: T): Promise<T>;
    update(criteria: number, partialEntity: DeepPartial<T>): Promise<UpdateResult>;
    delete(id: number): Promise<T>;
}
