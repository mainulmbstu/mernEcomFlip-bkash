import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  let { userInfo, getUserInfo, token, loading, setLoading } = useAuth();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  useEffect(() => {
    setUser({
      id: userInfo?._id,
      name: userInfo?.name,
      email: userInfo?.email,
      phone: userInfo?.phone,
      address: userInfo?.address,
    });
  }, [userInfo]);

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  let passHints = `Password must be minimum 8 and maximum 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*#?&)`;
//===========================================
  let submitted = async (e) => {
    e.preventDefault();
    let regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,16}$/;
    if (user.password && !regExp.test(user.password)) {
      // return setMsg("Password not valid");
      return alert("Password is not valid");
    }
    try {
      setLoading(true)
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      setLoading(false);
      let data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        getUserInfo();
        setUser({ ...user, password: "" });
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="row ">
      <div className="col-md-3 p-2">
        <div className="card p-2">
          <UserMenu />
        </div>
      </div>
      <div className=" col-md-9 p-2">
        <div className="card p-2">
          <div className=" d-flex justify-content-around my-auto ">
            <div className=" col-md-6 shadow">
              <h2 className=" text-center">User Profile</h2>
              <form onSubmit={submitted} action="" className="p-3">
                <label className=" text-start ms-3" htmlFor="">
                  ID:
                </label>
                <input
                  onChange={inputHandle}
                  className=" form-control m-2"
                  type="text"
                  name="id"
                  value={user.id}
                  placeholder="id"
                  disabled
                />
                <label className=" text-start ms-3" htmlFor="">
                  Name:
                </label>
                <input
                  onChange={inputHandle}
                  className=" form-control m-2"
                  type="text"
                  name="name"
                  value={user.name}
                  placeholder="Full Name"
                />
                <label className=" text-start ms-3" htmlFor="">
                  email:
                </label>
                <input
                  onChange={inputHandle}
                  className=" form-control m-2"
                  type="email"
                  name="email"
                  value={user.email}
                  placeholder="email"
                  disabled
                />
                <label className=" text-start ms-3" htmlFor="">
                  Password:
                </label>
                <input
                  onChange={inputHandle}
                  className=" form-control m-2"
                  type="text"
                  name="password"
                  value={user?.password}
                  placeholder="password"
                />
                {<p>{user?.password && passHints} </p>}
                <label className=" text-start ms-3" htmlFor="">
                  Phone:
                </label>
                <input
                  onChange={inputHandle}
                  className=" form-control m-2"
                  type="text"
                  name="phone"
                  value={user.phone}
                  placeholder="Phone number"
                />
                <label className=" text-start ms-3" htmlFor="">
                  Address:
                </label>
                <input
                  onChange={inputHandle}
                  className=" form-control m-2"
                  type="text"
                  name="address"
                  value={user.address}
                  placeholder="address"
                />
                <button
                  className=" btn btn-primary text-white fs-5 w-100 ms-2 btn-outline-success"
                  type="submit"
                  disabled={loading}
                >
                  {loading?'Updating': 'Update'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile