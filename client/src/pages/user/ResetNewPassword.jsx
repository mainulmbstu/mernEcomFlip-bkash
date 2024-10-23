import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";

const ResetNewPassword = () => {
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  let navigate = useNavigate();
  let params = useParams();

  console.log(password);
  let inputHandle = (e) => {
    let { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };
   let hints = `Password must be 8-16 characters, at least one uppercase
          letter, one lowercase letter, one number and one special character
          (@$!%*#?&)`;
  //============================================
  let submitted = async (e) => {
    e.preventDefault();
 let regExp =
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,16}$/;
 if (!regExp.test(password?.newPassword)) {
   return alert("Password is not valid");
 }

    try {
      if (password?.newPassword !== password?.confirmPassword)
        return alert("Password does not match");
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/reset-new-password/${params.email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password.newPassword }),
        }
      );

      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        navigate("/login");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log("UserVerified", error);
    }
  };
  //==================================================

  return (
    <Layout title={"Reset password"}>
      <div
        className=" d-flex flex-column justify-content-center border"
        style={{ height: "90vh" }}
      >
        <div className=" col-md-3 mx-auto bg-dark text-white p-3">
          <div className="text-center shadow">
            <h4>Reset Password form</h4>
            <form onSubmit={submitted} action="">
              <input
                onChange={inputHandle}
                className=" form-control mt-2"
                type="password"
                name="newPassword"
                value={password.newPassword}
                placeholder="New password"
                required
              />
              <p className="text-start ps-2">{password.newPassword && hints} </p>
              <input
                onChange={inputHandle}
                className=" form-control mt-2"
                type="password"
                name="confirmPassword"
                value={password.email}
                placeholder="Confirm Password"
                required
              />

              {password.newPassword && (
                <p>
                  {password.newPassword !== password.confirmPassword
                    ? "Password not matched"
                    : "Password Matched"}
                </p>
              )}

              <button
                className=" btn btn-primary text-white fs-5 w-100 mt-2 btn-outline-success"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetNewPassword;
