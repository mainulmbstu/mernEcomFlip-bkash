/* eslint-disable */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ContactReplyModal = ({ value }) => {
  let { replyItem, getAdminContacts, page, size, setReplyItem } = value;

  const [inputVal, setinputVal] = useState({
    msgId: replyItem?._id,
    email: replyItem?.email,
    reply: "",
  });


  useEffect(() => {
    setinputVal({
      email: replyItem?.email,
      msgId: replyItem?._id,
    });
  }, [replyItem]);
  
  let onInput = (e) => {
    let { name, value } = e.target;
    setinputVal((prev) => ({ ...prev, [name]: value }));
  };

  let { Axios } = useAuth();
  const [loading, setLoading] = useState(false);

  //=================================
  let submitted = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let { data } = await Axios.post("/admin/contact-reply", inputVal);
      setLoading(false);
      if (data.success) {
        toast.success(data.msg);
        setinputVal((prev) => ({ ...prev, reply: "" }));
        getAdminContacts(1, page * size);
        setReplyItem("");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log("error from review", error);
    }
  };

  return (
    <div className={loading ? "dim" : ""}>
      <div
        className="modal fade"
        id="contactReply"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Message reply
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
                  <label htmlFor="">To email</label>
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
                    name="reply"
                    value={inputVal.reply}
                    placeholder="Type your reply"
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

export default ContactReplyModal;
