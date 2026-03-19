import {getAllWorkoutExercisesDataByDate} from "@/src/sqlite/crud"
import {useEffect, useState} from "react"
import type {Exercise} from '@/src/store/workout-store'
import LoggedExercise from '@/src/components/LoggedExercise'
import {Text, StyleSheet, View, Pressable, ScrollView} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'

export default function DayContent({date}: {date: string}){
    const [workout, setWorkout] = useState<Exercise[] | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        async function loadWorkout(){
        const data = await getAllWorkoutExercisesDataByDate(date)
        setWorkout(data ?? []) 
        setLoading(false)
        }
        loadWorkout()
    }, [date])

    const loggedExercises = workout?.map(exercise => (
        <LoggedExercise key={exercise.exerciseId} exercise={exercise}/>
    ))

    return(
        <View style={styles.view}>
            {!loading && (workout && workout.length === 0) && 
                <>
                    <Text>Workout Log Is Empty</Text>
                    <Pressable onPress={() => router.navigate('/log-workout')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                        <AntDesign name="plus" size={24} color="black" />
                        <Text>Start New Workout</Text>
                    </Pressable>
                </>
            }
            {!loading && (workout && workout.length > 0) && <ScrollView  contentContainerStyle={styles.exercises}>{loggedExercises}</ScrollView>}
        </View>

    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    exercises:{
        flexDirection: 'column',
        gap: 12,
    }
})