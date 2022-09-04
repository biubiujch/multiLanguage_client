import axios from "axios";
import md5 from "md5";

const instance = axios.create({});

export const translateAPI = async (params: { q: string; from: string; to: string }) => {
  try {
    const salt = Math.random().toString().slice(2, 9);
    const res = await instance({
      url: "/trans/vip/translate",
      method: "get",
      params: {
        ...params,
        appid: "20201009000583959",
        salt,
        sign: md5("20201009000583959" + params.q + salt + "aYWh1nAxMjTsBe8ogfSg"),
      },
    });
    const { data } = res;
    return data;
  } catch (e) {
    return null;
  }
};
