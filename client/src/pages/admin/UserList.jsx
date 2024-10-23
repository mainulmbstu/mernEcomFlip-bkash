import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "./AdminMenu";
import Layout from "../../components/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import DeleteModal from "../../components/DeleteModal";
import axios from "axios";

const UserList = () => {
  let [adminUsers, setAdminUsers] = useState([]);
  let [okdel, setOkdel] = useState(true);
  let { token, userInfo, Axios } = useAuth();
    let [loading, setLoading] = useState(false);
    let [page, setPage] = useState(1);
    let [total, setTotal] = useState(0);
  //====================================================
  let roleHandle = async (value, id) => {
    if (id === userInfo._id) {
      return alert("You cannot update yourself");
    }
    let res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/admin/user/status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: value }),
      }
    );
    let data = await res.json();
    setOkdel((prev) => !prev);
    await alert(data.msg);
  };
  //============================================================


  let getAdminUsers = async (page=1) => {
    page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let { data } = await Axios.get(`/admin/user-list`,
        {
          params: {
            page: page,
            size: 10,
          },
        }
      );
      setTotal(data.total);
      page === 1
        ? setAdminUsers(data.userList)
        : setAdminUsers([...adminUsers, ...data.userList]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (token && userInfo.role) getAdminUsers();
  }, [token, okdel, userInfo.role]);

  //=============================================
  let [searchVal, setSearchVal] = useState("");
  // let [page, setPage] = useState(1);

  let getSearchAdminUser = async (e, page = 1) => {
    e.preventDefault();
    try {
      if (!searchVal) return;
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/user-search`,
        {
          params: {
            keyword: searchVal,
            page: page,
            size: 8,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);

      setTotal(data.total);
      page === 1
        ? setAdminUsers(data?.searchUser)
        : setAdminUsers([...adminUsers, ...data.searchUser]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchVal]);

  //================================================
  let [delItem, setDelItem] = useState("");
  let deleteItem = async (id) => {
    if (id === userInfo._id) {
      return alert("You cannot delete yourself");
    }
    let res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    let data = await res.json();
    setOkdel((prev) => !prev);
    getAdminUsers()
    await alert(data.msg);
  };

  return (
    <Layout title={"User list"}>
      <div className={loading ? "dim" : ""}>
        <div className="row ">
          <div className="col-md-3 p-2">
              <AdminMenu />
            <h3>
              Total users ({adminUsers?.length} of {total})
            </h3>
          </div>
          <div className=" col-md-9 p-2">
            <div className="card p-2">
              <div className=" d-flex my-2">
                <div className="col-md-4">
                  <form
                    className="d-flex"
                    role="search"
                    onSubmit={getSearchAdminUser}
                  >
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="search user by email or phone"
                      aria-label="Search"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-outline-black"
                      type="submit"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
              {/* {loading && <Loading />} */}
              <InfiniteScroll
                dataLength={adminUsers?.length}
                next={
                  !searchVal
                    ? () => {
                        setPage(page + 1);
                        getAdminUsers(page + 1);
                      }
                    : () => {
                        setPage(page + 1);
                        getSearchAdminUser(page + 1);
                      }
                }
                hasMore={adminUsers?.length < total}
                loader={<h1>Loading...</h1>}
                endMessage={<h4 className=" text-center">All items loaded</h4>}
              >
                <div className=" border">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">SL</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Status</th>
                        <th scope="col">Address</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers?.length &&
                        adminUsers.map((item, index) => {
                          return (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.phone}</td>
                              <td>
                                <select
                                  onChange={(e) =>
                                    roleHandle(e.target.value, item._id)
                                  }
                                  name=""
                                  className=" border-0"
                                >
                                  <option value={""}>
                                    {item.role ? "Admin" : "User"}{" "}
                                  </option>
                                  <option value={0}>User</option>
                                  <option value={1}>Admin</option>
                                </select>
                              </td>
                              <td>{item.address}</td>
                              <td>
                                <button
                                  onClick={() => {
                                    setPage(1);
                                    setDelItem(item);
                                  }}
                                  className="btn btn-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteCategory"
                                  disabled={loading}
                                >
                                  {loading && item._id === delItem._id ? (
                                    <>
                                      <div
                                        className="spinner-border text-primary"
                                        role="status"
                                        disabled
                                      >
                                        <span className="visually-hidden">
                                          Loading...
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>Delete</>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </InfiniteScroll>
            </div>
            <DeleteModal value={{ func: deleteItem, item: delItem }} />
          </div>
        </div>
        <div className="d-flex">
          {adminUsers?.length < total ? (
            <>
              <button
                onClick={() => {
                  if (!searchVal) {
                    setPage(page + 1);
                    getAdminUsers(page + 1);
                  } else {
                    setPage(page + 1);
                    getSearchAdminUser(page + 1);
                  }
                }}
                className="btn btn-primary my-3 px-3 mx-auto"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserList;
