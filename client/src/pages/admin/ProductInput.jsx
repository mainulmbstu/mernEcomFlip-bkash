import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Layout from "../../components/Layout";

const ProductInput = ({ getProducts }) => {
  let [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offer: "",
    quantity: "",
    picture: '',
  });

  let { token, catPlain } = useAuth();
  let inputHandle = (e) => {
    let { name, value } = e.target;
    setInputVal((prev) => ({ ...prev, [name]: value }));
  };

  //=================================================
  let productSubmit = async (e) => {
    e.preventDefault();

    let formdata = new FormData();

    inputVal.picture.length && inputVal.picture.map((item) => formdata.append("picture", item));

    formdata.append("name", inputVal.name);
    formdata.append("description", inputVal.description);
    formdata.append("category", inputVal.category);
    formdata.append("price", inputVal.price);
    formdata.append("offer", inputVal.offer);
    formdata.append("quantity", inputVal.quantity);
    try {
      setLoading(true);

      let { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/create-product`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      if (data.success) {
        toast.success(data.msg);
        setInputVal({
          name: "",
          description: "",
          category: inputVal.category,
          price: "",
          offer: "",
          quantity: "",
          picture: inputVal.picture,
        });
        setLoading(false);
        // window.location.reload();
        getProducts()
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
       toast.error(error.response.data);
      console.log({ msg: "error from create product", error });
    }
  };
  //============= singole imsge============
  // let productSubmit = async (e) => {
  //   e.preventDefault();

  //   let formdata = new FormData();
  //   formdata.append("picture", inputVal.picture, inputVal.picture?.name);
  //   formdata.append("name", inputVal.name);
  //   formdata.append("description", inputVal.description);
  //   formdata.append("category", inputVal.category);
  //   formdata.append("price", inputVal.price);
  //   formdata.append("quantity", inputVal.quantity);
  //   formdata.append("shipping", inputVal.shipping);
  //   try {
  //     setLoading(true);

  //     let { data } = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/products/create-product`,
  //       formdata,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setLoading(false);
  //     if (data.success) {
  //       toast.success(data.msg);
  //       setInputVal({
  //         name: "",
  //         description: "",
  //         category: inputVal.category,
  //         price: "",
  //         quantity: "",
  //         picture: inputVal.picture,
  //         shipping: 0,
  //       });
  //       setLoading(false);
  //       // window.location.reload();
  //       getProducts()
  //     } else {
  //       toast.error(data.msg);
  //     }
  //   } catch (error) {
  //     alert("error from product create, refresh, check file type and size");
  //     console.log({ msg: "error from create product", error });
  //   }
  // };

  //=============================================================
  return (
    <Layout title={"Create product"}>
      <div className="row  ">
        {/* <div className="col-md-3 p-2">
        <div className="card p-2">
          <AdminMenu />
        </div>
      </div> */}
        <div className=" p-2">
          <div className="card p-2">
            <div className=" border">
              <form
                onSubmit={productSubmit}
                className="px-4"
                encType="multipart/form-data"
              >
                <input
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="text"
                  name="name"
                  value={inputVal.name}
                  placeholder="Enter product name"
                />

                {/* <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="category">
                  Category
                </label>
                <select
                  name="category"
                  className="form-select"
                  id="category"
                  onChange={(e) => {
                    return setInputVal((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                >
                  <option defaultValue={''} >Choose...</option>
                  {category.map((item) => {
                    return (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>  */}

                <div className="mb-2">
                  <input
                    className="form-control"
                    list="categoryList"
                    type={"text"}
                    placeholder="Select category"
                    onChange={(e) => {
                      let cat =
                        catPlain?.length &&
                        catPlain.find((item) => item?.slug === e.target.value);
                      setInputVal((prev) => ({
                        ...prev,
                        category: cat?._id,
                      }));
                    }}
                  />
                  <datalist id="categoryList">
                    {catPlain?.length &&
                      catPlain.map((item) => {
                        return (
                          <option key={item._id} value={item?.slug}></option>
                        );
                      })}
                  </datalist>
                </div>

                <input
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="number"
                  name="price"
                  value={inputVal.price}
                  placeholder="Enter price"
                />
                <input
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="number"
                  name="offer"
                  value={inputVal.offer}
                  placeholder="Enter offer percent, default value 0"
                />

                <input
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="number"
                  name="quantity"
                  value={inputVal.quantity}
                  placeholder="Enter quantity"
                />

                <div>
                  <label htmlFor="pic" className="">
                    Upload product image (jpeg, jpg, png, webp, Max size- 4mb)
                  </label>
                  <input
                    className=" form-control mb-2"
                    id="pic"
                    type="file"
                    name="picture"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      inputHandle({
                        target: { name: "picture", value: [...e.target.files] },
                        // target: { name: "picture", value: e.target.files[0] },
                      });
                    }}
                  />
                </div>
                {/* <div className="mb-4 ms-2">
                  {inputVal.picture && (
                    <div>
                      <img
                        src={URL.createObjectURL(inputVal.picture)}
                        alt="image"
                        className="img img-responsive"
                        height={"100px"}
                      />
                    </div>
                  )}
                </div> */}

                <textarea
                  onChange={inputHandle}
                  className=" form-control mb-2"
                  type="text"
                  rows="4"
                  name="description"
                  value={inputVal.description}
                  placeholder="Enter product description"
                />
                <div className=" d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn  btn-danger text-white fs-5 w-25 ms-2 btn-outline-dark"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>

                  {loading ? (
                    <>
                      <button
                        className="btn btn-primary w-50 fs-5 ms-2"
                        type="button"
                        disabled
                      >
                        <span
                          className="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Uploadin data...
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className=" btn  btn-primary text-white fs-5 w-50 ms-2 btn-outline-dark"
                        type="submit"
                      >
                        Create Product
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductInput;
