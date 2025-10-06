import { AppDataSource } from '../data-source';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '../modules/config/logger';

/**
 * Run the OneCompiler migration script
 * This should be run before TypeORM sync to avoid conflicts
 */
async function runMigration() {
    try {
        Logger.info('Starting OneCompiler migration...');
        
        // Read the migration file
        const migrationPath = join(__dirname, '../migrations/update-language-code-for-onecompiler.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        Logger.info(`Found ${statements.length} SQL statements to execute`);
        
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                Logger.info(`Executing statement ${i + 1}/${statements.length}`);
                await AppDataSource.query(statement);
                Logger.info(`✅ Statement ${i + 1} executed successfully`);
            } catch (error: any) {
                // Log error but continue with other statements
                if (error.message.includes('already exists') || 
                    error.message.includes('Duplicate column name') ||
                    error.message.includes('Duplicate key name')) {
                    Logger.info(`⚠️ Statement ${i + 1} skipped (already exists): ${error.message}`);
                } else {
                    Logger.warn(`❌ Statement ${i + 1} failed: ${error.message}`);
                    Logger.warn(`Statement: ${statement.substring(0, 100)}...`);
                }
            }
        }
        
        Logger.info('OneCompiler migration completed successfully');
    } catch (error: any) {
        Logger.error('Migration failed:', error);
        throw error;
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    runMigration()
        .then(() => {
            Logger.info('Migration script completed');
            process.exit(0);
        })
        .catch((error) => {
            Logger.error('Migration script failed:', error);
            process.exit(1);
        });
}

export { runMigration };
