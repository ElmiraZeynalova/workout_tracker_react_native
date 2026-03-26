import Entypo from '@expo/vector-icons/Entypo';
import {View, Pressable, Text, StyleSheet, ScrollView} from "react-native";
import { Stack} from "expo-router";
import { useRouter } from 'expo-router';
import {getExercisesDataByDateAndId,saveWorkout, deleteExercise, getWorkoutId, markWorkoutUnsynced} from '@/src/sqlite/crud'
import { useLocalSearchParams } from 'expo-router'
import {useEffect} from 'react'
import { useDateStore } from "@/src/store/date-store";
import { useWorkoutStore } from '@/src/store/workout-store';
import LogExercise from '@/src/components/LogExercise'

export default function EditExercise(){
    const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>()
    const router = useRouter()
    const workoutDate = useDateStore(state => state.selectedDate)
    const loadExerciseForEdit = useWorkoutStore(state => state.loadExerciseForEdit)
    const editingExercise = useWorkoutStore((state) => state.exercises[0])
    const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout) 

    useEffect(() => {
        const loadExercise = async() => {
            const data = await getExercisesDataByDateAndId(workoutDate, exerciseId)
            if(data) loadExerciseForEdit(data)
        }
        loadExercise()
    }, [])

    async function handleSave(){
        const cleanExerciseData = {
            exerciseId: editingExercise.exerciseId,
            exerciseName: editingExercise.exerciseName,
            sets: editingExercise.sets
                    .filter(s => s.checked === true)
                    .filter(s => s.reps !== null && s.reps > 0)
                    .flatMap(s => s.weight === null ? {...s, weight: 0} : s)
        }
        if(cleanExerciseData.sets.length === 0) {
            await deleteExercise(exerciseId)
        }else{
            await saveWorkout(workoutDate, [cleanExerciseData], 0)
        }
        try {
            const workoutId = await getWorkoutId(workoutDate)
            if(workoutId) await markWorkoutUnsynced(workoutId)
        } catch(e) {
            console.warn("Failed to mark workout unsynced:", e)
        }
        clearWorkoutStore()
        router.navigate('/')
    }

    function handleExitEditPage(){
        clearWorkoutStore()
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
                <LogExercise exerciseId={exerciseId}/>
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
    paddingHorizontal: 12,
  }
})
