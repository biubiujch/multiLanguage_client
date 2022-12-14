import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import { store } from "src/store";
import { logout } from "src/store/administrator";

const baseURL = "http://localhost:3000/api";

export const request = axios.create({
  baseURL,
});

let { user } = JSON.parse(sessionStorage.getItem("administrator") || "null") || { user: {} }

store.subscribe(() => {
  if (store.getState().administrator.isLogin) {
    user.token = store.getState().administrator.user?.token
  }
});

request.interceptors.request.use(
  (req) => {
    req.headers = {
      authorization: `Bearer ${user.token}`,
    };
    return Promise.resolve(req);
  },
  (err) => {
    return Promise.reject(err);
  }
);

request.interceptors.response.use(
  function (response) {
    const { status, data } = response;
    if (status === 201 || status === 202) {
      message.error("username or password error");
      return Promise.reject();
    } else if (status === 203) {
      message.error("user not logged in");
      store.dispatch(logout());
      return Promise.reject();
    }
    return data;
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
  detailProject: {
    url: "project/detail",
    method: "get",
  },
  login: {
    url: "administrator/login",
    method: "post",
  },
  regist: {
    url: "administrator/regist",
    method: "post",
  },
  changepsw: {
    url: "administrator/changepsw",
    method: "post",
  },
  createText: {
    url: "translate/create",
    method: "post",
  },
  getAllText: {
    url: "translate/getAll",
    method: "get",
  },
  deleteText: {
    url: "translate/delete",
    method: "post",
  },
  updateText: {
    url: "translate/update",
    method: "post",
  },
  deployment: {
    url: "translate/deployment",
    method: "get"
  }
};
