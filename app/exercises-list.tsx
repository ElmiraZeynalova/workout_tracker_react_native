import {useState} from 'react'
import { useWorkoutStore } from '@/src/store/workout-store'
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput} from 'react-native'
import exercises from '@/src/exercises.json'
import { Stack} from "expo-router"
import { useRouter } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { exerciseIcons } from '@/assets/icons'

export default function ExercisesList(){
    const router = useRouter();
    const [chosenExercises, setChosenExercises] = useState<string[]>([])
    const addNewExercises = useWorkoutStore((state) => state.addNewExercises)
    const [search, setSearch] = useState<string>("")

    function handleExerciseChoice(exerciseName: string){
        setChosenExercises((prev) => 
            prev.includes(exerciseName) 
                ? prev.filter(e => e !== exerciseName)
                : [...prev, exerciseName]
        )
    }

    function saveChosenExercises(){
        addNewExercises(chosenExercises)
        router.navigate('/log-workout')
    }  

    const exercisesList = exercises
        .filter(e => e.exerciseName.toLowerCase().includes(search.toLowerCase()))
        .map(e => {
            const exerciseIcon = exercises.find(ex => ex.exerciseName === e.exerciseName)?.iconKey
            const Icon = exerciseIcons[exerciseIcon || '']
            if (!Icon) return null
            return(
            <View key={e.exerciseName} >
                <Pressable style={({ pressed }) => [styles.exercise, pressed && styles.pressed]} onPress={() => handleExerciseChoice(e.exerciseName)}>
                    {chosenExercises.includes(e.exerciseName) && <View style={styles.selectedExercise}></View>}
                    <Icon width={55} height={55}/>
                    <View style={styles.exerciseInfo}>
                        <Text style={{fontSize: 18, fontWeight: 400}}>{e.exerciseName}</Text>
                        <Text style={{fontSize: 14, fontWeight: 400, color: '#8a8a8a'}}>{e.muscleGroup}</Text>
                    </View>
                </Pressable>
            </View>
        )})

    return(
        <>
            <Stack.Screen options={{
                headerLeft: () => 
                    <Pressable onPress={() => router.navigate('/log-workout')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                        <Entypo name="chevron-left" size={24} color="black" />
                    </Pressable>,
                headerTitle: 'All Exercises',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: '#F3F3F3',
                },
                }} 
            />
     
            <View style={styles.searchBar}>
                <FontAwesome6 style={styles.glass} name="magnifying-glass" size={18} color="#a7a7a7" />
                <TextInput
                    placeholder="Search exercise"
                    onChangeText={setSearch}
                    value={search}
                    style={styles.input}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollView}>
                {exercisesList}
            </ScrollView>
            {chosenExercises.length > 0 && 
                <Pressable onPress={saveChosenExercises} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                    <Text style={styles.btnText}>{chosenExercises.length === 1 ? "Add 1 exercise" : `Add ${chosenExercises.length} exercises`}</Text>
                </Pressable>
            }
 
    </>
    )
}

const styles = StyleSheet.create({
    searchBar:{
        position: 'sticky',
        paddingHorizontal: 18,
        zIndex: 1,
        marginBottom: 12
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 50,
        paddingVertical: 12,
        paddingLeft: 46,
        paddingRight: 10

    },
    glass: {
        position: 'absolute',
        zIndex: 2,
        top: 14,
        left: 36
    },
    pressed: {
      opacity: 0.5,
    },
    exercise: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomColor: '#c7c7c76a',
        borderBottomWidth: 0.3
    },
    exerciseInfo:{
        flexDirection: 'column',
        gap: 5
    },
    selectedExercise: {
        backgroundColor:'#bbbbbbb2',
        width: 5,
        height: 50,
        borderRadius: 5,
        margin: 0
    },
    scrollView:{
        backgroundColor: '#F3F3F3',
        paddingHorizontal: 12,
        flexDirection: 'column',
        paddingBottom: 66,
      

    },
    button: {
        position: 'absolute',
        backgroundColor:'#FF5526',
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 20,
        bottom: 20,
        left: 120


    },
    btnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 500,
    },

  
})