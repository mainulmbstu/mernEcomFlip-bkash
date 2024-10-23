import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showpass, setShowPass] = useState(false);
      let [loading, setLoading] = useState(false);
      let [OTP, setOTP] = useState('');

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    regOTP:""
  });
  let navigate = useNavigate();

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
//===================================
  let getOTP = async (e) => {
    e.preventDefault();
    let regExpn = /[A-Za-z. ]{3,50}$/;
    if (!regExpn.test(user.name)) {
      // return setMsg("Password not valid");
      return alert("Name is not valid");
    }
    let regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,16}$/;
    if (!regExp.test(user.password)) {
      // return setMsg("Password not valid");
      return alert("Password is not valid");
    }

    if (user?.phone?.length<11) {
      return alert("Mobile number must be 11 digits");
    }

    try {
      setLoading(true);
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/getotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      setLoading(false);
      let data = await res.json();
      if (res.ok) {
        setOTP(data.OTP)
        alert(data.msg);
        focusOTP.current.focus()
      } else {
        toast.error(data.msg);
      }

    } catch (error) {
      console.log(error);
    }
  };
//===================================
  let submitted = async (e) => {
    e.preventDefault();
    let regExpn = /[A-Za-z. ]{3,50}$/;
    if (!regExpn.test(user.name)) {
      // return setMsg("Password not valid");
      return alert("Name is not valid");
    }
    let regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,16}$/;
    if (!regExp.test(user.password)) {
      // return setMsg("Password not valid");
      return alert("Password is not valid");
    }

    if (user?.phone?.length<11) {
      return alert("Mobile number must be 11 digits");
    }

    try {
      setLoading(true);
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        setUser({ name: "", email: "", password: "", phone: "", address: "" });
        navigate("/login");
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
    let focusName = useRef();
    let focusOTP = useRef();
    useEffect(() => {
      focusName.current.focus();
    }, []);

  let hints = `Password must be 8-16 characters, at least one uppercase
          letter, one lowercase letter, one number and one special character
          (@$!%*#?&)`;

  return (
    <Layout title={"register"}>
      <div
        className=" d-flex flex-column justify-content-center border"
        style={{ height: "90vh" }}
      >
        <div className=" text-center shadow bg-black text-white py-4 p-2 col-md-3 mx-auto">
          <h4 className=" text-uppercase">Registration form</h4>
          <form onSubmit={OTP ? submitted : getOTP} action="">
            <input
              ref={focusName}
              onChange={inputHandle}
              className=" form-control mt-2"
              type="text"
              name="name"
              value={user.name}
              placeholder="Full Name"
              required
            />
            <p>{user.name && "Minimum 3 characters"} </p>
            <input
              onChange={inputHandle}
              className=" form-control mt-2"
              type="email"
              name="email"
              value={user.email}
              placeholder="email"
              required
            />
            <div className=" position-relative">
              <input
                onChange={inputHandle}
                className=" form-control mt-2 "
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
            <p className="text-start ps-2">{user.password && hints} </p>
            <input
              onChange={inputHandle}
              className=" form-control mt-2"
              type="text"
              name="phone"
              value={user.phone}
              placeholder="Phone number"
              required
            />
            <input
              onChange={inputHandle}
              className=" form-control mt-2"
              type="text"
              name="address"
              value={user.address}
              placeholder="address"
              required
            />
            {OTP && (
              <input
                ref={focusOTP}
                onChange={inputHandle}
                className=" form-control mt-2"
                type="text"
                name="regOTP"
                value={user.regOTP}
                placeholder="OTP"
              />
            )}
            <button
              className=" btn btn-primary text-white fs-5 w-100 mt-2 btn-outline-success"
              type="submit"
              disabled={loading}
            >
              {loading ? "REGISTERING" : "REGISTER"}
            </button>
            {OTP &&
            <button
              onClick={getOTP}
              className=" btn btn-success text-white fs-5 w-100 mt-2 btn-outline-success"
              type="submit"
              disabled={loading}
            >
              {loading ? "RESENDING OTP" : "RESEND OTP"}
            </button>
            }
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
