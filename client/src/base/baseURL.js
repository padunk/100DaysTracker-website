export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PORT + "/api"
    : "http://localhost:5000/api";
