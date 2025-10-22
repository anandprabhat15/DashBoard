import axios from 'axios';

const API_KEY = "PMAK-68b700faca7fac00013f00e2-a6e366d49575ac6a39683c9598aaaeb7dc";
const BASE_URL = "https://d473b897-ef30-4a6b-bbde-58e8ef1a8bd2.mock.pstmn.io";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export const getTasks = () => api.get("/list/tasks");

export const getUserInfo = () => api.get("/user/info");

export const getNotifications = () => api.get("/notifications");
