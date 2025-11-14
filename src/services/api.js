import axios from "axios";

const api = axios.create({
  baseURL: "https://car-rental-2rjk.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },

});


api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
 
  }
  return config;
}, (err) => Promise.reject(err));

export default api;
