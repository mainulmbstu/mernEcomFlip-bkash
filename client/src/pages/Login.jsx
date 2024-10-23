import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../components/Layout";

const Login = () => {
  let { storeToken } = useAuth();
  const [user, setUser] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  let location = useLocation();
  const [showpass, setShowPass] = useState(false);
    let [loading, setLoading] = useState(false);

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  let submitted = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        storeToken(data.token);
        setUser({ email: "", password: "" });
        navigate(location.state || "/"); //state from Spinner.jsx
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
    } catch (error) {
      console.log("login", error);
    }
  };
  let getFocus = useRef()
  useEffect(() => {
   getFocus.current.focus()
  }, [])
  

  return (
    <Layout title={"Login"}>
      <div
        className=" d-flex flex-column justify-content-center border"
        style={{ height: "90vh" }}
      >
        <div className=" text-center shadow  bg-dark text-white py-4 p-2 col-md-3 mx-auto">
          <h2>LOGIN FORM</h2>
          <form onSubmit={submitted} action="">
            <input
              ref={getFocus}
              onChange={inputHandle}
              className=" form-control mt-2 border-0 border-bottom border-black rounded-0"
              type="email"
              name="email"
              value={user.email}
              placeholder="email"
              required
            />
            <div className=" position-relative">
              <input
                onChange={inputHandle}
                className="form-control mt-2 border-0 border-bottom border-black rounded-0"
                type={showpass ? "text" : "password"}
                name="password"
                value={user.password}
                placeholder="password"
                required
              />
              <div className=" position-absolute passIcon">
                <Link onClick={() => setShowPass((prev) => !prev)}>
                  {showpass ? (
                    <FaEyeSlash className=" fs-2" />
                  ) : (
                    <FaEye className=" fs-2" />
                  )}
                </Link>
              </div>
            </div>

            <button
              className=" btn btn-primary text-white fs-5 w-100 mt-2 btn-outline-success"
              type="submit"
              disabled={loading}
            >
              {loading?'SIGNING IN':'SIGN IN'}
            </button>
          </form>
          <button
            onClick={() => navigate("/forgotpassword")}
            className=" btn btn-danger text-white fs-5 w-100 mt-2 mt-5 btn-outline-success"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
