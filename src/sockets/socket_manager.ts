import { socket } from './socket';
import { useRenderWorkoutOnScreenStore } from "@/src/zustand-store/render-workout-store";

const setWorkout = useRenderWorkoutOnScreenStore.getState().setWorkout

socket.on("SET_WORKOUT", (data) => {
  console.log("Workout received: ", data);
  setWorkout(data.date, data.exercises)
});

// socket.on("DELETE_EXERCISE", (id) => { ... })