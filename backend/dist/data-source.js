import { DataSource } from "typeorm";
import "reflect-metadata";
import 'dotenv/config';
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_PRODUCTION_HOST,
    port: parseInt(process.env.MYSQL_PRODUCTION_PORT, 10),
    username: process.env.MYSQL_PRODUCTION_USERNAME,
    password: process.env.MYSQL_PRODUCTION_PASSWORD,
    database: "teaching",
    synchronize: true,
    logging: false,
    entities: ['src/**/entity/*.entity.{ts,js}'],
    migrations: [],
    subscribers: [],
});
export const AppDataSource2 = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "teaching_online",
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    useUnifiedTopology: true,
    synchronize: true,
    logging: true,
    entities: ['src/**/entity/Comment.mongo.ts'],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map