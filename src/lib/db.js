// SQLite y funciones auxiliares
// src/lib/db.js
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('gym.db');

// Migraciones (tablas + columnas nuevas si no existen)
export async function migrate() {
    await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      photo_uri TEXT,
      remote_photo_url TEXT,
      created_at INTEGER
    );
  `);

    // Columnas adicionales (idempotentes)
    try { await db.execAsync(`ALTER TABLE exercises ADD COLUMN series_min INTEGER`); } catch { }
    try { await db.execAsync(`ALTER TABLE exercises ADD COLUMN series_max INTEGER`); } catch { }
    try { await db.execAsync(`ALTER TABLE exercises ADD COLUMN reps_min INTEGER`); } catch { }
    try { await db.execAsync(`ALTER TABLE exercises ADD COLUMN reps_max INTEGER`); } catch { }
    try { await db.execAsync(`ALTER TABLE exercises ADD COLUMN default_weight REAL`); } catch { }
}

// Helpers
export async function q(sql, params = []) {
    return db.getAllAsync(sql, params);
}
export async function run(sql, params = []) {
    return db.runAsync(sql, params);
}
