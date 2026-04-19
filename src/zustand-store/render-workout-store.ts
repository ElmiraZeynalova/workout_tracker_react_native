import { create } from 'zustand'

type SetInfo = {
    setId: string
    reps: number 
    weight: number
}

type Exercise = {
    exerciseId: string
    exerciseName: string 
    sets: SetInfo[]
}

type Workout = {
    date: string
    exercises: Exercise[]
}

type RenderWorkoutStore = {
    workouts: Record<string, Workout>
    setWorkout: (date: string, exercises: Exercise[]) => void
    removeWorkout: (date: string) => void
    setAll: (workouts: Workout[]) => void
    removeExercise: (date: string, exerciseId: string) => void
    addExercises: (date: string, exercises: Exercise[]) => void
    updateExercise: (date: string, exercise: Exercise) => void
}

export const useRenderWorkoutOnScreenStore = create<RenderWorkoutStore>((set) => ({
    workouts: {},
    setWorkout: (date, exercises) =>
        set(state => ({
            workouts: {...state.workouts, [date]: {date, exercises}}
        })),
    removeWorkout: (date) =>
        set(state => {
            const copy = { ...state.workouts }
            delete copy[date]
            return { workouts: copy }
        }),
    setAll: (workouts) =>
        set(() => ({
            workouts: Object.fromEntries(
                workouts.map(w => [w.date, w])
            )
        })),
    removeExercise: (date, exerciseId) =>
        set(state => {
            const copy = { ...state.workouts }

            copy[date] = {
                ...copy[date],
                exercises: copy[date].exercises.filter(
                    e => e.exerciseId !== exerciseId
                )
            }

            return { workouts: copy }
        }),

    addExercises: (date, exercises) =>
        set(state => {
            const workout = state.workouts[date]

            return {
                workouts: {
                    ...state.workouts,
                    [date]: workout
                        ? {
                            ...workout,
                            exercises: [
                                ...workout.exercises,
                                ...exercises
                            ]
                        }
                        : {
                            date,
                            exercises
                        }
                }
            }
        }),

    updateExercise: (date, exercise) =>
        set(state => {
            const workout = state.workouts[date]
            if (!workout) return state

            return {
                workouts: {
                    ...state.workouts,
                    [date]: {
                        ...workout,
                        exercises: workout.exercises.map(e =>
                            e.exerciseId === exercise.exerciseId
                                ? exercise
                                : e
                        )
                    }
                }
            }
        })

}))
