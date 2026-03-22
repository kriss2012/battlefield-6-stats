import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  try {
    console.log('📊 Initializing database schema...');

    // Phase 2 schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('✅ Phase 2 schema initialized');

    // Phase 3 schema
    const schema3Path = path.join(__dirname, 'schema_phase3.sql');
    const schema3 = fs.readFileSync(schema3Path, 'utf-8');
    await pool.query(schema3);
    console.log('✅ Phase 3 schema initialized');

    // Phase 4 schema (Notifications)
    const schema4Path = path.join(__dirname, 'schema_notifications.sql');
    const schema4 = fs.readFileSync(schema4Path, 'utf-8');
    await pool.query(schema4);
    console.log('✅ Phase 4 schema initialized');

    // Game Save schema
    const schemaGamePath = path.join(__dirname, 'schema_game.sql');
    const schemaGame = fs.readFileSync(schemaGamePath, 'utf-8');
    await pool.query(schemaGame);
    console.log('✅ Game Save schema initialized');

    console.log('✅ All database schemas initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}
