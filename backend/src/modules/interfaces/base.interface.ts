export interface IBaseRepository<T> {
    find(options?: Partial<T>): Promise<T[]>;
    findById(id: number | string): Promise<T>;
    save(entity: T): Promise<T>;
    update(id: number | string, entity: Partial<T>): Promise<T>;
    delete(id: number | string): Promise<T>;
}