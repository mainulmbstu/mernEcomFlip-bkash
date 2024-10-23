import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useAuth } from "../context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "./ProductCard";

const OfferPage = () => {
  let { Axios } = useAuth();
  const [offerProducts, setOfferProducts] = useState([]);
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let [loading, setLoading] = useState(false);
  let size = 12;

  //=====================================
  let getOfferProducts = async (page = 1, size = 6) => {
    //  page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let { data } = await Axios.get("/products/offers", {
        params: {
          page,
          size,
        },
      });
      setLoading(false);
      setTotal(data?.total);
      page === 1
        ? setOfferProducts(data?.products)
        : setOfferProducts([...offerProducts, ...data.products]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOfferProducts(1, size);
  }, []);

  return (
    <Layout title={`offers`}>
      <div className={loading ? "dim" : ""}>
        <div className="px-2 mt-3">
          <h3 className=" text-capitalize">
            {offerProducts?.length
              ? `Offers of the day (${offerProducts?.length} of ${total})`
              : ""}
          </h3>
          <h3 className=" text-danger">
            {!offerProducts?.length ? "No Product Found!!" : ""}
          </h3>
          <InfiniteScroll
            dataLength={offerProducts?.length}
            next={() => {
              setPage(page + 1);
              getOfferProducts(page + 1);
            }}
            hasMore={offerProducts?.length < total}
            loader={<h1>Loading...</h1>}
            endMessage={<h4 className=" text-center">All items loaded</h4>}
          >
            <div className="row g-3">
              {offerProducts?.length &&
                offerProducts?.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};

export default OfferPage;
