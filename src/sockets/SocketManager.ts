import { socket } from './socket'
import { useRenderWorkoutOnScreenStore } from "@/src/zustand-store/render-workout-store"

type ConnectionStatus = 'Disconnected' | 'Connecting' | 'Connected' | 'Reconnecting'

let status: ConnectionStatus = 'Disconnected'

export const SocketManager = {
  getStatus: () => status,

  connect: (userId: string) => {
      status = 'Connecting'
      socket.io.opts.query = { userId };

      socket.on("connect", () => { status = 'Connected'; })
      socket.on("connect_error", () => { status = 'Reconnecting'; })

      SocketManager.onMessage((data) => {
        const setWorkout = useRenderWorkoutOnScreenStore.getState().setWorkout
        setWorkout(data.date, data.exercises)
      });

      socket.connect();
    },

  disconnect: () => {
    socket.disconnect();
    status = 'Disconnected'
    socket.off("SET_WORKOUT")
    socket.off("connect")
    socket.off("connect_error")
  },

  send: (event: string, data: any) => {
    console.log("socket.connected:", socket.connected, "status:", status)
    if (socket.connected) {
      socket.emit(event, data)
    }
  },

  onMessage: (handler: (data: any) => void) => {
    socket.on("SET_WORKOUT", (data) => {
      if (data && data.date && data.exercises) {
        handler(data)
      } else {
        console.warn("Received invalid data.")
      }
    })
  }
}

