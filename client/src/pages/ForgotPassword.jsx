import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const UserVerified = () => {
  const [user, setUser] = useState({ email: "" });
  const [OTP, setOTP] = useState({ OTP: "" });
  const [gotOTP, setgotOTP] = useState(false);
  let navigate = useNavigate();
  let { loading, setLoading } = useAuth();

  let submitted = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/userVerified`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      setLoading(false);
      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        setgotOTP(true);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log("UserVerified", error);
    }
  };
  //==================================================
  let submitOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/OTPVerified/${user.email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, OTP: OTP.OTP }),
        }
      );
      setLoading(false);
      let data = await res.json();
      if (res.ok) {
        navigate(`/resetnewpassword/${user.email}`);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log("OTPVerified", error);
    }
  };

  return (
    <Layout title={"Reset password"}>
      <div
        className=" d-flex flex-column justify-content-center border"
        style={{ height: "90vh" }}
      >
        <div className=" col-md-4 mx-auto bg-dark text-white p-3">
          <div className="text-center shadow">
            <h4>Reset Password form</h4>
            <form onSubmit={submitted} action="">
              <input
                onChange={(e) => setUser({ email: e.target.value })}
                className=" form-control mt-2"
                type="email"
                name="email"
                value={user.email}
                placeholder="email"
                required
              />

              <button
                className=" btn btn-primary text-white fs-5 w-100 mt-2 btn-outline-success"
                type="submit"
                disabled={loading}
              >
                {loading ? "submitting" : "Send OTP"}
              </button>
            </form>
          </div>
          {gotOTP && (
            <div className="text-center shadow mt-3">
              <h4>Input OTP</h4>
              <form onSubmit={submitOTP} action="">
                <input
                  onChange={(e) => setOTP({ OTP: e.target.value })}
                  className=" form-control mt-2"
                  type="text"
                  name="OTP"
                  value={user.OTP}
                  placeholder="OTP"
                  required
                />

                <button
                  className=" btn btn-primary text-white fs-5 w-100 mt-2 btn-outline-success"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting" : "Submit"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserVerified;
