import { useAuth } from "../../context/AuthContext";
import UserMenu from "./UserMenu";

const Dashboard = () => {
  let { userInfo } = useAuth();

  return (
    <div className="row ">
      <div className="col-md-3 p-2">
        <div className="card p-2">
          <UserMenu />
        </div>
      </div>
      <div className=" col-md-9 p-2">
        <div className="w-75 card p-2">
          <h2>User Information</h2>
          <hr />
          <h3>Name: {userInfo.name} </h3>
          <h5>Email: {userInfo.email} </h5>
          <h5>Phone: {userInfo.phone} </h5>
          <h5>Address: {userInfo.address} </h5>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
