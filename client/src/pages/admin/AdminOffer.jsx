import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Layout from "../../components/Layout";
import AdminMenu from "./AdminMenu";
import InfiniteScroll from "react-infinite-scroll-component";
import PriceFormat from "../../Helper/PriceFormat";
import { toast } from "react-toastify";
import OfferInput from "../../components/OfferInput";

const AdminOffer = () => {
  let { loading, setLoading, catPlain, Axios } = useAuth();
  const [categorySlug, setCategorySlug] = useState("");

  //=============================================================
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let [products, setProducts] = useState([]);
  let [selectIds, setSelectIds] = useState([]);
  let [offer, setOffer] = useState('');

  useEffect(() => {
    let selectIdArr =
    products?.length &&
    products.filter((item) => item?.isChecked).map((item) => item?._id);
    setSelectIds(selectIdArr);
  }, [products]);
  
  let selectHandle = (e) => {
    let { name, checked } = e.target;
    if (name === "selectAll") {
      let tempArr = products?.map((item) => {
        return { ...item, isChecked: checked };
      });
      setProducts(tempArr);
    } else {
      let tempArr = products?.map((item) =>
        item?._id === name ? { ...item, isChecked: checked } : item
      );
      setProducts(tempArr);
    }
  };

  let size = 2;
  //================================================
  let getProductsByCat = async ( page=1, size, e) => {
    e && e.preventDefault();
    if (!categorySlug) return;
    //   alert('Select a category')
    try {
      setLoading(true);
      let { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/category/${categorySlug}`,
        {
          page,
          size,
          catSlug: categorySlug,
        }
      );
      // setPage(page + 1);
      setLoading(false);
      setTotal(data?.total?.length);
      page === 1
        ? setProducts(data?.products)
        : setProducts([...products, ...data.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (!categorySlug) return;
  //   getProductsByCat();
  // }, []);

  useEffect(() => {
    setPage(1);
  }, [categorySlug]);

  //===================================================
  //==================================================
  let offerSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let { data } = await Axios.post(`/admin/offer`, {selectIds, offer});
      if (data.success) {
        toast.success(data.msg);
        setOffer('');
        getProductsByCat(1, page*size);
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error from contact", error);
    }
  };
  //====================================================================

  return (
    <Layout title={"Products"}>
      <div className={loading ? "dim" : ""}>
        <div className="row ">
          <div className="col-md-3 p-2">
            <AdminMenu />
          </div>
          <div className=" col-md-9 p-2">
            <div className=" card p-2">
              <div className="">
                <div className=" d-flex justify-content-between mb-3">
                  <h3>
                    Product List ({products?.length} of {total}){" "}
                  </h3>
                </div>

                <div className=" d-flex my-2">
                  <div className="col-md-4 ps-2">
                    <form
                      className="d-flex"
                      role="search"
                      onSubmit={(e) => getProductsByCat(1, size, e)}
                    >
                      {/* <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Select Category"
                        aria-label="Search"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                      /> */}
                      <div className="mb-2">
                        <input
                          className="form-control"
                          list="categoryList"
                          type={"text"}
                          placeholder="Select category"
                          onChange={(e) => {
                            let cat =
                              catPlain?.length &&
                              catPlain.find(
                                (item) => item?.slug === e.target.value
                              );
                            setCategorySlug(cat?.slug);
                          }}
                        />
                        <datalist id="categoryList">
                          {catPlain?.length &&
                            catPlain.map((item) => {
                              return (
                                <option
                                  key={item._id}
                                  value={item?.slug}
                                ></option>
                              );
                            })}
                        </datalist>
                      </div>
                      <div>
                        <button
                          className="btn btn-success btn-outline-black"
                          type="submit"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>

                  <OfferInput value={{offer, setOffer, offerSubmit}} />
                </div>

                <div className=" border">
                  <input
                    onChange={selectHandle}
                    name="selectAll"
                    className=" form-check-input mx-2"
                    checked={
                      products?.length &&
                      products.filter((item) => item?.isChecked !== true)
                        .length < 1
                    }
                    type="checkbox"
                    id="all"
                  />
                  <label className=" fw-bold form-check-label" htmlFor="all">
                    Select All
                  </label>

                  <InfiniteScroll
                    dataLength={products.length}
                    next={() => {
                      setPage(page + 1);
                      getProductsByCat(page + 1, size);
                    }}
                    hasMore={products.length < total}
                    loader={<h1>Loading...</h1>}
                    endMessage={
                      <h4 className=" text-center">All items loaded</h4>
                    }
                  >
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">Image</th>
                          <th scope="col">Name</th>
                          <th scope="col">Category</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Original-Price</th>
                          <th scope="col">Offer</th>
                        </tr>
                      </thead>

                      <tbody>
                        {products?.length &&
                          products.map((item) => {
                            return (
                              <tr key={item._id}>
                                <td>
                                  <input
                                    onChange={selectHandle}
                                    className="form-check-input"
                                    type="checkbox"
                                    name={item?._id}
                                    id={item._id}
                                    checked={item?.isChecked || false}
                                  />
                                </td>
                                <td>
                                  <label htmlFor={item._id}>
                                    <img
                                      src={`${item?.picture[0]?.secure_url}`}
                                      alt=""
                                      width="30"
                                    />
                                  </label>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.category?.name}</td>
                                <td>{item.quantity}</td>
                                <td>{<PriceFormat price={item.price} />}</td>
                                <td>{item.offer} %</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            {products?.length < total ? (
              <>
                <button
                  onClick={
                    () => {
                      setPage(page + 1);
                      getProductsByCat(page + 1, size);
                    }

                    // !searchVal
                    //   ? () => {
                    //       setPage(page + 1);
                    //       getProducts(page + 1, size);
                    //     }
                    //   : (e) => {
                    //       setPage(page + 1);
                    //       getSearchAdminProducts(e, page + 1, size);
                    //     }
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
    </Layout>
  );
};

export default AdminOffer;
