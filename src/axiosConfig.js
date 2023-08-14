import axios from "axios";

const instance = axios.create({
  baseURL: "https://strapi-production-7efd.up.railway.app/api",
});

export default instance;
