import Entypo from '@expo/vector-icons/Entypo';
import {View, Pressable, Text, StyleSheet, ScrollView} from "react-native";
import { Stack} from "expo-router";
import { useRouter } from 'expo-router';
import {getExercisesDataByDateAndId,saveWorkout, deleteExercise} from '@/src/sqlite/crud'
import { syncToServer } from '@/src/supabase/crud';
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
    const currentWorkoutExercises = useWorkoutStore((state) => state.exercises)
    const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout) 

    useEffect(() => {
        const loadExercise = async() => {
            const data = await getExercisesDataByDateAndId(workoutDate, exerciseId)
            if(data) loadExerciseForEdit(data)
        }
        loadExercise()
    }, [])

    async function handleSave(){
        console.log("Editing....")
        const cleanedExercises = currentWorkoutExercises
            .map(e => ({
                ...e, sets: e.sets
                        .flatMap(s => s.weight === null ? {...s, weight: 0} : s)
                        .filter(s => s.checked === true)
                        .filter(s => s.reps !== null && s.reps > 0)
            }))
            .filter(e => e.sets.length > 0)

        if(cleanedExercises.length === 0) {
            await deleteExercise(exerciseId)
            clearWorkoutStore()
            router.navigate('/')
        }else{
            await saveWorkout(workoutDate, cleanedExercises, 0)
            clearWorkoutStore()

            router.navigate('/')

            const { error } = await syncToServer(workoutDate)

            if(error) {
                console.warn("Sync failed", error)
            }else{
                console.log("Synced with server")
            }
        }

    }

    return(
        <>
            <Stack.Screen options={{
                headerLeft: () => 
                    <Pressable onPress={() => router.navigate('/')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
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
