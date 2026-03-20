import * as SQLite from 'expo-sqlite'
import {createTables} from './create_tables'
import type { SQLiteDatabase } from 'expo-sqlite'

const DB_NAME = 'workouts'
let dbInstance: SQLiteDatabase | null = null

export async function openDB() {
    if (dbInstance) return dbInstance 

    const db = await SQLite.openDatabaseAsync(DB_NAME)
    await db.execAsync(`PRAGMA foreign_keys = ON;`)
    // await db.runAsync(`DELETE FROM sets`);
    // console.log("set table deleted")
    // await db.runAsync(`DELETE FROM exercises`);
    // console.log("exercise table deleted")
    // await db.runAsync(`DELETE FROM workouts`);
    // console.log("workout table deleted")
    await createTables(db)

    dbInstance = db
    return db
}
