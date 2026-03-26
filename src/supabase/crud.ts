import { createClient } from '@supabase/supabase-js'
import { useUserStore } from "@/src/store/user-store"
import type {Exercise, SetInfo} from '@/src/store/workout-store'
import Constants from 'expo-constants'
import {getUnsyncedWorkouts, markWorkoutSynced} from "@/src/sqlite/crud"
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

export async function syncWorkouts(){
    const userId = useUserStore.getState().userId
    const workoutsData = await getUnsyncedWorkouts()
    console.log(workoutsData)
    if(!workoutsData) return 

    for(const w of workoutsData){
        if(w.exercises.length === 0){
            console.log("updated workout is empty? so i'm deleting it...")
            const {data: workoutData, error: workoutError} = await supabase
                .from('workouts')
                .select('id')
                .eq('date', w.date)
                .eq('user_id', userId)
                .single()
            const workoutId = workoutData?.id
            const {data: exercises, error: exerciseError} = await supabase
                .from('exercises')
                .select('id')
                .eq('workout_id', workoutId)

            const exerciseIds = exercises?.map(e => e.id) || []

            if(exerciseIds && exerciseIds.length > 0){
                await supabase.from('sets').delete().in('exercise_id', exerciseIds)
                await supabase.from('exercises').delete().in('id', exerciseIds)
            }

            if(workoutId){
                await supabase.from('workouts').delete().eq('id', workoutId)
            }
            await markWorkoutSynced(w.workoutId)
            console.log("delted and marked synced")
            continue
        }
        const { data: workout, error: upsertWorkoutError } = await supabase
            .from('workouts')
            .upsert(
                { user_id: userId, date: w.date },
                { onConflict: 'user_id,date' }
            )
            .select()
            .single()

        if(upsertWorkoutError) return { error: upsertWorkoutError}
        const workoutId = workout.id

        const {data: exercises, error: getExerciseError} = await supabase
            .from('exercises')
            .select()
            .eq('workout_id', workoutId)

        if(getExerciseError) return { error: getExerciseError }
        const exerciseIds = exercises.map(e => e.id) || []

        const {error: deleteSetsError} = await supabase
            .from('sets')
            .delete()
            .in('exercise_id', exerciseIds)
        if(deleteSetsError) return { error: deleteSetsError }

        const {error: deleteExercisesError} = await supabase
            .from('exercises')
            .delete()
            .eq('workout_id', workoutId)

        if(deleteExercisesError) return { error: deleteExercisesError }

        const {error: insertExercisesError} = await supabase
            .from('exercises')
            .insert(
                w.exercises.map(e => (
                    {id: e.exerciseId, name: e.exerciseName, workout_id: workoutId}
                ))
            )
        if(insertExercisesError) return { error: insertExercisesError}

        const {error: insertSetsError} = await supabase
            .from('sets')
            .insert(
                w.exercises.flatMap(e => 
                    e.sets.map(s => (
                        {id: s.setId, exercise_id: e.exerciseId, reps: s.reps, weight: s.weight}
                    )
                ))
            )
        if(insertSetsError) return { error: insertSetsError}

        await markWorkoutSynced(w.workoutId)
    }
    return {error: null}
}
