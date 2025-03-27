// frontend/src/api.ts
import axios from "axios";

// substitua pelo IP real onde roda o backend
const api = axios.create({ baseURL: "http://186.227.206.201:4000/api" });

export const setAuthHeaders = (accessKey: string, secretKey: string) => {
  api.defaults.headers.common["x-access-key"] = accessKey;
  api.defaults.headers.common["x-secret-key"] = secretKey;
};

export default api;
