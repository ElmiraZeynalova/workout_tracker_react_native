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
        loadWorkout()
    }, [])

    async function loadWorkout(){
        const data = await getAllWorkoutExercisesDataByDate(date)
        setWorkout(data) 
        setLoading(false)
    }
    const loggedExercises = workout?.map(exercise => (
        <LoggedExercise key={exercise.exerciseId} date={date} exercise={exercise} onDelete={loadWorkout}/>
    ))

    return(
        <View style={styles.view}>
            {!loading && (workout && workout.length === 0) && 
                <>
                    <Text style={styles.text}>Workout Log Is Empty</Text>
                    <Pressable onPress={() => router.navigate('/log-workout')} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
                        <AntDesign name="plus" size={28} color="#FF5526" />
                        <Text style={styles.btnText}>Start New Workout</Text>
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
    exercises: {
        flexDirection: 'column',
        gap: 12,
        paddingBottom: 12
    },
    text: {
        color: '#00000072',
        fontWeight: 400,
        fontSize: 22,
        textAlign: 'center',
        flexGrow: 1,
        marginTop: 250
    },
    btn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginBottom: 10
    },
    pressed: {
      opacity: 0.5,
    },
    btnText: {
        color: '#00000072',
        fontWeight: 400,
        fontSize: 17,

    }

})