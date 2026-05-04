import LoggedExerciseCard from '@/src/components/LoggedExerciseCard'
import {Text, StyleSheet, View, Pressable, ScrollView, Button, TouchableOpacity} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import { useRenderWorkoutOnScreenStore } from "../zustand-store/render-workout-store"

export default function DayContent({date}: {date: string}){
    const router = useRouter()
    const workout = useRenderWorkoutOnScreenStore((state) => state.workouts[date])

    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExerciseCard key={exercise.exerciseId} date={date} exercise={exercise}/>
    ))

    const hasWorkout = workout && workout.exercises.length > 0
    return(
        <View style={styles.view}>
            {!hasWorkout && 
                <>
                    <Text style={styles.text}>Workout Log Is Empty</Text>
                    <Pressable testID="newWrk-btn" accessible={true} accessibilityLabel="newWrk-btn" onPress={() => router.navigate('/log-workout')} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
                        <AntDesign name="plus" size={28} color="#FF5526" />
                        <Text style={styles.btnText}>Start New Workout</Text>
                    </Pressable>
                </>
            }
            {hasWorkout && <ScrollView  contentContainerStyle={styles.exercises}>{loggedExercises}</ScrollView>}
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