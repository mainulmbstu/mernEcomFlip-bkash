import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../Spinner";

export const AdminAuth = () => {
  // const [ok, setOk] = useState(false)
  const { userInfo } = useAuth();

  // useEffect(() => {
  //   const authCheck = async () => {
  //     let res = await fetch("http://localhost:8000/adminAuth", {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (res.ok) {
  //       setOk(true)
  //     } else {
  //       setOk(false)
  //     }
  //   }
  // if (token) authCheck()

  // }, [token])

  return userInfo.role ? <Outlet /> : <Spinner path='' />;
};
