import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import PriceFormat from "../Helper/PriceFormat";
import { Checkbox } from "antd";
import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";


export const CartPage = () => {
  let { token, userInfo, Axios } = useAuth();
  let { cart, setCart } = useSearch();
  let [selectedCart, setSelectedCart] = useState([]);
  let [loading, setLoading] = useState(false);
  let [gateway, setGateway] = useState("");
  let navigate = useNavigate();

  //========= cart update auto

  useEffect(() => {
    let cartIdArr = cart?.length && cart.map((item) => item?._id);
    let getUpdatedProducts = async () => {
      try {
        let { data } = await Axios.post(`/products/cart-update`, { cartIdArr });

        setCart(data.products);
        localStorage.setItem("cart", JSON.stringify(data.products));
      } catch (error) {
        console.log(error);
      }
    };
    getUpdatedProducts();
  }, []);

  // let ref1 = useRef()
  let [refList, setRefList] = useState([]);

  let ref1 = useCallback((el) => {
    setRefList((prev) => [...prev, el]);
  }, []);

  // console.log(refList[0]?.id);

  let cartItemHandle = (checked, checkedItem) => {
    let all = [...selectedCart];
    if (checked) {
      all.push(checkedItem);
    } else {
      all = all.filter((item) => item._id !== checkedItem._id);
      let one =
        refList?.length &&
        refList.find((item) => item?.id === checkedItem?._id);
      one.value = "";
    }
    setSelectedCart(all);
  };

    let colorHandle = (id, e) => {
      let findObj =
        selectedCart.length && selectedCart.find((item) => item._id === id);
      if (!findObj) {
        alert("Please select the item first");
        let one = refList?.length && refList.find((item) => item?.id === id);
        return (one.value = "");
      }
      let tempObj = { ...findObj };
      tempObj.color = [e.target.value];
      let tempArr2 = selectedCart.filter((item) => item._id !== id);
      tempArr2.push(tempObj);
      setSelectedCart(tempArr2);
    };

  let amountHandle = (id, d) => {
    let isSelected =
      selectedCart.length && selectedCart.find((item) => item._id === id);
    if (!isSelected) return alert("Please select the item first");
    let ind = -1;
    selectedCart.length &&
      selectedCart?.forEach((data, index) => {
        if (data._id === id) ind = index;
      });

    let tempArr = [...selectedCart];
    tempArr[ind].amount += d;
    setSelectedCart([...tempArr]);
  };

  let totalFrac =
    selectedCart?.length &&
    selectedCart?.reduce((previous, current) => {
      return (
        previous +
        (current?.price - (current?.price * current?.offer) / 100) *
          current.amount
      );
    }, 0);
  
let total =Math.round(totalFrac)
  
  let removeCartItem = (id) => {
    try {
      let isSelected =
        selectedCart?.length && selectedCart.find((item) => item._id === id);
      if (isSelected) {
        return alert("Deselect the item first to remove from cart");
      }
      let index = cart?.findIndex((item) => item._id === id);
      let newCart = [...cart];
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
        callbackURL: `${
          import.meta.env.VITE_BASE_URL
        }/products/order/bkash-callback`,
      });
      setLoading(false);
      window.location.href = data?.bkashURL;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  //===================================================

  //============== for ssl
  let checkout = async () => {
    try {
      if (!selectedCart.length)
        return alert("No item has been selected for check out");
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
                          checked={
                            selectedCart?.length &&
                            selectedCart?.filter((p) => p?._id === item?._id)
                              .length > 0
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
                          <p
                            className={
                              item?.color?.length ? "m-0 py-2 w-50" : "d-none"
                            }
                          >
                            <select
                              ref={ref1}
                              onChange={(e) => colorHandle(item._id, e)}
                              name=""
                              id={item?._id}
                              // value={'colormm'}
                              className="form-select"
                            >
                              <option value={""}>Select Color</option>
                              {item?.color?.length &&
                                item?.color.map((clr) => (
                                  <option key={clr} value={clr}>
                                    {clr}
                                  </option>
                                ))}
                            </select>
                          </p>
                          {/* <div className="mb-2">
                            <input
                              ref={ref1}
                              className="form-control"
                              list="mm"
                              type={"text"}
                          
                              placeholder={"bbbbbbbb"}
                              onChange={(e) => colorHandle(item._id, e)}
                            />

                            <datalist id="mm">
                              {item?.color?.length &&
                                item?.color.map((clr) => {
                                  return (
                                    <option
                                      key={clr}
                                      value={clr}
                                    ></option>
                                  );
                                })}
                            </datalist>
                          </div> */}
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
                <div className=" text-start">
                  <div>
                    <input
                      onChange={() => setGateway("ssl")}
                      className=""
                      type="radio"
                      name="same"
                      id="ssl"
                      checked={gateway === "ssl" || gateway === ""}
                    />
                    <label className="m-2" htmlFor="ssl">
                      <img
                        src="sslcommerz.jpeg"
                        alt="ssl"
                        width={60}
                        height={60}
                      />
                      {" SSL COMMERZ"}
                    </label>
                  </div>
                  <div>
                    <input
                      onChange={() => setGateway("bkash")}
                      type="radio"
                      name="same"
                      id="bkash"
                      // checked={user.gender === "Male"}
                    />
                    <label className="m-2" htmlFor="bkash">
                      <img src="bkash.png" alt="bkash" width={50} height={50} />
                      {" BKASH "}
                    </label>
                  </div>
                </div>
                <button
                  onClick={gateway === "bkash" ? checkoutBkash : checkout}
                  className="btn btn-danger w-100"
                >
                  Check out
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default CartPage;
