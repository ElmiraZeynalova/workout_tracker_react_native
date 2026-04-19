import ExerciseSetForm from "./ExerciseSetForm"
import {Text, Pressable, View, StyleSheet} from 'react-native'
import { useWorkoutStore } from "../zustand-store/workout-store"
import { exerciseIcons } from '@/assets/icons'
import exercises from '@/src/exercises.json'
import Entypo from '@expo/vector-icons/Entypo'

export default function LogExerciseCard({exerciseId}:{exerciseId: string}){
    const exercise = useWorkoutStore((state) => state.exercises.find(e => e.exerciseId === exerciseId))
    const exerciseSets = exercise?.sets
    const addNewSet = useWorkoutStore((state) => state.addNewSet)
    const updateSet = useWorkoutStore((state) => state.updateSet)
    const toggleChecked = useWorkoutStore(state => state.toggleChecked)
    const deleteExercise = useWorkoutStore(state => state.deleteExercise)

    function handleAddSetBtnClick(){
        addNewSet(exerciseId)
    }

    const setForms = exerciseSets?.map((set, idx) => {
        return <ExerciseSetForm key={idx} idx={idx} checked={set.checked} onToggle={() => toggleChecked(exerciseId, set.setId)} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(exerciseId, set.setId, "reps", v)} updateWeight={(v) => updateSet(exerciseId, set.setId, "weight", v)}/>
    })

    const exerciseIcon = exercises.find(e => e.exerciseName === exercise?.exerciseName)?.iconKey
    const Icon = exerciseIcons[exerciseIcon || '']
    if (!Icon) return null
    return(
        <View style={styles.exercise}>
            <View style={styles.top}>
                <Icon width={40} height={40}/>
                <Text style={styles.exerciseName}>{exercise?.exerciseName}</Text>
                <Pressable testID="cross-btn" accessible={true} accessibilityLabel="cross-btn" style={({ pressed }) => [pressed && styles.pressed]} onPress={() => deleteExercise(exerciseId)}>
                    <Entypo name="cross" size={24} color="#858585" />
                </Pressable>
            </View>
               
            <View style={styles.forms}>{setForms}</View>  
            <Pressable testID="addSet-btn" accessible={true} accessibilityLabel="addSet-btn" onPress={handleAddSetBtnClick} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                <Text style={{color: '#FF5526', fontSize: 12, fontWeight: 500}}>Add Set</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    exercise: {
        flex: 1,
        flexDirection: 'column',
        gap: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 5,
        shadowColor: "#00000053",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.03,
        shadowRadius: 14,
        elevation: 4,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 5
    },
    exerciseName: {
        fontWeight: 600,
        fontSize: 18,
        flexGrow: 1,
    },
    forms: {
        flexDirection: 'column',
        gap: 4
    },
    button: {
        borderWidth: 1.5,
        borderColor: '#FF5526',
        borderRadius: 18,
        paddingVertical: 6,
        paddingHorizontal: 18,
        width: '25%'
    },
    pressed: {
      opacity: 0.5,
    },
  
})