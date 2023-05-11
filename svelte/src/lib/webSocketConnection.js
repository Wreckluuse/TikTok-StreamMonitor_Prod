import ioClient from 'socket.io-client';
const PORT = process.env.PORT || 3000;
const ENDPOINT = "http://localhost:" + PORT;
const socket = ioClient(ENDPOINT)

export const io = socket;