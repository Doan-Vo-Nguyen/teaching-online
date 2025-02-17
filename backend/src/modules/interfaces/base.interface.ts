export interface IBaseRepository<T> {
    find(options?: Partial<T>): Promise<T[]>;
    findById(id: number): Promise<T>;
    save(entity: T): Promise<T>;
    update(id: number, entity: Partial<T>): Promise<T>;
    delete(id: number): Promise<T>;
}