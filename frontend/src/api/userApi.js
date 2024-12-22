import axios from "axios";

const API_URL = "http://localhost:3001/api/users";

// Signup API
export const signupUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Signup failed";
  }
};

// Other APIs (e.g., login)
export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};
