import {Text, StyleSheet, View, Pressable, Modal} from 'react-native'
import {useState} from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import { exerciseIcons } from '@/assets/icons'
import exercises from '@/src/exercises.json'
import { useRouter } from 'expo-router';
import { useRenderWorkoutOnScreenStore } from '../zustand-store/render-workout-store';
import { deleteExerciseById, markWorkoutUnsynced } from '../sqlite/crud';
import { syncServerWithSQLite } from '../supabase/crud';

type SetInfo = {
    setId: string
    reps: number | null
    weight?: number | null
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}

export default function LoggedExerciseCard({date, exercise}: {date: string, exercise: Exercise}){
    const removeExercise = useRenderWorkoutOnScreenStore((state) => state.removeExercise)
    const [showModal, setShowModal] = useState<boolean>(false)
    const router = useRouter();
    const sets = exercise.sets.map((set, idx) => (
        {
            id: idx + 1,
            reps: set.reps,
            weight: set.weight
        }
    ))
    const exerciseIcon = exercises.find(e => e.exerciseName === exercise.exerciseName)?.iconKey
    const Icon = exerciseIcons[exerciseIcon || '']
    if (!Icon) return null

    async function handleDeleteExr(){
        removeExercise(date, exercise.exerciseId)
        await deleteExerciseById(date, exercise.exerciseId)
        try {
            await markWorkoutUnsynced(date)
        } catch(e) {
            console.warn("Failed to mark workout unsynced:", e)
        }
        setShowModal(false)
        await syncServerWithSQLite()
    }

    async function handleEditExr(){
        router.push({
            pathname: '/edit-exercise',
            params: { exerciseId: exercise.exerciseId }
        })
        setShowModal(false)
    }

    return(
        <>
            <Modal
                visible={showModal}
                transparent={true}
                animationType='none'
                onRequestClose={() => setShowModal(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setShowModal(false)}>
                    <View style={styles.modalWindow}>
                        <View style={styles.modalBtns}>
                            <Pressable onPress={handleEditExr} style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed, {borderBottomColor: '#c7c7c76a', borderBottomWidth: 0.2, paddingBottom: 20}]}>
                                <AntDesign name="edit" size={20} color="#8e8e8e" />
                                <Text style={[styles.modalBtnText, ]}>Edit exercise</Text>
                            </Pressable>
                            <Pressable onPress={handleDeleteExr} style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed]}>
                                <Fontisto name="trash" size={20} color="#8e8e8e" />
                                <Text style={styles.modalBtnText}>Delete exercise</Text>
                            </Pressable>
                        </View>
                        <Pressable onPress={() => setShowModal(false)} style={({ pressed }) => [styles.modalCancelBtn, pressed && styles.pressed]}><Text style={styles.modalCancelBtnText}>Cancel</Text></Pressable>
                    </View>
                </Pressable>
            </Modal>
            
            <View testID={`logged-exercise-card-${exercise.exerciseName}`} accessible={true} accessibilityLabel={`logged-exercise-card-${exercise.exerciseName}`} style={styles.view}>
                <View style={styles.top}>
                    <Icon width={40} height={40}/>
                    <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                    <Pressable onPress={() => setShowModal(true)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                        <Entypo name="dots-three-vertical" size={18} color='#FF5526' />
                    </Pressable>
                </View>
                <View style={styles.setRows}>
                    {sets.map(set => (
                        <View key={set.id} style={styles.setRow}>
                            <Text style={[styles.rowInfo, {width: 20}]}>{set.id}</Text>
                            <Text testID="loggedWeight" accessible={true} accessibilityLabel="loggedWeight" style={[styles.rowNumbers, {width: 80, textAlign: 'right'}]}>{set.weight} <Text style={styles.rowInfo}>kgs</Text> </Text>
                            <Text testID="loggedReps" accessible={true} accessibilityLabel="loggedReps" style={[styles.rowNumbers, {width: 80, textAlign: 'right'}]}>{set.reps} <Text style={styles.rowInfo}>reps</Text> </Text>
                        </View>
                    ))}
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    view: {
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
        gap: 12
    },
    exerciseName: {
        fontWeight: 500,
        fontSize: 18,
        flexGrow: 1,
    },
    setRows: {
        flexDirection: 'column',
        width: '75%',
        gap: 10,
        marginLeft: 15,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    rowInfo: {
        color: '#7c7c7c',
        fontWeight: 400,
        fontSize: 16,
    },
    rowNumbers: {
        color: '#444444',
        fontWeight: 500,
        fontSize: 17,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    modalWindow:{
        width: '100%',
    },
    pressed: {
      opacity: 0.5,
    },
    modalBtns: {
        flexDirection: 'column',
        backgroundColor: 'white',
        gap: 18,
        borderRadius: 16,
        paddingVertical: 18,
        marginBottom: 18
    },
    modalBtn: {
        flexDirection: 'row', 
        gap: 18, 
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    modalCancelBtn: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 15,
   
    },
    modalCancelBtnText: {
        color: '#FF5526', 
        fontSize: 16, 
        fontWeight: 500,
        textAlign: 'center',
    },
    modalBtnText: {
        color: 'black', 
        fontSize: 16, 
        fontWeight: 400,
    }
})
