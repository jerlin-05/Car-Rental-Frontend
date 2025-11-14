import axios from "axios";

const api = axios.create({
  baseURL: "https://car-rental-2rjk.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
