import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState("");
  const [loading, setLoading] = useState(false);
  let storeToken = (token) => {
    setToken(token);
    return localStorage.setItem("token", token);
  };
  //   let isLoggedIn = !!token; // isLoggedIn true/false if token true/false
  const getUserInfo = () => {
    if (token) {
      fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.userData === "token expired") {
            localStorage.removeItem("token");
            setToken("");
            setUserInfo("");
          }
          setUserInfo(data.userData);
        })
        .catch((error) => console.log(error));
    }
  };
  useEffect(() => {
    if (token) getUserInfo();
  }, [token]);
  //============== all category====================================
  const [category, setCategory] = useState([]);

  let getCategory = async () => {

    try {
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/category/category-list`,
        {
          method: "GET",
        }
      );
      let data = await res.json();
      setCategory(data);
    } catch (error) {
      console.log({msg:'cat', error});
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  //======================================================================
  // //=================================================
    const [catPlain, setcatPlain] = useState([]);

  let getPlainCatList = (category, list = []) => {
    for (let v of category) {
      list.push(v);
      if (v.children.length > 0) {
        getPlainCatList(v.children, list);
      }
    }
    // return list;
    setcatPlain(list);
  };

  useEffect(() => {
   category.length && getPlainCatList(category);
  }, [category]);
//==============================================
    const Axios = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
  
  


  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        storeToken,
        userInfo,
        getUserInfo,
        category,
        getCategory,
        loading,
        setLoading,
        catPlain,
        setcatPlain,
        Axios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
 

export { useAuth, AuthContextProvider };
