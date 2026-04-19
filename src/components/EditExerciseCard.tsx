import ExerciseSetForm from "./ExerciseSetForm"
import {Text, Pressable, View, StyleSheet} from 'react-native'
import { useEditExerciseStore } from "../zustand-store/edit-exercise-store"
import { exerciseIcons } from '@/assets/icons'
import exercises from '@/src/exercises.json'

export default function EditExerciseCard(){
    const exercise = useEditExerciseStore((state) => state.editingExercise)
    const exerciseSets = exercise?.sets
    const addNewSet = useEditExerciseStore((state) => state.addNewSet)
    const updateSet = useEditExerciseStore((state) => state.updateSet)
    const toggleChecked = useEditExerciseStore((state) => state.toggleChecked)

    function handleAddSetBtnClick(){
        addNewSet()
    }

    const setForms = exerciseSets?.map((set, idx) => {
        return <ExerciseSetForm key={idx} idx={idx} checked={set.checked} onToggle={() => toggleChecked(set.setId)} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(set.setId, "reps", v)} updateWeight={(v) => updateSet(set.setId, "weight", v)}/>
    })

    const exerciseIcon = exercises.find(e => e.exerciseName === exercise?.exerciseName)?.iconKey
    const Icon = exerciseIcons[exerciseIcon || '']
    if (!Icon) return null
    return(
        <View style={styles.exercise}>
            <View style={styles.top}>
                <Icon width={40} height={40}/>
                <Text style={styles.exerciseName}>{exercise?.exerciseName}</Text>
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