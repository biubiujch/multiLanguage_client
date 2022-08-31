import axios, { AxiosRequestConfig } from "axios";

const baseURL = "http://localhost:3000/api";

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

export const apis: Record<string, AxiosRequestConfig<any>> = {
  createProject: {
    url: "/project/create",
    method: "post",
  },
  getAllProject: {
    url: "project/getAll",
    method: "get",
  },
  deleteProject: {
    url: "project/delete",
    method: "post",
  },
  updateProject: {
    url: "project/update",
    method: "post",
  }
};
