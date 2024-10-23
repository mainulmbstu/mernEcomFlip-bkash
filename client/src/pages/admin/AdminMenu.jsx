import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="card p-2 myAdminPanel">
      <h3>
        <NavLink
          to="/dashboard/admin"
          className=" text-decoration-none text-white"
          aria-current="true"
        >
          Dashboard
        </NavLink>
      </h3>
      <div className="list-group">
        <NavLink
          to="/dashboard/admin/profile"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-category"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Create Category
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Products
        </NavLink>

        <NavLink
          to="/dashboard/admin/user-list"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Users
        </NavLink>
        <NavLink
          to="/dashboard/admin/order-list"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Orders
        </NavLink>
        <NavLink
          to="/dashboard/admin/contacts"
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          Contacts
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;
