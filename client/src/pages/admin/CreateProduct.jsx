import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import Layout from "../../components/Layout";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import DeleteModal from "../../components/DeleteModal";
import PriceFormat from "../../Helper/PriceFormat";
import OfferInput from "../../components/OfferInput";

const CreateProduct = () => {
  let { token, userInfo, loading, setLoading, catPlain, Axios } = useAuth();
  const [editProduct, setEditProduct] = useState("");
  const [categorySlug, setCategorySlug] = useState("");


  //=============================================================
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let [products, setProducts] = useState([]);
  let size = 10;
  
  let getProducts = async (page = 1, size = 10) => {
    page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/product-list`,
        {
          params: {
            page,
            size,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotal(data.total);
      page === 1 || editProduct
        ? setProducts(data.products)
        : setProducts([...products, ...data.products]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token && userInfo.role) getProducts(page, size);
  }, []);
  //======================================================
  let [searchVal, setSearchVal] = useState("");
  let getSearchAdminProducts = async (page = 1, size = 10, e) => {
    e && e.preventDefault();
    try {
      if (!searchVal) return;
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/product-search`,
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
        ? setProducts(data?.searchProduct)
        : setProducts([...products, ...data.searchProduct]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    
    setPage(1);
  }, [searchVal]);

  //================================================
  let getProductsByCat = async (page = 1, size=10, e) => {
    e && e.preventDefault();
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
      setLoading(false);
      setTotal(data?.total?.length);
      page === 1
        ? setProducts(data?.products)
        : setProducts([...products, ...data.products]);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    setSearchVal('')
    setPage(1)
  }, [categorySlug]);
  //===================================================
  let [delItem, setDelItem] = useState("");

  let deleteItem = async (id) => {
    setLoading(true);
    // setSelectedItem(item);
    let res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/products/delete-product/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    let data = await res.json();
    if (res.ok) {
      toast.success(`${delItem?.name} is deleted successfully`);
      setLoading(false);
      getProducts();
    } else {
      toast.success(data?.msg);
    }
  };
  //====================================================================
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

                  <div>
                    <button
                      onClick={() => setPage(1)}
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#createProduct"
                    >
                      Create Product
                    </button>
                    <CreateProductModal getProducts={getProducts} />
                  </div>
                </div>

                <OfferInput
                  value={{
                    products,
                    getSearchAdminProducts,
                    searchVal,
                    setSearchVal,
                    getProductsByCat,
                    catPlain,
                    setCategorySlug,
                    page,
                    size,
                    setLoading,
                    categorySlug,
                    getProducts,
                    Axios,
                  }}
                />
                <div className=" border">
                  <input
                    onChange={selectHandle}
                    name="selectAll"
                    className=" form-check-input mx-2  border border-secondary"
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
                    next={
                      searchVal
                        ? (e) => {
                            setPage(page + 1);
                            getSearchAdminProducts(e, page + 1, size);
                          }
                        : categorySlug
                        ? () => {
                            setPage(page + 1);
                            getProductsByCat(page + 1, size);
                          }
                        : () => {
                            setPage(page + 1);
                            getProducts(page + 1, size);
                          }
                    }
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
                          <th scope="col">Delete</th>
                          <th scope="col">Update</th>
                        </tr>
                      </thead>

                      <tbody>
                        {products?.length &&
                          products.map((item) => {
                            return (
                              <tr key={item._id}>
                                <td>
                                  {" "}
                                  <input
                                    onChange={selectHandle}
                                    className="form-check-input border border-secondary"
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
                                <td>{item.offer}</td>
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
                                <td>
                                  {loading && item._id === editProduct._id ? (
                                    <>
                                      <button
                                        className="btn btn-primary"
                                        type="button"
                                        disabled
                                      >
                                        <span
                                          className="spinner-border spinner-border-sm"
                                          role="status"
                                          aria-hidden="true"
                                        />
                                        Updating...
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          // setPage(1);
                                          setEditProduct(item);
                                        }}
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editProduct"
                                        disabled={loading}
                                      >
                                        Details & Edit
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </InfiniteScroll>
                </div>
              </div>
            </div>
            <DeleteModal value={{ func: deleteItem, item: delItem }} />
            <UpdateProductModal
              value={{
                editProduct,
                getProducts,
                setEditProduct,
                page,
                size,
              }}
            />
          </div>
          <div className="d-flex">
            {products?.length < total ? (
              <>
                <button
                  onClick={
                    searchVal
                      ? (e) => {
                          setPage(page + 1);
                          getSearchAdminProducts(e, page + 1, size);
                        }
                      : categorySlug
                      ? () => {
                          setPage(page + 1);
                          getProductsByCat(page + 1, size);
                        }
                      : () => {
                          setPage(page + 1);
                          getProducts(page + 1, size);
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
    </Layout>
  );
};

export default CreateProduct;
// export default UseEdit;
