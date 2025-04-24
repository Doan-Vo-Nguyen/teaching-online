import { DataSource } from "typeorm";
import "reflect-metadata";
import 'dotenv/config';
import { Logger } from "./modules/config/logger";

/**
 * Configuration for MySQL database connection
 */
const mysqlConfig = {
    type: "mysql" as const,
    host: process.env.MYSQL_PRODUCTION_HOST,
    port: parseInt(process.env.MYSQL_PRODUCTION_PORT || "3306", 10),
    username: process.env.MYSQL_PRODUCTION_USERNAME,
    password: process.env.MYSQL_PRODUCTION_PASSWORD,
    database: process.env.MYSQL_PRODUCTION_DB_NAME,
    synchronize: process.env.NODE_ENV !== 'production', 
    logging: false,
    entities: ['src/**/entity/*.entity.{ts,js}'],
    migrations: ['src/database/migrations/*.{ts,js}'],
    subscribers: ['src/database/subscribers/*.{ts,js}'],
};

/**
 * Configuration for MongoDB connection
 */
const mongoConfig = {
    type: "mongodb" as const,
    url: process.env.MONGO_HOST,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
    entities: ['src/**/entity/*.mongo.ts'],
    migrations: ['src/database/migrations/*.{ts,js}'],
    subscribers: ['src/database/subscribers/*.{ts,js}'],
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

/**
 * MySQL DataSource instance
 * @throws Error if required environment variables are missing
 */
export const AppDataSource = new DataSource(mysqlConfig);

/**
 * MongoDB DataSource instance
 * @throws Error if required environment variables are missing
 */
export const AppDataSource2 = new DataSource(mongoConfig);

/**
 * Initialize both database connections
 * @throws Error if initialization fails
 */
export async function initializeDataSources(): Promise<void> {
    try {
        await Promise.all([
            AppDataSource.initialize(),
            AppDataSource2.initialize()
        ]);
        Logger.info("All database connections initialized successfully");
    } catch (error: any) {
        Logger.error("Failed to initialize database connections:", error);
        throw new Error("Database initialization failed");
    }
}

/**
 * Close all database connections
 */
export async function closeDataSources(): Promise<void> {
    try {
        await Promise.all([
            AppDataSource.destroy(),
            AppDataSource2.destroy()
        ]);
        Logger.info("All database connections closed successfully");
    } catch (error: any) {
        Logger.error("Failed to close database connections:", error);
    }
}
