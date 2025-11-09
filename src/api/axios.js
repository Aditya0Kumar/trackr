import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend server
});

// Attach token (if logged in)
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("userInfo");

  if(user){
    const token = JSON.parse(user).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
});

export default API;