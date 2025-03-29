import { DataSource } from "typeorm";
import "reflect-metadata";
import 'dotenv/config';

// MySQL DataSource
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_PRODUCTION_HOST,
    port: parseInt(process.env.MYSQL_PRODUCTION_PORT, 10),
    username: process.env.MYSQL_PRODUCTION_USERNAME,
    password: process.env.MYSQL_PRODUCTION_PASSWORD,
    database: process.env.MYSQL_PRODUCTION_DB_NAME,
    synchronize: true,
    logging: false,
    entities: ['src/**/entity/*.entity.{ts,js}'],
    migrations: [],
    subscribers: [],
});

// MongoDB DataSource
export const AppDataSource2 = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_HOST,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    logging: true,
    entities: ['src/**/entity/Comment.mongo.ts'],
    migrations: [],
    subscribers: [],
});
