import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "./AdminMenu";
import moment from "moment";
import { Select } from "antd";
import Layout from "../../components/Layout";
import axios from "axios";
let { Option } = Select;
import InfiniteScroll from "react-infinite-scroll-component";
import PriceFormat from "../../Helper/PriceFormat";
import RefundModal from "../../components/RefundModal";
import { toast } from "react-toastify";

const AdminOrders = () => {
  let [adminOrders, setAdminOrders] = useState([]);
  let [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "shipped",
    "delivered",
    "cancel",
  ]);
  let [loading, setLoading] = useState(false);
  let { token, userInfo, Axios } = useAuth();

  //============================================================
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let size = 1;

  let getAdminOrders = async (page = 1, size = 10) => {
    page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/order-list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ page, size }),
        }
      );
      let data = await res.json();
      setTotal(data.total);
      page === 1
      ? setAdminOrders(data.orderList)
        : setAdminOrders([...adminOrders, ...data.orderList]);
      setLoading(false);
    } catch (error) {
      console.log("order", error);
    }
  };
  
  console.log(page);
  useEffect(() => {
    if (token && userInfo.role) getAdminOrders(page, size);
  }, [token && userInfo.role]);


  let statusHandle = async (oid, val) => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/order/status/${oid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: val }),
        }
      );
      let data = await res.json();
      await alert(data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  let totalPrice =
    adminOrders?.length &&
    adminOrders?.reduce((previous, current) => {
      return previous + current.total;
    }, 0);
  //=============================================
  let [searchVal, setSearchVal] = useState("");
  // let [page, setPage] = useState(1);

  let getSearchAdminOrders = async ( page = 1, size=10, e) => {
    e && e.preventDefault();
    try {
      if (!searchVal) return;
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/order-search`,
        {
          params: {
            keyword: searchVal,
            page,
            size,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);

      setTotal(data.total);
      page === 1
        ? setAdminOrders(data?.searchOrders)
        : setAdminOrders([...adminOrders, ...data.searchOrders]);
    } catch (error) {
      console.log(error);
    }
  };
  //===================================================
  let [refundItem, setRefundItem] = useState();

  let refundBkash = async (item) => {
    try {
      setLoading(true);
      let { data } = await Axios.post(`/products/order/refund-bkash`, {
        amount: item?.total,
        paymentID: item.payment?.payment_id,
        trxID: item.payment?.trxn_id,
      });
      setLoading(false);
      if (data?.statusCode === "0000") {
        toast.success(`BDT ${item?.total} refund successful`);
        searchVal
          ? getSearchAdminOrders(1, page * size)
          : getAdminOrders(1, page * size);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  //===================================================
  let searchBkash = async (item) => {
    try {
      setLoading(true);
      let { data } = await Axios.get(`/products/order/search-bkash`, {
        params: { trxID: item?.payment?.trxn_id },
      });
      setLoading(false);
      if (data?.statusCode === "0000") {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  //===================================================
  let queryBkash = async (item) => {
    try {
      setLoading(true);
      let { data } = await Axios.get(`/products/order/query-bkash`, {
        params: { paymentID: item?.payment?.payment_id },
      });
      setLoading(false);
      if (data?.statusCode === "0000") {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (searchVal) getSearchAdminOrders();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchVal]);

  // work when input tag is not in form tag

  useEffect(() => {
    setPage(1);
  }, [searchVal]);

  //===============================================================
  return (
    <Layout title={"Admin orders"}>
      <div className={loading ? "dim" : ""}>
        <div className="row ">
          {/* <h1>{[...Array(adminOrders.length/2)].map((_, i) => {
            return <span>{i+1} </span>
          })}</h1> */}
          <div className="col-md-3 p-2">
            <div className="card p-2 myAdminPanel">
              <AdminMenu />
              <div className=" card p-2 mt-5">
                <h4>
                  Total Orders: ({adminOrders?.length} of {total})
                </h4>
                <h4>Total Sale: {<PriceFormat price={totalPrice} />}</h4>
              </div>
            </div>
          </div>
          <div className=" col-md-9 px-2">
            <div className=" d-flex mt-2">
              <div className="col-md-4">
                <form onSubmit={getSearchAdminOrders}>
                  <input
                    className=" form-control"
                    type="text"
                    value={searchVal}
                    required
                    placeholder="search by email, phone or status"
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                </form>
              </div>
              <button
                onClick={(e) => getSearchAdminOrders(e, 1)}
                className="btn btn-success ms-2"
              >
                Search Order
              </button>
            </div>
            <div className="row ">
              <InfiniteScroll
                dataLength={adminOrders?.length}
                next={
                  searchVal
                    ? (e) => {
                        setPage(page + 1);
                        getSearchAdminOrders(page + 1, size, e);
                      }
                    : () => {
                        setPage(page + 1);
                        getAdminOrders(page + 1, size);
                      }
                }
                hasMore={adminOrders?.length < total}
                loader={<h1>Loading...</h1>}
                endMessage={<h4 className=" text-center">All items loaded</h4>}
              >
                {adminOrders?.length &&
                  adminOrders?.map((item, i) => {
                    return (
                      <div key={item._id} className=" mt-2 p-1 shadow">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Status</th>
                              <th scope="col">User-email</th>
                              <th scope="col">User-Address</th>
                              <th scope="col">Payment</th>
                              <th scope="col">Item</th>
                              <th scope="col">Total Price</th>
                              <th scope="col">Time</th>
                              <th scope="col">Refund</th>
                              <th scope="col">Search</th>
                              <th scope="col">Query</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{i + 1} </td>
                              <td>
                                <Select
                                  variant={false}
                                  defaultValue={item?.status}
                                  onChange={(val) =>
                                    statusHandle(item._id, val)
                                  }
                                >
                                  {status.map((st, i) => (
                                    <Option key={i} value={st}>
                                      {st}
                                    </Option>
                                  ))}
                                </Select>
                              </td>

                              <td>{item?.user?.email} </td>
                              <td>{item?.user?.address} </td>
                              <td>
                                {item?.payment?.refund === "refunded"
                                  ? "Refunded"
                                  : item?.payment?.status === true
                                  ? "Success"
                                  : "Failed"}
                              </td>
                              <td>{item?.products?.length} </td>
                              <td>{<PriceFormat price={item.total} />} </td>
                              <td>{moment(item?.createdAt).fromNow()} </td>
                              <td>
                                <button
                                  onClick={() => setRefundItem(item)}
                                  type="button"
                                  className={
                                    item?.payment?.payment_id
                                      ? "btn btn-primary"
                                      : "d-none"
                                  }
                                  data-bs-toggle="modal"
                                  data-bs-target="#refund"
                                  disabled={
                                    item?.payment?.refund === "refunded"
                                  }
                                >
                                  Refund
                                </button>
                              </td>
                              <td>
                                <button
                                  onClick={() => searchBkash(item)}
                                  type="button"
                                  className={
                                    item?.payment?.payment_id
                                      ? "btn btn-primary"
                                      : "d-none"
                                  }
                                  // data-bs-toggle="modal"
                                  // data-bs-target="#refund"
                                >
                                  search
                                </button>
                              </td>
                              <td>
                                <button
                                  onClick={() => queryBkash(item)}
                                  type="button"
                                  className={
                                    item?.payment?.payment_id
                                      ? "btn btn-primary"
                                      : "d-none"
                                  }
                                  // data-bs-toggle="modal"
                                  // data-bs-target="#refund"
                                >
                                  query
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {item?.products?.length &&
                          item?.products?.map((p, i) => {
                            return (
                              <div key={i} className="row g-5 mb-2">
                                <div className="row g-4">
                                  <div className=" col-4">
                                    <img
                                      src={`${p?.picture[0]?.secure_url}`}
                                      className=" ms-3"
                                      width={100}
                                      height={100}
                                      alt="image"
                                    />
                                  </div>
                                  <div className=" col-8 d-flex flex-column">
                                    <div>
                                      <h5>
                                        Name: {p?.name}- Price:{" "}
                                        {
                                          <PriceFormat
                                            price={
                                              p?.price -
                                              (p?.price * p?.offer) / 100
                                            }
                                          />
                                        }
                                      </h5>
                                      <p>Category: {p?.category?.name} </p>
                                      <p>{`Qnty: ${p?.amount}`}</p>
                                      <p>
                                        Sub-Total:{" "}
                                        {
                                          <PriceFormat
                                            price={
                                              (p?.price -
                                                (p?.price * p?.offer) / 100) *
                                              p.amount
                                            }
                                          />
                                        }{" "}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
              </InfiniteScroll>
            </div>
            <div className="d-flex">
              {adminOrders?.length < total ? (
                <>
                  <button
                    onClick={
                      searchVal
                        ? (e) => {
                            setPage(page + 1);
                            getSearchAdminOrders(page + 1, size, e);
                          }
                        : () => {
                            setPage(page + 1);
                            getAdminOrders(page + 1, size);
                          }
                    }
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
        </div>
        <RefundModal value={{ refundItem, refundBkash }} />
      </div>
    </Layout>
  );
};

export default AdminOrders;
