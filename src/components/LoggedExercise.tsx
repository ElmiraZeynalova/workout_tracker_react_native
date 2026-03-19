import type {Exercise} from '@/src/store/workout-store'
import {Text, StyleSheet, View, Pressable, ScrollView} from 'react-native'
//  [
//    {
//      exerciseId: exercise.id,
//      exerciseName: exercise.name,
//      sets: []
//    }
//  ]
export default function LoggedExercise({exercise}: {exercise: Exercise}){

    return(
        <View style={styles.view}>
            <Text style={styles.text}>{exercise.exerciseName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
    },
    text: {
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 20

    }
})
