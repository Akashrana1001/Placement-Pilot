    import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io('/', { auth: { token } });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const joinJob = (jobId) => {
  if (socket) socket.emit('join:job', jobId);
};

export const leaveJob = (jobId) => {
  if (socket) socket.emit('leave:job', jobId);
};