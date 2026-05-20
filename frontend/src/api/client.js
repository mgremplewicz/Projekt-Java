import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then((response) => response.data);

export const getExams = () =>
  api.get('/exams').then((response) => response.data);

export const getExam = (id) =>
  api.get(`/exams/${id}`).then((response) => response.data);

export const submitExam = (payload) =>
  api.post('/exams/submit', payload).then((response) => response.data);

export const getResults = (userId) =>
  api.get(`/exams/results/${userId}`).then((response) => response.data);



export const createExam = (payload) =>
  api.post('/exams', payload).then((response) => response.data);

export const getAllResults = (userId) =>
  api.get(`/exams/results/${userId}`).then((response) => response.data);

export const getQuestionBank = () =>
  api.get('/questions').then((response) => response.data);