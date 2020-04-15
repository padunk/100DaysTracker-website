export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PORT
    : "http://localhost:5000";
