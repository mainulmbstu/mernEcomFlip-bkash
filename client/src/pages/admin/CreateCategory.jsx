import AdminMenu from "./AdminMenu";
import UpdateCategory from "./UpdateCategory";
import { useAuth } from "../../context/AuthContext";
import CategoryTable from "../../components/CategoryTable";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import DeleteModal from "../../components/DeleteModal";
import Layout from "../../components/Layout";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";

const CreateCategory = () => {
  let { category, token, getCategory, catPlain, setcatPlain } = useAuth();
  const [updateItem, setUpdateItem] = useState("");

  //============================================================
  const [delItem, setDelItem] = useState("");
  let [loading, setLoading] = useState(false);

  let deleteCategory = async (id) => {
    if (delItem?.children?.length > 0)
      return alert("A parent category cannot be deleted with child");
    try {
      setLoading(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/category/delete-category/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      let data = await res.json();
      if (res.ok) {
        getCategory();
        toast.success(`${delItem?.name} is deleted successfully`);
      } else {
        toast.success(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log('error from delete category', error);
    }
  };
  //====================================================================

  let getCategoryList = (category) => {
    let myCategories = [];
    if (category.length) {
      for (let v of category) {
        myCategories.push(
          <li key={v.slug}>
            {v.name}
            {v.children.length > 0 ? (
              <ul>{getCategoryList(v.children)} </ul>
            ) : null}
          </li>
        );
      }
    }
    return myCategories;
    // setcatTree(myCategories)
  };

  useEffect(() => {
    getCategoryList(category);
  }, []);

  let [searchVal, setSearchVal] = useState("");

  //========================================================
  let getSearchAdminCat = async (e) => {
    e && e.preventDefault();
    try {
      // if (!searchVal) return;
      setLoading(true);
      let { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/category/category-search`,
        {
          params: {
            keyword: searchVal,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      setcatPlain(data?.searchCat)
      setSearchVal('')
    } catch (error) {
      console.log(error);
    }
  };

  

  // console.log(getPlainCatList(category));
  //=========================================
  //========================================================
  return (
    <Layout title={"category"}>
      <div className={loading ? "dim" : ""}>
        <div className="row ">
          <div className="col-md-3 p-2">
              <AdminMenu />
            <div className="fs-5 mt-3  myCat">
              <h3>Category</h3>
              {getCategoryList(category)}
            </div>
          </div>
          <div className=" col-md-9 p-2">
            <div className=" card p-2">
              <div className="row">
                <div className="col-md-6">
                  <CategoryTable value={{ catPlain, loading, setLoading }} />
                </div>
                <div className=" col-md-6 d-flex">
                  <div className=" mt-auto ms-5 mb-3 border w-100">
                    <form
                      className="d-flex"
                      role="search"
                      onSubmit={getSearchAdminCat}
                    >
                      <input
                        className="form-control me-2 w-100"
                        type="search"
                        placeholder="search by category name"
                        aria-label="Search"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                      />
                      <button
                        className="btn btn-success btn-outline-black"
                        type="submit"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <h3>Category List ({category?.length && catPlain?.length})</h3>
                <div className=" border">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">SL</th>
                        <th scope="col">image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th>
                        <th scope="col">Updated Time</th>
                      </tr>
                    </thead>
                    <tbody className=" text-capitalize">
                      {category?.length &&
                        catPlain.map((cat, index) => {
                          return (
                            <tr key={cat._id}>
                              <td>{index + 1}</td>
                              <td>
                                <LazyLoadImage
                                  src={
                                    cat.picture
                                      ? `${import.meta.env.VITE_BASE_URL}/${
                                          cat.picture
                                        }`
                                      : `/placeholder.jpg`
                                  }
                                  // `${import.meta.env.VITE_BASE_URL}/${cat.picture }`
                                  alt="image"
                                  width={40}
                                  height={40}
                                />
                              </td>
                              <td>{cat.name}</td>
                              <td>
                                <button
                                  onClick={() => setUpdateItem(cat)}
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#updateCategory"
                                >
                                  Update
                                </button>
                              </td>
                              <td>
                                <button
                                  onClick={() => setDelItem(cat)}
                                  type="button"
                                  className="btn btn-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteCategory"
                                >
                                  Delete
                                </button>
                              </td>

                              <td>
                                {new Date(cat.updatedAt).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <UpdateCategory
                    value={{
                      updateItem,
                      setUpdateItem,
                      catPlain,
                      loading,
                      setLoading,
                    }}
                  />
                </div>
                <DeleteModal value={{ func: deleteCategory, item: delItem }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
