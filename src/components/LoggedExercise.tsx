import type {Exercise} from '@/src/store/workout-store'
import {Text, StyleSheet, View, Pressable, Modal} from 'react-native'
import {useState} from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import { exerciseIcons } from '@/assets/icons'
import exercises from '@/src/exercises.json'

export default function LoggedExercise({exercise}: {exercise: Exercise}){
    const [showModal, setShowModal] = useState<boolean>(false)
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
                            <Pressable style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed, {borderBottomColor: '#c7c7c76a', borderBottomWidth: 0.2, paddingBottom: 20}]}>
                                <AntDesign name="edit" size={20} color="#8e8e8e" />
                                <Text style={[styles.modalBtnText, ]}>Edit exercise</Text>
                            </Pressable>
                            <Pressable style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed]}>
                                <Fontisto name="trash" size={20} color="#8e8e8e" />
                                <Text style={styles.modalBtnText}>Delete exercise</Text>
                            </Pressable>
                        </View>
                        <Pressable onPress={() => setShowModal(false)} style={({ pressed }) => [styles.modalCancelBtn, pressed && styles.pressed]}><Text style={styles.modalCancelBtnText}>Cancel</Text></Pressable>
                    </View>
                </Pressable>
            </Modal>
            
            <View style={styles.view}>
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
                            <Text style={styles.rowInfo}>{set.id}</Text>
                            <Text style={styles.rowNumbers}>{set.weight} <Text style={styles.rowInfo}>kg</Text> </Text>
                            <Text style={styles.rowNumbers}>{set.reps} <Text style={styles.rowInfo}>reps</Text> </Text>
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
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    exerciseName: {
        fontWeight: 600,
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
        color: '#6d6d6d',
        fontWeight: 500,
        fontSize: 16,
    },
    rowNumbers: {
        color: 'black',
        fontWeight: 600,
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
        gap: 20,
        borderRadius: 10,
        paddingVertical: 20,
        marginBottom: 15
    },
    modalBtn: {
        flexDirection: 'row', 
        gap: 20, 
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalCancelBtn: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 16,
   
    },
    modalCancelBtnText: {
        color: '#FF5526', 
        fontSize: 18, 
        fontWeight: 600,
        textAlign: 'center',
    },
    modalBtnText: {
        color: 'black', 
        fontSize: 18, 
        fontWeight: 400,
    }
})
