import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';



const Review = ({ reviewItem }) => {
      const [inputVal, setinputVal] = useState({pid:'', name: "", email: "", review: "" });
      let onInput = (e) => {
        let { name, value } = e.target;
        setinputVal((prev) => ({ ...prev, [name]: value }));
      };
let { userInfo, Axios } = useAuth();
const [loading, setLoading] = useState(false);
    
    useEffect(() => {
     setinputVal({
       name:  userInfo.name || '',
       email: userInfo.email || '',
       pid: reviewItem._id,
       review:''
     });
    }, [reviewItem])
    


 let submitted = async (e) => {
   e.preventDefault();
   try {
     setLoading(true);
     let {data} = await Axios.post("/products/review",inputVal);
       setLoading(false);
     if (data.success) {
       toast.success(data.msg);
       setinputVal((prev) => ({ ...prev, review: "" }));
     } else {
       toast.error(data.msg);
     }
   } catch (error) {
     setLoading(false);
     console.log("error from review", error);
   }
 };


  return (
    <div className={loading?'dim':''}>
      <div
        className="modal fade"
        id="review"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Review this product
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
                    placeholder="email (Optional)"
                  />
                  <textarea
                    className=" mb-3 form-control"
                    rows="7"
                    onChange={onInput}
                    type="text"
                    name="review"
                    value={inputVal.review}
                    placeholder="Type your review"
                  ></textarea>
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

export default Review