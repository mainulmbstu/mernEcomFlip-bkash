import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import PriceFormat from "../Helper/PriceFormat";
import { Checkbox } from "antd";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";


export const CartPage = () => {
  let { token, userInfo, Axios } = useAuth();
  let { cart, setCart } = useSearch();
  let [ selectedCart, setSelectedCart ] = useState([]);
  let [ loading, setLoading ] = useState(false);
  let navigate = useNavigate();

  //========= cart update auto


  useEffect(() => {
    let cartIdArr = cart?.length && cart.map(item => item?._id)
    let getUpdatedProducts = async () => {
      try {
        let {data} = await Axios.post(`/products/cart-update`, { cartIdArr });
        
        setCart(data.products);
        localStorage.setItem("cart", JSON.stringify(data.products));
        } catch (error) {
          console.log(error);
        }
    }
    getUpdatedProducts()
  }, [])
  

    let cartItemHandle = (checked, checkedItem) => {
      let all = [...selectedCart];
      if (checked) {
        all.push(checkedItem);
      } else {
        all = all.filter((item) => item._id !== checkedItem._id);
      }
      setSelectedCart(all);
    };


  let amountHandle = (id, d) => {
    let isSelected = selectedCart.length && selectedCart.find(item => item._id === id)
    if (!isSelected) return alert('Please select the item first')
    let ind = -1;
    selectedCart.length &&
      selectedCart?.forEach((data, index) => {
        if (data._id === id) ind = index;
      });

    let tempArr = [...selectedCart];
    tempArr[ind].amount += d;
    setSelectedCart([...tempArr]);
  };

  let total =
    selectedCart?.length &&
    selectedCart?.reduce((previous, current) => {
      return previous +( current?.price - current?.price * current?.offer/100)* current.amount;
    }, 0);

  let removeCartItem = (id) => {
    try {
      let index = cart?.findIndex((item) => item._id === id);
      let newCart=[...cart]
      newCart?.splice(index, 1);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };


//===================================================
  let checkoutBkash = async () => {
    try {
      if (!selectedCart.length)
        return alert("No item has been selected for check out");
      setLoading(true);
      let { data } = await Axios.post(`/products/order/checkout-bkash`, {
        cart: selectedCart,
        total,
        callbackURL: `${import.meta.env.VITE_BASE_URL}/products/order/bkash-callback`,
        orderID: 'demo-101',
        reference:'demo'
      });
      setLoading(false);
      window.location.href = data?.bkashURL;
      // if (data?.success) {
      // }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
//===================================================





  //============== for ssl
  let checkout = async () => {
    try {
      if (!selectedCart.length) return alert('No item has been selected for check out')
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/order/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: selectedCart, total }),
        }
      );
      let data = await res.json();
      window.location.replace(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"cart"}>
      <div className={loading ? "dim" : ""}>
        <div className="row text-center mb-5">
          <h3>{token ? `Hello ${userInfo?.name}` : "Hello Guest"}</h3>
          <h4 className="">
            {cart?.length
              ? `You have ${cart?.length} items in cart ${
                  token ? "" : "Please login to checkout"
                }`
              : "Your cart is empty"}
          </h4>
        </div>
        <hr />
        <div className="row mt-5">
          <div className="col-md-8 mt-0">
            {cart?.length &&
              cart.map((item, i) => {
                return (
                  <div key={i} className="row border p-1 mb-2 ms-3">
                    <div className=" col-5 row ">
                      <div className="col-3 align-content-center">
                        <Checkbox
                          id={item?._id}
                          onChange={(e) =>
                            cartItemHandle(e.target.checked, item)
                          }
                        ></Checkbox>
                      </div>
                      <div className="col-9">
                        <label htmlFor={item?._id}>
                          <img
                            src={`${item?.picture[0]?.secure_url}`}
                            className=" w-100"
                            height={90}
                            alt="image"
                          />
                        </label>
                      </div>
                    </div>
                    <div className=" col-7 ps-3">
                      <div className=" d-flex flex-column h-100">
                        <div>
                          <h5>
                            Name: {item?.name}, Price:{" "}
                            {
                              <PriceFormat
                                price={
                                  item?.price -
                                  (item?.price * item?.offer) / 100
                                }
                              />
                            }
                          </h5>
                          <p className="m-0">
                            Category: {item?.category?.name}{" "}
                          </p>
                          <div>
                            <button
                              onClick={() => amountHandle(item._id, -1)}
                              className=" px-3 me-3 btn btn-secondary"
                              disabled={item?.amount === 1}
                            >
                              -
                            </button>
                            <span>{item?.amount} </span>
                            <button
                              onClick={() => amountHandle(item?._id, 1)}
                              className=" px-3 mx-3 btn btn-secondary"
                              disabled={item?.amount === item?.quantity}
                            >
                              +
                            </button>
                          </div>
                          <p className="text-danger">
                            {item?.amount === item?.quantity
                              ? "Max available quantity reached"
                              : ""}{" "}
                          </p>
                          <p className=" fw-bold">
                            Sub-Total:{" "}
                            {
                              <PriceFormat
                                price={
                                  (item?.price -
                                    (item?.price * item?.offer) / 100) *
                                  item?.amount
                                }
                              />
                            }{" "}
                          </p>{" "}
                        </div>
                        <div className=" mt-auto">
                          <button
                            onClick={() => removeCartItem(item._id)}
                            className="btn btn-danger mb-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <p>Total|| Checkout|| Payment</p>
            <hr />
            <h3>Total: {<PriceFormat price={total} />}</h3>
            <hr />
            {userInfo?.address ? (
              <>
                <h4>Current Address</h4>
                <h5>{userInfo?.address} </h5>
                <button
                  onClick={() => navigate("/dashboard/user/profile")}
                  className="btn btn-success"
                >
                  Update address
                </button>
              </>
            ) : (
              <div>
                <button
                  onClick={() => navigate("/login", { state: "/cart" })}
                  className="btn btn-primary"
                >
                  Please login to checkout
                </button>
              </div>
            )}
            {cart?.length && token ? (
              <div className="my-4 w-100">
                <button onClick={checkout} className="btn btn-danger w-100">
                  Check out(SSL)
                </button>
              </div>
            ) : (
              ""
            )}
            <div className="my-4 w-100">
              <button onClick={checkoutBkash} className="btn btn-info w-100">
                Check out(bkash)
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default CartPage;
