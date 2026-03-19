import {openDB} from './open_db'
import type { Exercise } from '../store/workout-store'
import * as Crypto from 'expo-crypto'

type WorkoutRow = {
  id: string
  date: string
}
type ExerciseRow = {
    id: string
    name: string
    workout_id: string
}
type SetRow = { 
    id: string; 
    exercise_id: string; 
    reps: number | null; 
    weight: number | null 
}

export async function getAllWorkoutExercisesDataByDate(date: string){
    const db = await openDB()
    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE date = ?`,
        [date]
    )
    const data = rawData as unknown as WorkoutRow[]
    if (!data.length) return []
    const workoutId = data[0].id

    const exercisesRaw = await db.getAllAsync(
        `SELECT * FROM exercises WHERE workout_id = ?`,
        [workoutId]
    )
    const exercisesList: Exercise[] = []
    const exercisesData = exercisesRaw as unknown as ExerciseRow[]
    for(const exercise of exercisesData){
        const e: Exercise = {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: []
        }

        const setsRaw = await db.getAllAsync(
            `SELECT * FROM sets WHERE exercise_id = ?`,
            [exercise.id]
        )
        const setsData = setsRaw as unknown as SetRow[]

        const sets = setsData.map(s => ({
            setId: s.id,
            reps: s.reps,
            weight: s.weight
        }))

        e.sets = sets
        exercisesList.push(e)
    }

    return exercisesList
}

export async function saveWorkout(date: string, exercises: Exercise[]){
    const db = await openDB()
    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE date = ?`,
        [date]
    )
    const data = rawData as unknown as WorkoutRow[]
    let workoutId: string

    if (data.length > 0) {
        workoutId = data[0].id
    } else {
        workoutId = Crypto.randomUUID()
        await db.runAsync(`
            INSERT OR REPLACE INTO workouts (
                id, date
            )
            VALUES (?, ?)`,
            [
                workoutId,
                date

            ]
        )
    }

    for(const exercise of exercises){
        await db.runAsync(`
            INSERT OR REPLACE INTO exercises (
                id, workout_id, name
            )
            VALUES (?, ?, ?)`,
            [
                exercise.exerciseId,
                workoutId,
                exercise.exerciseName

            ]
        )
        for(const set of exercise.sets){
            await db.runAsync(`
                INSERT OR REPLACE INTO sets (
                    id, exercise_id, reps, weight
                )
                VALUES (?, ?, ?, ?)`,
                [
                    set.setId,
                    exercise.exerciseId,
                    set.reps,
                    set.weight ?? null

                ]
            )
        }

    }
}

export async function printAllWorkouts() {
  const db = await openDB()
  const data = await db.getAllAsync(`SELECT * FROM workouts`)
  console.log('WORKOUTS:', data)
  
  const exercises = await db.getAllAsync(`SELECT * FROM exercises`)
  console.log('EXERCISES:', exercises)
  
  const sets = await db.getAllAsync(`SELECT * FROM sets`)
  console.log('SETS:', sets)
}
