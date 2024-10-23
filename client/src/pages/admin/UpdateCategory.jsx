import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const UpdateCategory = ({ value }) => {
  const [inputVal, setInputVal] = useState({
    name: "",
    parentId: "",
    picture: "",
  });
  // eslint-disable-next-line react/prop-types
  let { updateItem, setUpdateItem, catPlain, loading, setLoading } = value;

  const [trix, setTrix] = useState(true);
  let { token, getCategory } = useAuth();


 

  // eslint-disable-next-line react/prop-types
  if (updateItem?.name && trix) {
    setInputVal({
      name:'',
      parentId: updateItem?.parentId || undefined,
      picture: "",
    });
    setTrix(false);
  }

  let inputHandle = (e) => {
    let { name, value } = e.target;
    setInputVal((prev) => ({ ...prev, [name]: value }));
  };

let parentRef = useRef()
  //==================================================
  let handleUpdate = async (e) => {
    
    e.preventDefault();
    if (updateItem._id === inputVal.parentId) {
      return alert('Category and parent category cannot be same')
    }

    let formdata = new FormData();
    formdata.append("picture", inputVal?.picture);
    formdata.append("name", inputVal.name);
    formdata.append("parentId", inputVal.parentId);
    try {
      setLoading(true);

      let { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/category/update-category/${
          updateItem?._id}`,
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
        parentRef.current.value=''
        setInputVal({ name: "", parentId: "" });
        getCategory();
        setUpdateItem("");
        setTrix(true);

      } else {
        toast.error(data.msg);
      }

      // e.preventDefault();
      // try {
      //   let res = await fetch(
      //     `${import.meta.env.VITE_BASE_URL}/category/update-category/${
      //       updateItem?._id
      //     }`,
      //     {
      //       method: "PATCH",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${token}`,
      //       },
      //       body: JSON.stringify(inputVal),
      //     }
      //   );

      //   let data = await res.json();
      //   if (res.ok) {
      //     toast.success(data.msg);
      //     setInputVal({ name: "" });
      //     getCategory();
      //     setUpdateItem("");
      //     setTrix(true);
      //   } else {
      //     toast.error(data.msg);
      //   }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
      console.log({ msg: "error from update category", error });
    }
  };

   let updateParent = catPlain?.filter(
     (item) => item._id === inputVal.parentId
   );
  // console.log(value?.getPlainCatList(category))

  return (
    <Layout title={"Category list"}>
      <div>
        <div>
          <div>
            {/* Button trigger modal */}

            {/* <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#updateCategory"
          >
            Launch demo modal
          </button> */}

            {/* Modal */}
          </div>
          <div
            className="modal fade"
            id="updateCategory"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Edite category
                  </h5>
                  <button
                    onClick={() => {
                      setUpdateItem("");
                      setTrix(true);
                    }}
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  <form onSubmit={handleUpdate} className="">
                    <label className="ms-3" htmlFor="">
                      Category
                    </label>
                    <input
                      onChange={inputHandle}
                      className=" form-control m-2"
                      type="text"
                      name="name"
                      value={inputVal?.name}
                      placeholder={updateItem?.name}
                    />

                    <div className="mb-2">
                      <label className="ms-2" htmlFor="">
                        Parent Category
                      </label>
                      <input
                        ref={parentRef}
                        className="form-control"
                        // value={updateParent[0]?.name}
                        list="categoryList"
                        type={"text"}
                        placeholder={
                          updateParent[0]?.name || "It is a top parent"
                        }
                        onChange={(e) => {
                          let cat =
                            catPlain.length &&
                            catPlain?.filter(
                              (item) => item.slug === e.target.value
                            );
                          setInputVal((prev) => ({
                            ...prev,
                            parentId: cat[0]?._id,
                          }));
                        }}
                      />

                      <datalist id="categoryList">
                        {/* <option value={'none'}>none</option> */}
                        {catPlain?.length &&
                          catPlain?.map((item) => {
                            return (
                              <option
                                key={item.slug}
                                value={item.slug}
                              ></option>
                            );
                          })}
                      </datalist>
                    </div>

                    <div>
                      <label htmlFor="pic" className="btn">
                        Upload category image
                      </label>
                      <input
                        className=" form-control mb-2"
                        id="pic"
                        type="file"
                        name="picture"
                        accept="image/*"
                        onChange={(e) => {
                          inputHandle({
                            // target: {
                            //   name: "picture",
                            //   value: [...e.target.files],
                            // },
                            target: {
                              name: "picture",
                              value: e.target.files[0],
                            },
                          });
                        }}
                      />
                    </div>

                    <div className="mb-4 ms-2 d-flex justify-content-evenly">
                      {inputVal.picture && (
                        <div>
                          <p>New uploaded</p>
                          <img
                            src={URL.createObjectURL(inputVal?.picture)}
                            alt="image"
                            className="img img-responsive"
                            height={"100px"}
                          />
                        </div>
                      )}

                      <div>
                        <p>Current Image</p>
                        <img
                          // eslint-disable-next-line react/prop-types
                          src={
                            value?.updateItem?.picture &&
                            `${import.meta.env.VITE_BASE_URL}/${
                              value?.updateItem?.picture
                            }`
                          }
                          alt="image"
                          className="img img-responsive"
                          height={"100px"}
                        />
                      </div>
                    </div>

                    <button
                      className=" btn btn-primary text-white fs-5 w-50 ms-2 btn-outline-success"
                      type="submit"
                      data-bs-dismiss="modal"
                    >
                      Update Category
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateCategory;
