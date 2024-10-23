import { useSearch } from "../context/SearchContext";
import Layout from "./Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "./ProductCard";
import PriceCategory from "./PriceCategory";

const SearchResults = () => {
  const { results, submitHandler, total, size, page,setPage, loading } = useSearch();

  return (
    <Layout title={"Search result"}>
      <div className={loading ? "dim" : ""}>
        <div className="row">
          <PriceCategory />
          <div className="col-10 px-2 py-4">
            <InfiniteScroll
              dataLength={results?.length && results?.length}
              next={(e) => {
                setPage(page + 1);
                submitHandler(page + 1, size , e);
              }}
              hasMore={results?.length < total}
              loader={<h1>Loading...</h1>}
              endMessage={<h4 className=" text-center">All items loaded</h4>}
            >
              <div className="row g-3">
                <h3>Search results ({results?.length} of {total}) </h3>
                {results?.length &&
                  results?.map((item) => (
                    <ProductCard key={item._id} item={item} />
                  ))}
              </div>
            </InfiniteScroll>
            <div className="d-flex">
              {results.length < total ? (
                <>
                  <button
                    onClick={() => {
                      setPage(page + 1);
                      submitHandler(page+1, size);
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
    </Layout>
  );
};

export default SearchResults;
