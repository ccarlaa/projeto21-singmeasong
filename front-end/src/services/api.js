import axios from "axios";

const url = "http://localhost:5500"

const instance = axios.create({
  baseURL: url
});

export default instance;
