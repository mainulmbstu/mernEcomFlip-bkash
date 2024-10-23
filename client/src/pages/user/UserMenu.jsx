import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div>
      <h3>User Dashboard</h3>
      <div className="list-group">
        <NavLink
          to="/dashboard/user/profile"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Profile
        </NavLink>

        <NavLink
          to="/dashboard/user/orders"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Orders
        </NavLink>

      </div>
    </div>
  );
};

export default UserMenu;
