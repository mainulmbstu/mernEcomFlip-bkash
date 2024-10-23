import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Logout = () => {
  let { setToken } = useAuth()
  
  // useEffect(() => {
  //   setToken("");
  //   localStorage.removeItem("token");
  //   toast.success('Logout successfully')
  // }, [setToken]);

  // return <Navigate to="/login" />;
};

export default Logout;
