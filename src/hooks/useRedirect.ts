import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useRedirect = () => {

  const navigate = useNavigate()
  const [path, setPath] = useState<string | undefined>()
  const [to, setTo] = useState<string | undefined>()

  useEffect(() => {
    if (path && to) {
      navigate(to, { replace: true })
    }
  }, [path, to])

  return (path: string | undefined, to: string | undefined) => {
    setPath(path)
    setTo(to)
  }
};