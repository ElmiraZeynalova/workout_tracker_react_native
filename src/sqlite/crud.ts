import {openDB} from './open_db'
import * as Crypto from 'expo-crypto'


type SetInfo = {
    setId: string
    reps: number
    weight: number
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}

type Workout = {
    date: string
    exercises: Exercise[]
}

type WorkoutRow = {
  id: string
  date: string
  is_synced: number
  updated_at: string
}
type ExerciseRow = {
    id: string
    name: string
    workout_id: string
}
type SetRow = { 
    id: string; 
    exercise_id: string
    reps: number; 
    weight: number 
}

export async function saveWorkout(date: string, exercises: Exercise[], status: number){
    const db = await openDB()
    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE date = ?`,
        [date]
    )
    const workoutData = rawData as unknown as WorkoutRow[]

    let workoutId
    const now = new Date().toISOString()

    if (workoutData.length > 0) {
        workoutId = workoutData[0].id
        await db.runAsync(`
            UPDATE workouts SET is_synced = ?, updated_at = ? WHERE id = ?
        `, [status, now, workoutId])
    } else {
        workoutId = Crypto.randomUUID()
        await db.runAsync(`
            INSERT INTO workouts (
                id, date, is_synced, updated_at
            )
            VALUES (?, ?, ?, ?)`,
            [
                workoutId,
                date,
                status,
                now

            ]
        )
    }

    for (const exercise of exercises) {
        await db.runAsync(`
            INSERT OR REPLACE INTO exercises (id, workout_id, name)
            VALUES (?, ?, ?)
        `, [
            exercise.exerciseId,
            workoutId,
            exercise.exerciseName
        ])

        await db.runAsync(`
            DELETE FROM sets WHERE exercise_id = ?
            `, [exercise.exerciseId])

        for(const set of exercise.sets){
            await db.runAsync(`
                INSERT OR REPLACE INTO sets (id, exercise_id, reps, weight)
                VALUES (?, ?, ?, ?)`,
                [
                    set.setId,
                    exercise.exerciseId,
                    set.reps,
                    set.weight

                ]
            )
        }

    }

    
}

export async function editExercise(workoutDate: string, newExerciseData: Exercise) {
    const db = await openDB()

    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE date = ?`,
        [workoutDate]
    )

    const workoutData = rawData as unknown as WorkoutRow[]
    if (workoutData.length === 0) return

    const workoutId = workoutData[0].id
    const exerciseId = newExerciseData.exerciseId
    const now = new Date().toISOString()

    await db.runAsync(`
        UPDATE workouts SET updated_at = ? WHERE id = ?
    `, [now, workoutId])

    await db.runAsync(`
        DELETE FROM sets WHERE exercise_id = ?
    `, [exerciseId])

    for (const set of newExerciseData.sets) {
        await db.runAsync(`
            INSERT INTO sets (id, reps, weight, exercise_id)
            VALUES (?, ?, ?, ?)
        `, [
            set.setId,
            set.reps,
            set.weight,
            exerciseId
        ])
    }
}

export async function deleteExerciseById(workoutDate: string, exerciseId: string) {
    const db = await openDB()

    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE date = ?`,
        [workoutDate]
    )

    const workoutData = rawData as unknown as WorkoutRow[]
    if (workoutData.length === 0) return

    const workoutId = workoutData[0].id
    const now = new Date().toISOString()

    await db.runAsync(`
        UPDATE workouts SET updated_at = ? WHERE id = ?
    `, [now, workoutId])

    await db.runAsync(`
        DELETE FROM exercises 
        WHERE id = ? AND workout_id = ?
    `, [exerciseId, workoutId])
}

export async function getWorkoutByDate(date: string){
    const db = await openDB()
    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts WHERE date = ?`,
        [date]
    )

    const workoutData = rawData as unknown as WorkoutRow[]
    if (workoutData.length === 0) return

    const workout = workoutData[0]
    const workoutId = workout.id

    const exercises = []
    const rawExercisesData = await db.getAllAsync(
        `SELECT * FROM exercises WHERE workout_id = ?
        `, [workoutId]
    )
    const exercisesData = rawExercisesData as unknown as ExerciseRow[]

    for(const e of exercisesData){
        const rawData = await db.getAllAsync(
            `SELECT * FROM sets WHERE exercise_id = ?`,
            [e.id]
            )

        const setsData = rawData as unknown as SetRow[]

        const sets = setsData.map(s => ({
            setId: s.id,
            reps: s.reps,
            weight: s.weight
        }))

        const exercise = {exerciseId: e.id, exerciseName: e.name, sets: sets}
        exercises.push(exercise)
            
    }
        return {date: workout.date, is_synced: workout.is_synced, updated_at: workout.updated_at, exercises: exercises}
}




