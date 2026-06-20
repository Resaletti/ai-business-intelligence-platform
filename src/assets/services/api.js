import axios from "axios";

export const api = axios.create({
  baseURL:
    "https://ai-business-intelligence-platform-api.onrender.com",
});