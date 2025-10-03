const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:3000/",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export default API_CONFIG;
