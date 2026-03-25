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
//[{workoutId: w.id, date: w.date, exercises: exercises}]
//[{exerciseId: e.id, exerciseName: e.name, sets: sets}]
//[{setId: s.id,reps: s.reps, weight: s.weight, checked: true}]
export async function syncWorkouts(){
    const userId = useUserStore.getState().userId
    const workoutsData = await getUnsyncedWorkouts()
    if(!workoutsData) return 
    for(const w of workoutsData){
        const { data: workout, error: workoutError } = await supabase
            .from('workouts')
            .upsert(
                { user_id: userId, date: w.date },
                { onConflict: 'date'}
            )
            .select()
            .single()

        if(workoutError) return { error: workoutError }
        const workoutId = workout.id

        const {error: exerciseError} = await supabase
            .from('exercises')
            .upsert(
                w.exercises.map(e => (
                    { id: e.exerciseId, name: e.exerciseName, workout_id: workoutId }
                ))
            )
        if(exerciseError) return { error: exerciseError }

        const {error: setError} = await supabase
            .from('sets')
            .upsert(
                w.exercises.flatMap(e => (
                    e.sets.map(set => (
                        { id: set.setId, exercise_id: e.exerciseId, reps: set.reps, weight: set.weight }
                    ))
                ))
            )
        if(setError) return { error: setError }
        await markWorkoutSynced(w.workoutId)
    }
    return {error: null}
}
