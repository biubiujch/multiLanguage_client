import { AxiosRequestConfig } from "axios";
import { request } from "src/utils/request";
import { useEffect, useState } from "react";
let index = 0

export function useRequestList(api: AxiosRequestConfig<any>, query?: Record<string, any>) {
  const [params, setParams] = useState<Record<string, any> | null>(query || null);
  const [data, setData] = useState<Record<string, any>>({});

  async function getList() {
    try {
      const res = await request({ ...api, params });
      setData(res);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    params && getList();
  }, [params]);

  return {
    setParams,
    reFectch: getList,
    data,
  };
}
