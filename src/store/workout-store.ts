import { create } from 'zustand'
import dayjs from 'dayjs'

export type SetInfo = {
    reps: number | null
    weight?: number | null
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
    deleteSet: (exerciseId: string, setIdx: number) => void
    updateSet: (exerciseId: string, setIdx: number, fieldName: string, value: number) => void
    clearWorkout: () => void
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    exercises: [],
    addNewExercises: (newExercisesNames) => 
        set(state => ({
            exercises: [...state.exercises, 
                ...newExercisesNames.map(newName => (
                {exerciseId: crypto.randomUUID(), exerciseName: newName, sets: [{reps: null, weight: 0}]}
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
                    ? {...e, sets: [...e.sets, {reps: null, weight: 0}]}
                    : e
            )
        })),

    deleteSet: (exerciseId, setIdx) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: e.sets.splice(setIdx, 1)}
                    : e
            )
        })),

    updateSet: (exerciseId, setIdx, fieldName, value) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {
                        ...e, 
                        sets: e.sets.map((set, idx) => 
                            idx === setIdx ? {...set, [fieldName]: value} : set
                    )
                }
                    : e
            )
        })),
    clearWorkout: () => 
        set({exercises: []})
    
}))