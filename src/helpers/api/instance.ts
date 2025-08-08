import axios from "axios";

const HOST = "http://localhost:7777";

const VERSION = "/api";

const API = `${HOST}${VERSION}`;

const instance = axios.create({
  baseURL: API,
});

export default instance;
