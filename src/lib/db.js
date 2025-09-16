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

  /* Rutinas */
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      created_at INTEGER
    );
  `);

  /* Puente rutina ↔ ejercicio (con orden) */
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routine_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routine_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      UNIQUE (routine_id, exercise_id),
      FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
  `);

  /* Índices útiles */
  await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON routine_exercises(routine_id, position);`);
  await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_routine_exercises_exercise ON routine_exercises(exercise_id);`);
}

// Helpers
export async function q(sql, params = []) {
  return db.getAllAsync(sql, params);
}
export async function run(sql, params = []) {
  return db.runAsync(sql, params);
}
