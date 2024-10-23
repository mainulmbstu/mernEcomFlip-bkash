import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import { toast } from "react-toastify";
import SearchInput from "./SearchInput";
import { useSearch } from "../context/SearchContext";
import { useState } from "react";

const Header = () => {
  let { token, setToken, userInfo, setUserInfo, category } = useAuth();
  let { cart } = useSearch();
  let catCopy = category.length && [...category];
  let sortedCategory =category.length &&  catCopy?.sort((a, b) => {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();
    return a > b ? 1 : -1;
  });
  const [show, setshow] = useState(false)

  let logoutHandle = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserInfo("");
    // Navigate('/login')
    toast.success("Logout successfully");
  };

  return (
    <div className="" id="myHeader">
      <nav className="navbar navbar-expand-lg navbar-light shadow p-2">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Logo
          </Link>
          <div className=" ms-md-5 w-50">
            <SearchInput />
          </div>

          <button
            onClick={() => setshow(true)}
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className={`collapse navbar-collapse ${show?'show':''}`}
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  onClick={() => setshow(false)}
                  className="nav-link "
                  aria-current="page"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  onClick={() => setshow(false)}
                  className="nav-link "
                  aria-current="page"
                  to="/gallery"
                >
                  Gallery
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  onClick={() => setshow(false)}
                  className="nav-link "
                  aria-current="page"
                  to="/contacts"
                >
                  Contact us
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle "
                  to="/N/A"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Category
                </NavLink>
                <ul
                  className="dropdown-menu text-capitalize"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {sortedCategory?.length &&
                    sortedCategory?.map((item) => (
                      <li key={item?._id}>
                        <NavLink
                          onClick={() => setshow(false)}
                          to={`products/category/${item?.slug}`}
                          className="dropdown-item"
                        >
                          {item?.name}
                        </NavLink>
                      </li>
                    ))}
                </ul>
              </li>
              {/* <li className="nav-item">
                <NavLink className="nav-link position-relative" to="/cart">
                  Cart
                  <span className="position-absolute top-5 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart?.length}
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </NavLink>
              </li> */}

              {token ? (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle "
                      to="/N/A"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {userInfo?.name}
                    </NavLink>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      <li>
                        <NavLink
                          onClick={() => setshow(false)}
                          to={`dashboard/${userInfo?.role ? "admin" : "user"}`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={logoutHandle}
                          className="dropdown-item"
                          to="/login"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      onClick={() => setshow(false)}
                      className="nav-link"
                      to="/login"
                    >
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      onClick={() => setshow(false)}
                      className="nav-link"
                      to="/register"
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <NavLink
              onClick={() => setshow(false)}
              className="nav-link position-relative"
              to="/cart"
            >
              Cart
              <span className="position-absolute top-0 start-100 translate-middle badge  rounded-pill bg-danger">
                {cart?.length}
                <span className="visually-hidden">cart</span>
              </span>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
