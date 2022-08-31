import { AxiosRequestConfig } from "axios";
import { request } from "src/utils/request";
import { useEffect, useState } from "react";

export function useRequestList(api: AxiosRequestConfig<any>, query?: Record<string, any>) {
  const [params, setParams] = useState<Record<string, any>>(query || {});
  const [data, setData] = useState<Record<string, any>>({});
  async function getList() {
    const res = await request({ ...api, params });
    setData(res);
  }

  useEffect(() => {
    getList();
  }, [params]);

  return {
    setParams,
    reFectch: getList,
    data,
  };
}
