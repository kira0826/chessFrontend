import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8081/', //must define correct API URL  
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');  
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default apiClient;
