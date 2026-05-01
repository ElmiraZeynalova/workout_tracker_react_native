import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://192.168.1.134:3000"; 

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, 
  transports: ["websocket"],
});