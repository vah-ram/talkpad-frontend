import { io } from 'socket.io-client';
import { host } from './utils/apiRoute.js';

const socket = io(host);

export default socket;