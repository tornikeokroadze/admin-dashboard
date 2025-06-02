import axios from "axios";
import { store } from "../redux/store";
import { showMessage } from "../redux/slices/messageSlice";
import { logout } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5500/api",
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reason = error.response?.data?.reason;
    const message = error.response?.data?.message;

    if (status === 401) {
      store.dispatch(logout());
      store.dispatch(
        showMessage({ content: "Session expired", type: "error" })
      );
      error.handled = true;
    } else if (status === 403 && reason === "blocked") {
      store.dispatch(logout());
      store.dispatch(
        showMessage({ content: "Account is blocked", type: "error" })
      );
      error.handled = true;
    } else if (status === 403) {
      store.dispatch(
        showMessage({ content: message || "Access denied", type: "error" })
      );
      error.handled = true;
    } else if (!error.response) {
      store.dispatch(logout());
      store.dispatch(
        showMessage({ content: "Cannot connect to server", type: "error" })
      );
      error.handled = true;
    }

    return Promise.reject(error);
  }
);

export default api;
