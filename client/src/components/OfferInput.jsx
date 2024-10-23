/* eslint-disable */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OfferInput = ({ value }) => {
  let {
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
  } = value;

  let [selectIds, setSelectIds] = useState([]);
  let [offer, setOffer] = useState("");

  useEffect(() => {
    let selectIdArr =
      products?.length &&
      products.filter((item) => item?.isChecked).map((item) => item?._id);
    setSelectIds(selectIdArr);
  }, [products]);

  let offerSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let { data } = await Axios.post(`/admin/offer`, { selectIds, offer });
      if (data.success) {
        toast.success(data.msg);
        setOffer("");
        searchVal
          ? getSearchAdminProducts(e, 1, size * page)
          : categorySlug
          ? getProductsByCat(1, size * page)
          : getProducts(1, size * page);
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error from contact", error);
    }
  };



  return (
    <div className="row my-2">
      <div className="col-md-3 ps-2 my-1">
        <form
          className="d-flex"
          role="search"
          onSubmit={(e)=> getSearchAdminProducts(1, size*page, e)}
        >
          <input
            className="form-control"
            type="search"
            placeholder="Product Name"
            aria-label="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button className="btn btn-success btn-outline-black" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="col-md-3 ps-2 my-1">
        <form
          className="d-flex"
          role="search"
          onSubmit={(e) => getProductsByCat(1, size * page, e)}
        >
          <div className=" w-100">
            <input
              className="form-control"
              list="categoryList"
              type={"text"}
              placeholder="Select category"
              onChange={(e) => {
                let cat =
                  catPlain?.length &&
                  catPlain.find((item) => item?.slug === e.target.value);
                setCategorySlug(cat?.slug);
              }}
            />
            <datalist id="categoryList">
              {catPlain?.length &&
                catPlain.map((item) => {
                  return <option key={item._id} value={item?.slug}></option>;
                })}
            </datalist>
          </div>
          <div>
            <button className="btn btn-success btn-outline-black" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="col-md-3 ps-2 my-1">
        <form className="d-flex" role="submit" onSubmit={offerSubmit}>
          <div className="mb-2 w-100">
            <input
              className="form-control"
              type="number"
              name="offer"
              value={offer}
              placeholder="Write offer percentage"
              onChange={(e) => setOffer(e.target.value)}
            />
          </div>
          <div>
            <button className="btn btn-success btn-outline-black" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferInput;
