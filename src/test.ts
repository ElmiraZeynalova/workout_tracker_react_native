const currentWorkoutExercises = [
    {
        id: 1,
        name: 'squats',
        sets: [
            {setId: 1, weight: null, reps: 5, checked: true},
            {setId: 2, weight: 0, reps: 0, checked: true},
            {setId: 3, weight: 22, reps: 7, checked: false}
        ]
    },
    {
        id: 2,
        name: 'pushups',
        sets: [
            {setId: 1, weight: null, reps: 0, checked: true},
            {setId: 2, weight: 0, reps: 6, checked: false},
            {setId: 3, weight: 33, reps: 7, checked: true}
        ]
    },
]

const cleanedExercises = currentWorkoutExercises
    .map(e => ({
        ...e, sets: e.sets
                .flatMap(s => s.weight === null ? {...s, weight: 0} : s)
                .filter(s => s.checked === true)
                .filter(s => s.reps !== null && s.reps > 0)
              }))
              .filter(e => e.sets.length > 0)
cleanedExercises.map(e => console.log(e))