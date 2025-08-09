import axios from "axios";

const HOST = "https://catalog-system-api.onrender.com";

const VERSION = "/api";

const API = `${HOST}${VERSION}`;

const instance = axios.create({
  baseURL: API,
});

export default instance;
