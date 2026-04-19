import { create } from 'zustand'
import * as Crypto from 'expo-crypto'

export type SetInfo = {
    setId: string
    reps: number
    weight: number
    checked: boolean
}

export type Exercise = {
    exerciseId: string
    exerciseName: string 
    sets: SetInfo[]
}

type WorkoutStore = {
    exercises: Exercise[],
    addNewExercises: (newExercisesNames: string[]) => void
    deleteExercise: (exerciseId: string) => void
    addNewSet: (exerciseId: string) => void
    deleteSet: (exerciseId: string, setId: string) => void
    updateSet: (exerciseId: string, setId: string, fieldName: "reps" | "weight", value: number) => void
    toggleChecked: (exerciseId: string, setId: string) => void
    clearWorkout: () => void
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    exercises: [],
    addNewExercises: (newExercisesNames) => 
        set(state => ({
            exercises: [...state.exercises, 
                ...newExercisesNames.map(newName => (
                {exerciseId: Crypto.randomUUID(), exerciseName: newName, sets: [{setId: Crypto.randomUUID(), reps: 5, weight: 0, checked: true}]}
                ))
            ]
        })),
    deleteExercise: (exerciseId) =>
        set(state => ({
            exercises: state.exercises.filter(e => e.exerciseId !== exerciseId)
        })),
    addNewSet: (exerciseId) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: [...e.sets, {setId: Crypto.randomUUID(), reps:5, weight: 0, checked: true}]}
                    : e
            )
        })),

    deleteSet: (exerciseId, setId) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: e.sets.filter(s => s.setId !== setId)}
                    : e
            )
        })),

    updateSet: (exerciseId, setId, fieldName, value) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {
                        ...e, 
                        sets: e.sets.map((set) => 
                            set.setId === setId ? {...set, [fieldName]: value} : set
                    )
                }
                    : e
            )
        })),
    toggleChecked: (exerciseId, setId) => 
        set(state => ({
            exercises: state.exercises.map(e =>
                e.exerciseId === exerciseId
                ? {
                    ...e, sets: e.sets.map((set) =>
                    set.setId === setId ? {...set, checked: !set.checked} : set
                )
            }
                : e
            )
        })),
    clearWorkout: () => 
        set({exercises: []})

}))
