import { useEffect } from "react";
import UserMenu from "./UserMenu";
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import Layout from "./../../components/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import PriceFormat from "../../Helper/PriceFormat";

const Orders = () => {
  let [loading, setLoading] = useState(false);
  let [orders, setOrders] = useState([]);
  let { token } = useAuth();
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);

  let getUserOrders = async () => {
    page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/orders`,
        {
          params: {
            page: page,
            size: 8,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPage(page + 1);
      setTotal(data.total);
      setOrders([...orders, ...data.orderList]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) getUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Layout title="User order list">
      <div className={loading ? "dim" : ""}>
        <div className="row ">
          <div className="col-md-3 p-2">
            <div className=" sticky-top z-0">
              <div className="card p-2">
                <UserMenu />
              </div>
              <div className=" card p-2 text-center mt-3">
                <h2>
                  All orders ({orders?.length} of {total})
                </h2>
              </div>
            </div>
          </div>
          <div className=" col-md-9 p-2">
            <InfiniteScroll
              dataLength={orders.length}
              next={getUserOrders}
              hasMore={orders.length < total}
              loader={<h1>Loading...</h1>}
              endMessage={<h4 className=" text-center">All items loaded</h4>}
            >
              <div className="row ">
                {orders?.length &&
                  orders?.map((item, i) => {
                    return (
                      <div key={item._id} className=" shadow">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Status</th>
                              <th scope="col">Payment</th>
                              <th scope="col">Item</th>
                              <th scope="col">Total Price</th>
                              <th scope="col">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{i + 1} </td>
                              <td>{item?.status} </td>
                              <td>
                                {item?.payment?.status ? "Success" : "Failed"}{" "}
                              </td>
                              <td>{item?.products.length} </td>
                              <td>{<PriceFormat price={item?.total} />} </td>
                              <td>{moment(item?.createdAt).fromNow()} </td>
                            </tr>
                          </tbody>
                        </table>
                        {item?.products?.map((p, i) => {
                          return (
                            <div key={i} className="row g-5 mb-2">
                              <div className="row g-4">
                                <div className=" col-sm-6">
                                  <img
                                    src={`${p?.picture[0]?.secure_url}`}
                                    className=" ms-3"
                                    width={100}
                                    height={100}
                                    alt="image"
                                  />
                                </div>
                                <div className=" col-sm-6 d-flex flex-column">
                                  <div>
                                    <h5>
                                      Name: {p?.name}- Price:{" "}
                                      {<PriceFormat price={p?.price-p?.price*p?.offer/100} />}
                                    </h5>
                                    <p>Category: {p?.category?.name} </p>
                                    <p>{`Quantity: ${p?.amount}`}</p>
                                    <p>
                                      Sub-Total:{" "}
                                      {
                                        <PriceFormat
                                          price={(p?.price-p?.price*p?.offer/100) * p.amount}
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
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
