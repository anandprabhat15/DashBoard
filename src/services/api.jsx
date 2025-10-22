import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export const getTasks = () => api.get("/list/tasks");

export const getUserInfo = () => api.get("/user/info");

export const getNotifications = () => api.get("/notifications");
