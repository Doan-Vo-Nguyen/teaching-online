import { DataSource } from "typeorm";
import "reflect-metadata";
import 'dotenv/config';

// MySQL DataSource
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_PRODUCTION_HOST,
    port: parseInt(process.env.MYSQL_PRODUCTION_PORT, 10),
    username: process.env.MYSQL_PRODUCTION_USERNAME,
    password: process.env.AVNS_bsK6jN7r1n481OEv,
    database: "teaching",
    synchronize: true,
    logging: false,
    entities: ['src/**/entity/*.entity.{ts,js}'],
    migrations: [],
    subscribers: [],
});

// MongoDB DataSource
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
