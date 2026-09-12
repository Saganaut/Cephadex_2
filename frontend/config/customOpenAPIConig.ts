const backendUrl = import.meta.env.VITE_BACKEND_URL; // Your backend URL

export const customApiConfig = {
  BASE: backendUrl,
  WITH_CREDENTIALS: true,
  // other custom configurations
};
