import { MdStar } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const Rating = ({ ratingItem }) => {
  const [inputVal, setinputVal] = useState({
    pid: ratingItem._id,
    name: "",
    email: "",
    rating: "",
  });
    
  let onInput = (e) => {
    let { name, value } = e.target;
    setinputVal((prev) => ({ ...prev, [name]: value }));
  };

  let { userInfo, Axios } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setinputVal({
      name: userInfo.name,
      email: userInfo.email,
      pid: ratingItem._id,
    });
  }, [ratingItem]);
//================================================
  let submitted = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let { data } = await Axios.post("/products/rating", inputVal);
      setLoading(false);
      if (data.success) {
        toast.success(data.msg);
        setinputVal((prev) => ({ ...prev, rating: "" }));
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log("error from rating", error);
    }
  };

  return (
    <div className={loading ? "dim" : ""}>
      <div
        className="modal fade"
        id="rating"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Rate this product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
                <form onSubmit={submitted} className=" w-100">
                  <input
                    className=" mb-3 form-control"
                    onChange={onInput}
                    type="text"
                    name="name"
                    value={inputVal.name}
                    placeholder="Name"
                    required
                  />
                  <input
                    className=" mb-3 form-control"
                    onChange={onInput}
                    type="email"
                    name="email"
                    value={inputVal.email}
                    placeholder="email (optional)"
                  />
                  <div className=" mb-4">
                    {Array.from({ length: 5 }, (v, i) => i + 1).map((num) => {
                      return (
                        <MdStar
                          key={num}
                          className={`rating fs-2 ${inputVal.rating>= num? 'text-danger':''}`}
                          onClick={() =>
                            setinputVal({ ...inputVal, rating: num })
                          }
                        />
                      );
                    })}
                  </div>
                  <button
                    data-bs-dismiss="modal"
                    className="btn btn-success w-100"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-evenly"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
