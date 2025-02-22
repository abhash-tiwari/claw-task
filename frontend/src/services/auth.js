import api from './api';
import { jwtDecode } from "jwt-decode";


export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return jwtDecode(token); // ✅ Use camelCase
  };
  
  export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null; // ✅ Use camelCase
  };

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const logout = () => {
  localStorage.removeItem('token');
};

// export const getCurrentUser = () => {
//   const token = localStorage.getItem('token');
//   return token ? jwt_decode(token) : null;
// };