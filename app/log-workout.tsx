import {useState} from 'react'
import {View, Pressable, Text, StyleSheet, ScrollView} from "react-native";
import { Stack} from "expo-router";
import { useDateStore } from "@/src/store/date-store";
import { useWorkoutStore } from '@/src/store/workout-store';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Exercise from '@/src/components/Exercise'

export default function LogWorkout() {
  const router = useRouter();
  const currentWorkoutDate = useDateStore(state => state.selectedDate)
  const currentWorkoutExercises = useWorkoutStore((state) => state.exercises)
  const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout)

  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false)
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false)

  const exerciseCards = currentWorkoutExercises.map(exercise => {
      return <Exercise key={exercise.exerciseId} exerciseId={exercise.exerciseId}/>
  })

  const notValid = currentWorkoutExercises.every(e => e.sets.every(s => s.reps === null))
  const isValid = currentWorkoutExercises.some(e => e.sets.some(s => s.reps !== null && s.reps > 0))

  async function handleFinish(){
      if(exerciseCards.length > 0 && isValid){
          const cleanedExercises = currentWorkoutExercises
              .map(e => ({
                  ...e, sets: e.sets.filter(s => s.reps !== null && s.reps > 0)
              }))
              .filter(e => e.sets.length > 0)

          // await saveWorkout("workouts", currentWorkoutDate, cleanedExercises)

          // await saveWorkout("pending_sync_to_server", currentWorkoutDate, cleanedExercises)
          // clearWorkoutStore()
          // router.navigate('/')

          // const { error } = await syncToServer(currentWorkoutDate)

          // if(error) {
          //     console.warn("Sync failed", error)
          // } else {
          //     await deleteWorkoutByDate("pending_sync_to_server", currentWorkoutDate)
          // }
    
      }else{
          setShowFinishModal(true)
      }
  }

  function handleDiscard(){
      clearWorkoutStore()
      router.navigate('/')
  }
  return(
    <>
      <Stack.Screen options={{
          headerLeft: () => 
            <Pressable onPress={() => setShowDiscardModal(true)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Entypo name="chevron-left" size={24} color="black" />
            </Pressable>,
          headerRight: () => 
              <Pressable onPress={handleFinish} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                <Text>Finish</Text>
              </Pressable>,
          headerTitle: 'Log Workout',
          headerTitleAlign: 'center',
          headerShadowVisible: false,

      }} />


      {showDiscardModal && 
          <View style={styles.modalWindow}>
              <Text>Are you sure you want to discard this workout?</Text>
              <Pressable onPress={handleDiscard} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                <Text>Discard Workout</Text>
              </Pressable>
              <Pressable onPress={() => setShowDiscardModal(false)} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                <Text>Cancel</Text>
              </Pressable>
          </View>
      }

      {showFinishModal && 
          <View style={styles.modalWindow}>
              {exerciseCards.length === 0 && <Text>Add an exercise</Text>}
              {(exerciseCards.length > 0 && notValid) && <Text>Your workout has no set values</Text>}
              <Pressable onPress={() => setShowFinishModal(false)} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                <Text>Ok</Text>
              </Pressable>
          </View>
      }
      <View style={styles.view}>

        {exerciseCards.length === 0 && 
          <View>
            <Text>Get started</Text>
            <Text>Add an exercise to start your workout</Text>
          </View>
        }
        {exerciseCards.length > 0 && <ScrollView>{exerciseCards}</ScrollView>}
        <Pressable  onPress={() => router.navigate('/exercises-list')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <AntDesign name="plus" size={24} color="black" />
            <Text>Add Exercise</Text>
        </Pressable>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalWindow: {

  },
  button: {

  },
  pressed: {
      opacity: 0.5,
  },
  
})