import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/token/", { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/users/", userData);
    return response.data;
  },
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}/`);
    return response.data;
  },
};
