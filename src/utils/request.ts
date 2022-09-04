import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";

const baseURL = "http://localhost:3000/api";

export const request = axios.create({
  baseURL,
});

request.interceptors.response.use(
  function (response) {
    const { status } = response;
    if (status === 201 || status === 202) {
      message.error("username or password error");
      return Promise.reject();
    }
    return response.data;
  },
  function (error) {
    message.error("nextwork error");
    return Promise.reject();
  }
);

export const apis: Record<string, AxiosRequestConfig<any>> = {
  createProject: {
    url: "project/create",
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
  },
  login: {
    url: "administrator/login",
    method: "post",
  },
};
