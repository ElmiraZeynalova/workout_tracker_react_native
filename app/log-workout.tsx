import {useState} from 'react'
import {View, Pressable, Text, StyleSheet, ScrollView, Modal} from "react-native";
import { Stack} from "expo-router";
import { useDateStore } from "@/src/store/date-store";
import { useWorkoutStore } from '@/src/store/workout-store';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import LogExercise from '@/src/components/LogExercise'
import {saveWorkout} from '@/src/sqlite/crud'
import DumbbellIcon from '@/assets/icons/grey_dumbbell.svg'

export default function LogWorkout() {
  const router = useRouter();
  const currentWorkoutDate = useDateStore(state => state.selectedDate)
  const currentWorkoutExercises = useWorkoutStore((state) => state.exercises)
  const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout)

  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false)
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false)

  const exerciseCards = currentWorkoutExercises.map(exercise => {
      return <LogExercise key={exercise.exerciseId} exerciseId={exercise.exerciseId}/>
  })

  const notValid = currentWorkoutExercises.every(e => e.sets.every(s => s.reps === null))
  const isValid = currentWorkoutExercises.some(e => e.sets.some(s => s.reps !== null && s.reps > 0))

  async function handleFinish(){
      if(exerciseCards.length > 0 && isValid){
          const cleanedExercises = currentWorkoutExercises
              .map(e => ({
                  ...e, sets: e.sets
                          .flatMap(s => s.weight === null ? {...s, weight: 0} : s)
                          .filter(s => s.checked === true)
                          .filter(s => s.reps !== null && s.reps > 0)
              }))
              .filter(e => e.sets.length > 0)

          await saveWorkout(currentWorkoutDate, cleanedExercises, 0)
          console.log("Saved workout to SQLITE")
          clearWorkoutStore()
          router.navigate('/')
    
      }else{
          setShowFinishModal(true)
      }
  }

  function handleDiscard(){
      setShowDiscardModal(false)
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
              <Pressable onPress={handleFinish} style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}>
                <Text style={{color: '#FF5526', fontSize: 12, fontWeight: 500, }}>Finish</Text>
              </Pressable>,
          headerTitle: 'Log Workout',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F3F3F3', 
          },
      }} />

      <Modal
          transparent={true}
          visible={showDiscardModal}
          animationType='none'
          onRequestClose={() => setShowDiscardModal(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowDiscardModal(false)}>
          <View style={styles.modalWindow}>
              <Text style={[styles.modalWindowText, {borderBottomColor: '#c7c7c76a', borderBottomWidth: 0.3}]}>Are you sure you want to discard this workout?</Text>
                <Pressable onPress={handleDiscard} style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed, {borderBottomColor: '#c7c7c76a', borderBottomWidth: 0.3}]}>
                  <Text style={styles.modalBtnText}>Discard Workout</Text>
                </Pressable>
                <Pressable onPress={() => setShowDiscardModal(false)} style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed]}>
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
          transparent={true}
          visible={showFinishModal}
          animationType='none'
          onRequestClose={() => setShowFinishModal(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowFinishModal(false)}>
          <View style={styles.modalWindow}>
              {exerciseCards.length === 0 && <Text style={[styles.modalWindowText, {borderBottomColor: '#c7c7c76a', borderBottomWidth: 0.3}]}>Add an exercise</Text>}
              {(exerciseCards.length > 0 && notValid) && <Text style={[styles.modalWindowText, {borderBottomColor: '#c7c7c76a', borderBottomWidth: 0.3}]}>Your workout has no set values</Text>}
              <Pressable onPress={() => setShowFinishModal(false)} style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed]}>
                <Text style={styles.modalBtnText}>Ok</Text>
              </Pressable>
          </View>
        </Pressable>
      </Modal>

      {exerciseCards.length === 0 && 
        <View style={styles.noWorkoutView}>
          <DumbbellIcon width={70} height={70}/>
          <Text style={{color: 'black', fontSize: 22, fontWeight: 500}}>Get started</Text>
          <Text style={{color: '#00000072', fontSize: 18, fontWeight: 400, marginBottom: 20}}>Add an exercise to start your workout</Text>
          <Pressable  onPress={() => router.navigate('/exercises-list')} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
            <AntDesign name="plus" size={20} color="white" />
            <Text style={styles.btnText}>Add Exercise</Text>
          </Pressable>
        </View>
      }

      {exerciseCards.length > 0 && 
        <ScrollView contentContainerStyle={styles.scrollView}>
          {exerciseCards}
          <Pressable  onPress={() => router.navigate('/exercises-list')} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
            <AntDesign name="plus" size={20} color="white" />
            <Text style={styles.btnText}>Add Exercise</Text>
          </Pressable>
        </ScrollView>
      }
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

  scrollView: {
    backgroundColor: '#F3F3F3',
    flexDirection: 'column',
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 60
  },  

  noWorkoutView: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    flexDirection: 'column',
    marginTop: '50%',
    alignItems: 'center',
    gap: 5,
    padding: 12,
  },

  btn: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FF5526',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginHorizontal: 'auto'
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
  },
  pressed: {
      opacity: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  modalWindow:{
    width: '90%',
    marginHorizontal:'auto',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  modalWindowText:{
    color: 'black', 
    fontSize: 17, 
    fontWeight: 400,
    textAlign: 'center',
    padding: 15,
  },
  modalBtn:{
    paddingVertical: 15,
  },
  modalCancelBtnText: {
    color: 'black', 
    fontSize: 16, 
    fontWeight: 500,
    textAlign: 'center',
  },
  modalBtnText: {
      color: '#FF5526',
      fontSize: 16, 
      fontWeight: 600,
      textAlign: 'center',
  }
})
