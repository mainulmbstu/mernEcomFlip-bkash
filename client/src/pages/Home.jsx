import { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import "react-lazy-load-image-component/src/effects/blur.css";
import Marquee from "react-fast-marquee";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeCatPage from "../components/HomeCatPage";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  // const [checkedCat, setCheckedCat] = useState([]);
  // const [priceCat, setPriceCat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);

  let [total, setTotal] = useState(0);
  let { Axios } = useAuth();

  // let catHandle = (checked, id) => {
  //   let all = [...checkedCat];
  //   if (checked) {
  //     all.push(id);
  //   } else {
  //     all = all.filter(item => item !== id);
  //   }
  //   setCheckedCat(all);
  // };

  //==============  filter ====================================
  //   const [filterPage, setFilterPage] = useState(1);

  //   useEffect(() => {
  //    setFilterPage(1)
  //  }, [checkedCat, priceCat]);

  //   let getProductFilter = async (filterPage=1) => {
  //     try {
  //       setLoading(true);
  //       let { data } = await axios.post(
  //         `${import.meta.env.VITE_BASE_URL}/products/product-filter`,
  //         {
  //           checkedCat,
  //           priceCat,
  //           pageOrSize: {
  //             page: filterPage,
  //             size: 4,
  //           },
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );
  //       setLoading(false);
  //       if (!data.success) {
  //         return toast.error(data.msg);
  //       }
  //       setTotal(data.total);
  //         filterPage === 1
  //           ? setProducts(data?.products)
  //           : setProducts([...products, ...data.products]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     if (priceCat.length !== 0 || checkedCat.length !== 0)
  //       getProductFilter();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [checkedCat, priceCat]);

  //========== products with limit  ==================

  let [page, setPage] = useState(1);

  let getProducts = async () => {
    try {
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/product-list-limit`,
        {
          params: {
            page,
            size: 12,
          },
        }
      );
      setPage(page + 1);
      setTotal(data.total);
      setProducts([...products, ...data.products]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log({ msg: "error from get products", error });
    }
  };

  //=====================================

  let getOfferProducts = async () => {
    //  page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let { data } = await Axios.get("/products/offers", {
        params: {
          page: 1,
          size: 5,
        },
      });
      setLoading(false);
      setTotal(data?.total);
      setOfferProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOfferProducts();
    getProducts();
  }, []);

  //===========================================
  return (
    <Layout title={"home"}>
      <div className={loading ? "dim" : ""}>
        <div className=" hero-area text-danger">
          <Marquee direction="left" speed={300} autofill={false} loop={""}>
            <h1>WELCOME TO DEMO ECOMMERCE WEBSITE || </h1>
          </Marquee>
        </div>
        <div className="row px-md-4">
          {/* <div className="col-2 d-none d-md-block">
            <div className=" d-none d-md-block">
              <h5>Category</h5>
              <div className=" d-flex flex-column">
                {category?.length &&
                  category?.map((item) => (
                    <Checkbox
                      key={item?._id}
                      onChange={(e) => catHandle(e.target.checked, item._id)}
                    >
                      {item?.name}
                    </Checkbox>
                  ))}

              </div>
            </div>

            <div>
              <h5>Price Category</h5>

              <div className=" d-flex flex-column">
                <div>
                  <input
                    onChange={() => setPriceCat([1, 5000])}
                    type="radio"
                    name="kkk"
                    id="one"
                  />
                  <label htmlFor="one">1-5000</label>
                </div>
                <div>
                  <input
                    onChange={() => setPriceCat([5001, 10000])}
                    type="radio"
                    name="kkk"
                    id="two"
                  />
                  <label htmlFor="two">5001-10000</label>
                </div>
                <div>
                  <input
                    onChange={() => setPriceCat([10001, 15000])}
                    type="radio"
                    name="kkk"
                    id="three"
                  />
                  <label htmlFor="three">10001-15000</label>
                </div>
                <div>
                  <input
                    onChange={() => setPriceCat([15001, 999999999])}
                    type="radio"
                    name="kkk"
                    id="four"
                  />
                  <label htmlFor="four">15001-Above</label>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={() => window.location.reload()}
                className=" btn btn-success"
              >
                Reset Filter
              </button>
            </div>
          </div> */}

          <div className="col-md-12">
            <div>
              <HomeCatPage />
            </div>
            <hr />

            <div className={offerProducts?.length ? "row g-3" : "d-none"}>
              <h6 className="ps-2">Special Offer</h6>
              {offerProducts?.length &&
                offerProducts?.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              <div className="col-6 col-md-3 col-lg-2 showAllOffer">
                <Link
                  to={"/offers"}
                  className=" d-flex w-100 h-100 bg-black justify-content-center align-items-center"
                >
                <span className="fs-3">All Offers</span>
                </Link>
              </div>
            </div>

            <hr />
            <h3 className=" text-danger">
              {!products?.length ? "No Product Found!!" : ""}
            </h3>

            <InfiniteScroll
              dataLength={products.length}
              next={
                getProducts
                // !checkedCat.length && !priceCat.length
                //   ? getProducts
                //   : () => {
                //       setFilterPage(filterPage + 1);
                //       getProductFilter(filterPage + 1);
                //     }
              }
              hasMore={products.length < total}
              loader={<h1>Loading...</h1>}
              endMessage={<h4 className=" text-center">All items loaded</h4>}
            >
              <div className="row g-3">
                {products?.length &&
                  products?.map((item) => (
                    <ProductCard key={item._id} item={item} />
                  ))}
              </div>
            </InfiniteScroll>
          </div>
          <div className="d-flex">
            {products.length < total ? (
              <>
                <button
                  onClick={
                    getProducts
                    // () => {
                    // if (!checkedCat.length && !priceCat.length) {
                    //   getProducts();
                    // } else {
                    //   setFilterPage(filterPage + 1);
                    //   getProductFilter(filterPage + 1);
                    // }
                    // }
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

export default Home;
