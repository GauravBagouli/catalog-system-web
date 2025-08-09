import axios from "axios";

const HOST = import.meta.env.VITE_API_URL;

const VERSION = "/api";

const API = `${HOST}${VERSION}`;

const instance = axios.create({
  baseURL: API,
});

export default instance;
