import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL ,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 3000,
});

api.interceptors.request.use((config) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsed = JSON.parse(userData);
    const token = parsed?.state?.token || parsed?.token; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


api.interceptors.response.use(
  (response) =>{  return response},
  (error) => {
    if (error.response?.status === 401) {
      toast.error(error.response?.data?.message)
    }
    return Promise.reject(error);
  }
);


export default api