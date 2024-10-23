import axios from "axios";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Gallery = () => {
  let [gallery, setGallery] = useState([]);
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let { userInfo, token } = useAuth();
  const [inputVal, setInputVal] = useState([]);

//=============================================
  let getGallery = async () => {
    page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/gallery`,
        {
          method:'GET'
          // params: {
          //   page: page,
          //   size: 8,
          // },
        }
      );
      if (res.ok) {
        let data = await res.json();
        setTotal(data.total);
        // setPage(page + 1);
          setGallery(data.images);
      }
      
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGallery();
  }, []);
//===============================================
 let submitHandle = async (e) => {
   e.preventDefault();
   if (inputVal.length === 0) return alert("select file");
   let formdata = new FormData();
   inputVal.length && inputVal.map((item) => formdata.append("picture", item));
   try {
     setLoading(true);

     let { data } = await axios.post(
       `${import.meta.env.VITE_BASE_URL}/admin/gallery`,
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
       //  window.location.reload();
       getGallery()
     } else {
       toast.error(data.msg);
     }
   } catch (error) {
     alert("error from gallery create, refresh, check file type and size")
     console.log({ msg: "error from create gallery", error });
   }
 };

  return (
    <Layout title="Gallery">
     <div className={loading && 'dim'}>
        {userInfo?.role && (
          <div className="px-2 my-4">
            <form onSubmit={submitHandle}>
              <label htmlFor="pic" className="">
                Upload gallery image (jpeg, jpg, png, webp, Max size- 4mb)
              </label>
              <input
                className=" form-control mb-2"
                id="pic"
                type="file"
                name="picture"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setInputVal([...e.target.files]);
                }}
              />
              <div className="">
                {loading ? (
                  <>
                    <button
                      className="btn btn-primary fs-5"
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
                      className=" btn  btn-primary text-white fs-5 btn-outline-dark"
                      type="submit"
                    >
                      Upload Image
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        )}
        <InfiniteScroll
          dataLength={gallery?.length}
          next={getGallery}
          hasMore={gallery[0]?.picture?.length < total}
          loader={<h1>Loading...</h1>}
          endMessage={<h4 className=" text-center">All items loaded</h4>}
        >
          <div className="row mx-2">
            {gallery.length &&
              gallery[0]?.picture?.reverse().map((item, index) => {
                return (
                  <div key={index} className="col-md-3 border text-center p-2">
                    <LazyLoadImage
                      src={`${import.meta.env.VITE_BASE_URL}/${item}`}
                      alt="image"
                      width={"100%"}
                      height={300}
                    />
                  </div>
                );
              })}
          </div>
        </InfiniteScroll>
     </div>
    </Layout>
  );
};

export default Gallery;
