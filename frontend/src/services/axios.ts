import axios from "axios";

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosPublic = axios.create({
  baseURL: "http://localhost:5000",
});

axiosPublic.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, DELETE, UPDATE, PUT, PATCH";
axiosPublic.defaults.headers.common["Access-Control-Allow-Credentials"] =
  "true";

axiosPrivate.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, DELETE, UPDATE, PUT, PATCH,OPTIONS";
axiosPrivate.defaults.headers.common["Access-Control-Allow-Credentials"] =
  "true";
