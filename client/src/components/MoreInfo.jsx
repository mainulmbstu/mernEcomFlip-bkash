import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearch } from "../context/SearchContext";
import Layout from "./Layout";
import PriceFormat from "../Helper/PriceFormat";
// import ReactImageMagnify from "react-image-magnify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Review from "./Review";
import Rating from "./Rating";
import { MdStar } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import ProductCard from "./ProductCard";



const MoreInfo = () => {
  const [moreInfo, setMoreInfo] = useState("");
  const [review, setReview] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  let params = useParams();
  let { cart, setCart } = useSearch();
  let { Axios } = useAuth();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState([]);
  const [reviewItem, setReviewItem] = useState('');
  const [ratingItem, setRatingItem] = useState("")

  //=================================
  let getMoreInfo = async () => {
    try {
      setLoading(true);
      let {data} = await Axios.get(`/products/more-info/${params.pid}`);
      setLoading(false);
      setMoreInfo(data.product);
      setImg(data?.product?.picture[0]?.secure_url);
    } catch (error) {
      setLoading(false);
      console.log('error from more info', error)
    }
  };
  //=================================
  let getReview = async () => {
    try {
      setLoading(true);
      let {data} = await Axios.get(`/products/getreview/${params.pid}`);
      setLoading(false);
      setReview(data.reviews);
    } catch (error) {
      setLoading(false);
      console.log('error from more info', error)
    }
  };

  useEffect(() => {
    getMoreInfo();
    getReview();
  }, [params]);
  //=============================================
  let getSimilarProducts = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/search/similar/${
          moreInfo?._id
        }/${moreInfo?.category?._id}`,
        {
          method: "GET",
        }
      );
      let data = await res.json();
      setSimilarProducts(data.products);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (moreInfo?.length < 1) return;
    getSimilarProducts();
  }, [moreInfo]);

  let [test, settest] = useState([]);

  let addrefs = useCallback((el) => {
    settest((prev) => [...prev, el]);
  }, []);

  let mouseOverHandle = (item, i) => {
    setImg(item.secure_url);
    test[i]?.classList.add("myImg");
    for (let k = 0; k < test.length; k++) {
      if (k !== i) {
        test[k]?.classList.remove("myImg");
      }
    }
  };

  let screen=window.screen.width

  return (
    <Layout title={"More Information"}>
      <div className={loading ? "dim" : ""}>
        <div className="px-2">
          <div className="row g-3">
            <div className="row g-4 border">
              <h1 className=" text-center">Details of product</h1>

              <hr />
              {/* {loading && <Loading />} */}
              <div className="col-md-7 row">
                <div className=" col-md-3 pb-3 order-2 order-md-1 d-flex d-lg-block flex-wrap">
                  {moreInfo?.picture?.map((item, i) => {
                    return (
                      <div className={`text-center  py-1`} key={i}>
                        <img
                          onMouseOver={() => {
                            mouseOverHandle(item, i);
                          }}
                          ref={addrefs}
                          style={{ cursor: "pointer" }}
                          src={`${item?.secure_url}`}
                          alt="img"
                          width={70}
                          height={70}
                          className={`px-3 ${i === 0 ? "myImg" : ""}`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className=" col-md-9 pb-3 d-flex  justify-content-center order-1 order-md-2">
                  <LazyLoadImage
                    src={img}
                    alt="image"
                    width={screen > 768 ? 400 : 200}
                    height={screen > 768 ? 500 : 200}
                    className="px-3"
                  />

                  {/* <div>
                    <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: "Product image",
                          // isFluidWidth: true,
                          src: `${moreInfo?.picture?.secure_url}`,
                          width: 300,
                          height: 400,
                        },
                        largeImage: {
                          src: `${moreInfo?.picture?.secure_url}`,
                          width: 1200,
                          height: 1800,
                        },
                        enlargedImageContainerDimensions: {
                          width: '300%',
                          height: '100%',
                        },
                      }}
                    />
                  </div> */}
                </div>
              </div>
              <div className=" col-md-5 px-md-5">
                <div>
                  <h5>Name: {moreInfo?.name} </h5>
                  <p>Product ID: {moreInfo?._id} </p>
                  <p>Category: {moreInfo?.category?.name} </p>
                  <p>Price: {<PriceFormat price={moreInfo?.price} />} </p>
                  <p>Quqntity: {moreInfo?.quantity} </p>
                  <p className="m-0 ">
                    <span className="bg-success p-1 rounded-3 text-white">
                      Rating: {moreInfo?.rating}
                      <MdStar className=" text-warning mb-1" />
                    </span>{" "}
                    ({moreInfo?.ratingNo} users)
                  </p>
                  <p>Description: {moreInfo?.description} </p>
                </div>
                <div className=" my-3 w-100">
                  <button
                    onClick={() => setReviewItem(moreInfo)}
                    type="button"
                    className="btn btn-success mt-auto w-100 mb-2"
                    data-bs-toggle="modal"
                    data-bs-target="#review"
                  >
                    Review this product
                  </button>
                  <Review reviewItem={reviewItem} />
                  <button
                    onClick={() => setRatingItem(moreInfo)}
                    type="button"
                    className="btn btn-success mt-auto w-100 mb-2"
                    data-bs-toggle="modal"
                    data-bs-target="#rating"
                  >
                    Rate this product
                  </button>
                  <Rating ratingItem={ratingItem} />
                  <button
                    onClick={() => {
                      let cartIds = cart.map((it) => it._id);
                      if (cartIds.includes(moreInfo._id)) {
                        return alert("Already added");
                      }
                      setCart([moreInfo,...cart]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([moreInfo, ...cart])
                      );
                      toast.success(`${moreInfo?.name} added to Cart`);
                    }}
                    className="btn btn-info mt-auto w-100"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" ">
            <h4 className=" fw-bold ms-3">Reviews about this product </h4>
            {review?.length &&
              review.map((item) => {
                return (
                  <div key={item._id} className=" p-2 px-3">
                    <h5>
                      Name: {item.name} ({moment(item?.createdAt).fromNow()})
                    </h5>
                    <p>review: {item.review} </p>

                    <hr className=" w-25" />
                    <h5>{item?.replies?.length ? "Replies" : ""}</h5>
                  </div>
                );
              })}
          </div>
          <hr />
          <div className=" mb-4">
            <h4>Similar Products</h4>
            <div className="row g-3">
              {similarProducts?.length &&
                similarProducts?.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MoreInfo;
