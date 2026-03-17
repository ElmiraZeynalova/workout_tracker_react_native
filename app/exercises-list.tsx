import {useState} from 'react'
import { useWorkoutStore } from '@/src/store/workout-store'
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native'
import exercises from '@/src/exercises.json'
import { Stack} from "expo-router"
import { useRouter } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo'

export default function ExercisesList(){
    const router = useRouter();
    const [chosenExercises, setChosenExercises] = useState<string[]>([])
    const addNewExercises = useWorkoutStore((state) => state.addNewExercises)

    function handleExerciseChoice(exerciseName: string){
        setChosenExercises((prev) => 
            prev.includes(exerciseName) 
                ? prev.filter(e => e !== exerciseName)
                : [...prev, exerciseName]
        )
    }

    function saveChosenExercises(){
        addNewExercises(chosenExercises)
        router.navigate('/log-workout')
    }

    const exercisesList = exercises.map(exercise => {
        return <View key={exercise.exerciseName} >
                    <Pressable onPress={() => handleExerciseChoice(exercise.exerciseName)}>
                        <Text>{exercise.exerciseName}</Text>
                        <Text>{exercise.muscleGroup}</Text>
                    </Pressable>
                 </View>
    })      
    return(
        <>
            <Stack.Screen options={{
                headerLeft: () => 
                <Pressable onPress={() => router.navigate('/')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                    <Entypo name="chevron-left" size={24} color="black" />
                </Pressable>,
                headerTitle: 'All Exercises',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                }} 
            />
            <ScrollView style={styles.scrollView}>{exercisesList}</ScrollView>
            {chosenExercises.length > 0 && <Pressable onPress={saveChosenExercises} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                <Text>{chosenExercises.length === 1 ? "Add 1 exercise" : `Add ${chosenExercises.length} exercises`}</Text>
            </Pressable>}
    </>
    )
}

const styles = StyleSheet.create({
    scrollView:{
        flex: 1,
    },
    button: {

    },
    pressed: {
      opacity: 0.5,
    },
  
})