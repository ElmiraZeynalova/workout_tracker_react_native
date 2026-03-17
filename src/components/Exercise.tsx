import SetForm from "./SetForm"
import {Text, Pressable, View, StyleSheet} from 'react-native'
import { useWorkoutStore } from "../store/workout-store"
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Exercise({exerciseId}:{exerciseId: string}){
    const exercise = useWorkoutStore((state) => state.exercises.find(e => e.exerciseId === exerciseId))
    const exerciseSets = exercise?.sets
    const addNewSet = useWorkoutStore((state) => state.addNewSet)
    const updateSet = useWorkoutStore((state) => state.updateSet)

    function handleAddSetBtnClick(){
        addNewSet(exerciseId)
    }
  
    const setForms = exerciseSets?.map((set, idx) => {
        return <SetForm key={idx} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(exerciseId, idx, "reps", v)} updateWeight={(v) => updateSet(exerciseId, idx, "weight", v)}/>
    })

    return(
        <View>
            <Text>{exercise?.exerciseName}</Text>   
            <View>{setForms}</View>  
            <Pressable  onPress={handleAddSetBtnClick} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                <AntDesign name="plus" size={24} color="black" />
                <Text>Add Set</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {

    },
    pressed: {
      opacity: 0.5,
    },
  
})