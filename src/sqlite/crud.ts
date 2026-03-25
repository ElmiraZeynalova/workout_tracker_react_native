import {openDB} from './open_db'
import * as Crypto from 'expo-crypto'
import { Exercise } from '../store/workout-store'

type WorkoutRow = {
  id: string
  date: string
  is_synced: number
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

export async function getUnsyncedWorkouts(){
    const db = await openDB()
    const workouts = []
    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE is_synced = ?`,
        [0]
    )
    const workoutsData = rawData as unknown as WorkoutRow[]
    if (!workoutsData.length) return null

    for(const w of workoutsData){
        const exercises = []
        const exercisesRaw = await db.getAllAsync(
            `SELECT * FROM exercises WHERE workout_id = ?`,
            [w.id]
         )
        const exerciseData = exercisesRaw as unknown as ExerciseRow[]
        if (!exerciseData.length) return null

        for(const e of exerciseData){
            const setsRaw = await db.getAllAsync(
                `SELECT * FROM sets WHERE exercise_id = ?`,
                [e.id]
             )
            const setsData = setsRaw as unknown as SetRow[]
            if (!setsData.length) continue
            const sets = setsData.map(s => ({
                setId: s.id,
                reps: s.reps,
                weight: s.weight,
                checked: true
            }))
            const exercise = {exerciseId: e.id, exerciseName: e.name, sets: sets}
            exercises.push(exercise)
        }
        const workout = {workoutId: w.id, date: w.date, exercises: exercises}
        workouts.push(workout)
    }
    return workouts
}

export async function markWorkoutSynced(workoutId: string){
    const db = await openDB()
    await db.runAsync(`UPDATE workouts SET is_synced = 1 WHERE id = ?`, [workoutId])
}

export async function getExercisesDataByDateAndId(date: string, exerciseId: string){
    const db = await openDB()
    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE date = ?`,
        [date]
    )
    const data = rawData as unknown as WorkoutRow[]
    if (!data.length) return null
    const workoutId = data[0].id

    const exercisesRaw = await db.getAllAsync(
        `SELECT * FROM exercises WHERE workout_id = ? AND id = ?`,
        [workoutId, exerciseId]
    )
    
    const exerciseData = exercisesRaw as unknown as ExerciseRow[]
    if (!exerciseData.length) return null
    
    const setsRaw = await db.getAllAsync(
            `SELECT * FROM sets WHERE exercise_id = ?`,
            [exerciseId]
    )
    const setsData = setsRaw as unknown as SetRow[]

    const sets = setsData.map(s => ({
        setId: s.id,
        reps: s.reps,
        weight: s.weight,
        checked: true
    }))

    return {exerciseId: exerciseId, exerciseName: exerciseData[0].name, sets: sets}
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
            weight: s.weight,
            checked: true
        }))

        e.sets = sets
        exercisesList.push(e)
    }

    return exercisesList
}

export async function saveWorkout(date: string, exercises: Exercise[], status: number){
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
                id, date, is_synced
            )
            VALUES (?, ?, ?)`,
            [
                workoutId,
                date,
                status

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

export async function cleanDB(){
    const db = await openDB()
    await db.runAsync(
        `DELETE FROM sets`,
    );
    await db.runAsync(
        `DELETE FROM exercises`,
    );
    await db.runAsync(
        `DELETE FROM workouts`,
    );
}

export async function deleteExercise(id: string){
    const db = await openDB()
    await db.runAsync(
        `DELETE FROM exercises WHERE id = ?;`,
        [id],
    );
    console.log("exerrcise deleted")
}