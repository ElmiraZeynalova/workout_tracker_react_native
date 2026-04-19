import type { SQLiteDatabase } from 'expo-sqlite'

export async function createTables(db: SQLiteDatabase){

    await db.execAsync(`PRAGMA foreign_keys = ON;`)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS workouts (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL UNIQUE,
            is_synced INTEGER DEFAULT 0,
            updated_at TEXT NOT NULL
        );
    `)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS exercises (
            id TEXT PRIMARY KEY,
            workout_id TEXT NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
        );
    `)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sets (
            id TEXT PRIMARY KEY,
            exercise_id TEXT NOT NULL,
            reps INTEGER,
            weight REAL,
            FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
        );
    `)
}
