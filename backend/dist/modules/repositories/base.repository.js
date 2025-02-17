import { AppDataSource } from './../../data-source';
export class BaseRepository {
    entity;
    repository;
    constructor(entity) {
        this.entity = entity;
        this.repository = AppDataSource.getRepository(this.entity);
    }
    async find(options) {
        return this.repository.find(options);
    }
    async findById(id) {
        const primaryColumns = this.repository.metadata.primaryColumns;
        if (primaryColumns.length !== 1) {
            throw new Error(`Entity must have exactly one primary column.`);
        }
        const primaryKey = primaryColumns[0].propertyName;
        return this.repository.findOneBy({ [primaryKey]: id });
    }
    async save(entity) {
        return this.repository.save(entity);
    }
    async update(criteria, partialEntity) {
        return this.repository.update(criteria, partialEntity);
    }
    async delete(id) {
        const primaryColumns = this.repository.metadata.primaryColumns;
        if (primaryColumns.length !== 1) {
            throw new Error(`Entity must have exactly one primary column.`);
        }
        const primaryKey = primaryColumns[0].propertyName;
        const entity = await this.repository.findOneBy({ [primaryKey]: id });
        if (!entity) {
            throw new Error(`Entity with id ${id} not found.`);
        }
        return this.repository.remove(entity);
    }
}
//# sourceMappingURL=base.repository.js.map