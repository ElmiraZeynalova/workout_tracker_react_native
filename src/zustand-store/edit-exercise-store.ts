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

type EditStore = {
    editingExercise: Exercise,
    setExerciseForEdit: (exercise: Exercise) => void
    addNewSet: () => void
    deleteSet: (setId: string) => void
    updateSet: (setId: string, fieldName: "reps" | "weight", value: number) => void
    toggleChecked: (setId: string) => void
}

export const useEditExerciseStore = create<EditStore>((set) => ({
    editingExercise: {exerciseId: "", exerciseName: "", sets: []},
    setExerciseForEdit: (exercise: Exercise)  => 
        set(() => ({
            editingExercise: exercise
    })),

    addNewSet: () => 
        set((state) => ({
            editingExercise: {...state.editingExercise, sets: [...state.editingExercise.sets, {setId: Crypto.randomUUID(), reps:5, weight: 0, checked: true}]}

        })),

    deleteSet: (setId) => 
        set((state) => ({
            editingExercise: {...state.editingExercise, sets: state.editingExercise.sets.filter(s => s.setId !== setId)}
        })),

    updateSet: (setId, fieldName, value) => 
        set((state) => ({
            editingExercise: {...state.editingExercise, sets: state.editingExercise.sets.map(set => (
                set.setId === setId ? {...set, [fieldName]: value} : set
            ))}
        })),

    toggleChecked: (setId) => 
        set((state) => ({
            editingExercise: {...state.editingExercise, sets: state.editingExercise.sets.map(set => (
                set.setId === setId ? {...set, checked: !set.checked} : set
            ))}
        }))
}))