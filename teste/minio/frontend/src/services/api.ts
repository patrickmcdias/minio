import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000/api" });

export const setAuthHeaders = (accessKey: string, secretKey: string) => {
  api.defaults.headers.common["x-access-key"] = accessKey;
  api.defaults.headers.common["x-secret-key"] = secretKey;
};

export default api;
