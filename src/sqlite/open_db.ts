import * as SQLite from 'expo-sqlite'
import {createTables} from './create_tables'
import type { SQLiteDatabase } from 'expo-sqlite'

const DB_NAME = 'workouts'
let dbInstance: SQLiteDatabase | null = null
let dbPromise: Promise<SQLiteDatabase> | null = null
export async function openDB() {
    if (dbInstance) return dbInstance 
    if (dbPromise) return dbPromise
    dbPromise = (async () => {
        const db = await SQLite.openDatabaseAsync(DB_NAME)           
        await db.execAsync(`PRAGMA foreign_keys = ON;`)
        await createTables(db)
        dbInstance = db
        return db
    })()
    return dbPromise
}
