import Entypo from '@expo/vector-icons/Entypo';
import {View, Pressable, Text, StyleSheet, ScrollView} from "react-native";
import { Stack} from "expo-router";
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router'
import {useEffect} from 'react'
import { useDateStore } from "@/src/zustand-store/date-store";
import { useEditExerciseStore } from '@/src/zustand-store/edit-exercise-store';
import EditExerciseCard from '@/src/components/EditExerciseCard'
import {useRenderWorkoutOnScreenStore} from '@/src/zustand-store/render-workout-store'
import { deleteExerciseById, editExercise, markWorkoutUnsynced } from '@/src/sqlite/crud';
import { syncServerWithSQLite } from '@/src/supabase/crud';

type SetInfo = {
    setId: string
    reps: number 
    weight: number
    checked: boolean
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}

export default function EditExercise(){
    const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>()
    const router = useRouter()
    const workoutDate = useDateStore(state => state.selectedDate)
    const setExerciseForEdit = useEditExerciseStore(state => state.setExerciseForEdit)
    const editingExercise = useEditExerciseStore((state) => state.editingExercise)
    const workout = useRenderWorkoutOnScreenStore((state) => state.workouts[workoutDate])
    const exercise = workout?.exercises.find(e => e.exerciseId === exerciseId)
    const removeExercise = useRenderWorkoutOnScreenStore((state) => state.removeExercise)
    const updateExercise = useRenderWorkoutOnScreenStore((state) => state.updateExercise)

    useEffect(() => {
        if (!exercise) return

        const formattedExercise: Exercise = {
            ...exercise,
            sets: exercise.sets.map(s => ({
                setId: s.setId,
                reps: s.reps,
                weight: s.weight,
                checked: true
            }))
        }

        setExerciseForEdit(formattedExercise)
    }, [exercise?.exerciseId])

    async function handleSave(){
        const cleanExerciseData = {
            exerciseId: editingExercise.exerciseId,
            exerciseName: editingExercise.exerciseName,
            sets: editingExercise.sets
                    .filter(s => s.checked === true)
                    .map(s => ({setId: s.setId, reps: s.reps, weight: s.weight}))
                    .filter(s => s.reps !== null && s.reps > 0)
                    .map(s => s.weight === null ? {...s, weight: 0} : s)
        }
        if(cleanExerciseData.sets.length === 0) {
            removeExercise(workoutDate, cleanExerciseData.exerciseId)
            await deleteExerciseById(workoutDate, exerciseId)
        }else{
            updateExercise(workoutDate, cleanExerciseData)
            await editExercise(workoutDate, cleanExerciseData)
        }
        try {
            await markWorkoutUnsynced(workoutDate)
        } catch(e) {
            console.warn("Failed to mark workout unsynced:", e)
        }
        router.navigate('/')
        syncServerWithSQLite().catch(console.warn)
    }

    function handleExitEditPage(){
        router.navigate('/')
    }
    return(
        <>
            <Stack.Screen options={{
                headerLeft: () => 
                    <Pressable onPress={handleExitEditPage} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                        <Entypo name="chevron-left" size={24} color="black" />
                    </Pressable>,
                headerRight: () => 
                    <Pressable onPress={handleSave} style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}>
                        <Text style={{color: '#FF5526', fontSize: 12, fontWeight: 500, }}>Save</Text>
                    </Pressable>,
                headerTitle: 'Edit Exercise',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: '#F3F3F3', 
                },
            }} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <EditExerciseCard/>
            </ScrollView>
            

      </>
    )
}

const styles = StyleSheet.create({
  headerBtn: {
    borderWidth: 1.5,
    borderColor: '#FF5526',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 18
  },
  pressed: {
      opacity: 0.5,
  },
  scrollView:{
    backgroundColor: '#F3F3F3',
    flexDirection: 'column',
    paddingHorizontal: 7,
  }
})
