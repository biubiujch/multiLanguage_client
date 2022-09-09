import { AxiosRequestConfig } from "axios";
import { request } from "src/utils/request";
import { useEffect, useState } from "react";
let index = 0

export function useRequestList(api: AxiosRequestConfig<any>, query?: Record<string, any>) {
  const [params, setParams] = useState<Record<string, any> | null>(query || null);
  const [data, setData] = useState<any[]>([]);

  async function getList() {
    try {
      const res = await request({ ...api, params });
      setData(Array.isArray(res) ? res : (res.data as any[]) || []);
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
