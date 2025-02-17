class ClassesService {
    classesRepository;
    constructor(classesRepository) {
        this.classesRepository = classesRepository;
    }
    async getAll() {
        try {
            const listClasses = await this.classesRepository.find({
                select: ['class_id', 'class_name', 'description', 'teacher_id', 'created_at', 'updated_at'],
            });
            return listClasses;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error fetching classes');
        }
    }
    async getById(class_id) {
        try {
            const classes = await this.classesRepository.findById(class_id);
            return classes;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error fetching class');
        }
    }
    async create(classes) {
        try {
            const newClasses = await this.classesRepository.save(classes);
            return newClasses;
        }
        catch (error) {
            throw new Error('Error creating class');
        }
    }
    async update(class_id, classes) {
        try {
            await this.classesRepository.update(class_id, classes);
            const updatedClasses = await this.classesRepository.findById(class_id);
            return updatedClasses;
        }
        catch (error) {
            throw new Error('Error updating class');
        }
    }
    async delete(class_id) {
        try {
            const deletedClasses = await this.classesRepository.delete(class_id);
            return deletedClasses;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error deleting class');
        }
    }
}
export default ClassesService;
//# sourceMappingURL=classes.service.js.map