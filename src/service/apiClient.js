import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8080/', //must define correct API URL  
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');  
  if (token) {
    config.headers.Authorization = `Token ${token}`; 
  }
  return config;
});

export default apiClient;
