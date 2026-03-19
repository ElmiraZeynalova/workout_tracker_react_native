import { createClient } from '@supabase/supabase-js'
import { useUserStore } from "@/src/store/user-store"
import type {Exercise, SetInfo} from '@/src/store/workout-store'
import Constants from 'expo-constants'
import {getAllWorkoutExercisesDataByDate} from "@/src/sqlite/crud"
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_KEY
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(supabaseUrl!, supabaseKey!, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})

export async function signInUser(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ 
        email: email,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: undefined 
        }
    })
    return { error }
}

export async function verifyOtp(email: string, code: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code, 
        type: 'email'
    })

    return { data, error }
}

export async function syncToServer(date: string){
    const userId = useUserStore.getState().userId
    const exercises = await getAllWorkoutExercisesDataByDate(date)

    const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .upsert(
            { user_id: userId, date: date },
            { onConflict: 'date'}
        )
        .select()
        .single()

    if(workoutError) return { error: workoutError }
    const workoutId = workout.id

    const {error: exerciseError} = await supabase
        .from('exercises')
        .upsert(
            exercises.map(e => (
                { id: e.exerciseId, name: e.exerciseName, workout_id: workoutId }
            ))
        )
    if(exerciseError) return { error: exerciseError }

    const {error: setError} = await supabase
        .from('sets')
        .upsert(
            exercises.flatMap(e => (
                e.sets.map(set => (
                    { id: set.setId, exercise_id: e.exerciseId, reps: set.reps, weight: set.weight }
                ))
            ))
        )
    if(setError) return { error: setError }
    return {error: null}
}




// export async function syncPendingWorkouts(){
//     const workouts = await getAllStoreData("pending_sync_to_server")
//     for(const workout of workouts){
//         try{
//             await syncToServer(workout.date)
//             await deleteWorkoutByDate("pending_sync_to_server", workout.date)
//         }
//         catch(e){
//             break
//         }
//     }
// }   

// export async function syncIDBWithServer(userId: string){
//     const { data: workouts} = await supabase
//         .from('workouts')
//         .select("*")
//         .eq('user_id', userId)

//     if(!workouts) return
//     for(const workout of workouts){
//         const { data: exercises} = await supabase
//             .from('exercises')
//             .select("*")
//             .eq('workout_id', workout.id)
//         if(!exercises) continue

//        const exercisesList: Exercise[] = await Promise.all(
//             exercises.map(async e => {
//                 const { data: sets } = await supabase
//                     .from('sets')
//                     .select("*")
//                     .eq('exercise_id', e.id)
//                 const setsList: SetInfo[] = sets?.map(s => ({
//                     setId: s.id,
//                     reps: s.reps,
//                     weight: s.weight
//                 })) || []
//                 return {
//                     exerciseId: e.id,
//                     exerciseName: e.name,
//                     sets: setsList
//                 }
//             })
//         )
//         await syncWorkoutWithServer("workouts", workout.date, exercisesList)
//     } 
// }

