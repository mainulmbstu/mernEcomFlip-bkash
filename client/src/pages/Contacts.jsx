import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import UserContacts from "./user/UserContacts";

const Contacts = () => {
  const [user, setUser] = useState({ name: "", email: "", message: "" });
  let onInput = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  let { userInfo, Axios } = useAuth();
  const [trix, setTrix] = useState(true);
  const [loading, setLoading] = useState(false)

  if (userInfo && trix) {
    setUser({ name: userInfo.name, email: userInfo.email, message: "" });
    setTrix(false);
  }
//==================================================
  let submitted = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);
      let { data } = await Axios.post(`/contact`, user);
      if (data.success) {
        toast.success(data.msg);
        setUser((prev) => ({ ...prev, message: "" }));
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
    <Layout title={"Contacts"}>
      <div className={loading?'dim':''}>
        <div className="row">
          <div className="col-md-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16941.195449050145!2d90.49198314750565!3d24.191606533985944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37567906d26718f7%3A0xc2b28acee7accb9!2sNourish%20Poultry%20%26%20Hatchery%20Ltd.!5e0!3m2!1sen!2sbd!4v1728467477481!5m2!1sen!2sbd"
              width={"100%"}
              height={350}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="col-md-4">
            <div className="px-4">
              <h2 className=" text-center">Contact us</h2>
              <div className=" d-flex justify-content-center">
                <form onSubmit={submitted} className=" w-100">
                  <input
                    className=" mb-3 form-control"
                    onChange={onInput}
                    type="text"
                    name="name"
                    value={user.name}
                    placeholder="Name"
                    required
                  />
                  <input
                    className=" mb-3 form-control"
                    onChange={onInput}
                    type="email"
                    name="email"
                    value={user.email}
                    placeholder="email"
                    required
                  />
                  <textarea
                    className=" mb-3 form-control"
                    rows="7"
                    onChange={onInput}
                    type="text"
                    name="message"
                    value={user.message}
                    placeholder="Type your message"
                  ></textarea>
                  <button className="btn btn-success w-100 mb-2" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div>
          <UserContacts/>
        </div>
      </div>
    </Layout>
  );
};

export default Contacts;