export async function getAllWorkouts(){
    const db = await openDB()
    const workouts = []

    const rawData = await db.getAllAsync(
        `SELECT * FROM workouts`
    )

    const workoutsData = rawData as unknown as WorkoutRow[]

    for(const w of workoutsData){
        const exercises = []
        const rawData = await db.getAllAsync(
            `SELECT * FROM exercises WHERE workout_id = ?`,
            [w.id]
            )
        const exercisesData = rawData as unknown as ExerciseRow[]

        for(const e of exercisesData){
            const rawData = await db.getAllAsync(
                `SELECT * FROM sets WHERE exercise_id = ?`,
                [e.id]
                )

            const setsData = rawData as unknown as SetRow[]

            const sets = setsData.map(s => ({
                setId: s.id,
                reps: s.reps,
                weight: s.weight
            }))

            const exercise = {exerciseId: e.id, exerciseName: e.name, sets: sets}
            exercises.push(exercise)
            
        }
        const workout = {date: w.date, is_synced: w.is_synced, updated_at: w.updated_at, exercises: exercises}
        workouts.push(workout)
    }
    return workouts
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

        for(const e of exerciseData){
            const setsRaw = await db.getAllAsync(
                `SELECT * FROM sets WHERE exercise_id = ?`,
                [e.id]
             )
            const setsData = setsRaw as unknown as SetRow[]

            const sets = setsData.map(s => ({
                setId: s.id,
                reps: s.reps,
                weight: s.weight,
                checked: true
            }))
            const exercise = {exerciseId: e.id, exerciseName: e.name, sets: sets}
            exercises.push(exercise)
        }
        const workout = {workoutId: w.id, date: w.date, is_synced: w.is_synced, updated_at: w.updated_at, exercises: exercises}
        workouts.push(workout)
    }
    return workouts
}


export async function markWorkoutSynced(date: string){
    const db = await openDB()
    await db.runAsync(`UPDATE workouts SET is_synced = 1 WHERE date = ?`, [date])
}

export async function markWorkoutUnsynced(date: string){
    const db = await openDB()
    await db.runAsync(`UPDATE workouts SET is_synced = 0 WHERE date = ?`, [date])
}

export async function deleteWorkoutByDate(date: string) {
    const db = await openDB()
    await db.runAsync(`
        DELETE FROM workouts WHERE date=?
    `, [date])
}

export async function cleanDB(){
    const db = await openDB()
    await db.runAsync(
        `DELETE FROM workouts`,
    );
}

export async function deleteTables(){
    const db = await openDB()
    await db.execAsync(`
        DROP TABLE IF EXISTS workouts;
        DROP TABLE IF EXISTS exercises;
        `);
}



// export async function printAllWorkouts() {
//   const db = await openDB()
//   const data = await db.getAllAsync(`SELECT * FROM workouts`)
//   console.log('WORKOUTS:', data)
  
//   const exercises = await db.getAllAsync(`SELECT * FROM exercises`)
//   console.log('EXERCISES:', exercises)
  
//   const sets = await db.getAllAsync(`SELECT * FROM sets`)
//   console.log('SETS:', sets)
// }
