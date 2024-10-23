import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import PriceCategory from "../components/PriceCategory";
import { useSearch } from "../context/SearchContext";

const Category = () => {
  const [products, setProducts] = useState([]);
  let params = useParams();
  let { catPlain} = useAuth();
  let { priceCatArr, priceCat, setPriceCat } = useSearch();

  let catItem =
    catPlain.length && catPlain.find((item) => item.slug == params.slug);

  let catItemChildren =
    catItem && catPlain.filter((item) => item.parentId === catItem._id);

  //======================================================
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [params.slug]);
  //================================================
  let getProducts = async (page = 1) => {
    try {
      setLoading(true);
      let { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/category/${params.slug}`,
        {
          page: page,
          size: 6,
          priceCatArr,
          catSlug:params.slug
        }
      );
      setLoading(false);
      setTotal(data?.total);
      page === 1
        ? setProducts(data?.products)
        : setProducts([...products, ...data.products]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [params.slug, priceCat]);

  useEffect(() => {
    setPriceCat('')
  }, [params.slug]);

  let screen = window.screen.width;

  return (
    <Layout title={`Category-${params.slug}`}>
      <div className={loading ? "dim" : ""}>
        <div className="row">
          <PriceCategory />
          <div className="col-10 px-2">
            <div>
              <div className={`${catItemChildren.length?' row my-2':'d-none'}`}>
                {catItemChildren.length &&
                  catItemChildren.map((item) => (
                    <div key={item._id} className="col-2 col-md-2 p-2 ">
                      <div className={`${catItemChildren.length?'p-2':'d-none'}`}>
                        <Link
                          to={`/products/category/${item.slug}`}
                          className=" text-decoration-none"
                        >
                          <img
                            src={
                              item.picture
                                ? `${import.meta.env.VITE_BASE_URL}/${
                                    item.picture
                                  }`
                                : `/placeholder.jpg`
                            }
                            // `${import.meta.env.VITE_BASE_URL}/${cat.picture }`
                            alt="image"
                            width={"100%"}
                            // height={400}
                            height={screen > 768 ? 150 : 50}
                          />
                          <p className=" text-center">{item?.name} </p>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="px-2 mt-3">
              <h3 className=" text-capitalize">
                {products?.length
                  ? `Category: ${params.slug} (${products?.length} of ${total})`
                  : ""}
              </h3>
              <h3 className=" text-danger">
                {!products?.length ? "No Product Found!!" : ""}
              </h3>
              <InfiniteScroll
                dataLength={products?.length}
                next={() => {
                  setPage(page + 1);
                  getProducts(page + 1);
                }}
                hasMore={products?.length < total}
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
              <div className="d-flex">
                {products?.length < total ? (
                  <>
                    <button
                      onClick={() => {
                        setPage(page + 1);
                        getProducts(page + 1);
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Category;
