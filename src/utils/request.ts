import axios from "axios";

const baseURL = "";

export const request = axios.create({
  baseURL,
});

axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.error(error);
  }
);
