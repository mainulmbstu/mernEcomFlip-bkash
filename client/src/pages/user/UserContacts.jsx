import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import UserMenu from "./UserMenu";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";

const UserContacts = () => {
  let [contacts, setContacts] = useState([]);
  let { Axios } = useAuth();

  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  let [total, setTotal] = useState(0);
  let [replyItem, setReplyItem] = useState("");

  let size = 7;
  //==================================
  let getAdminContacts = async (page = 1, size) => {
    // page === 1 && window.scrollTo(0, 0);
    try {
      setLoading(true);
      let { data } = await Axios.get(`/get-contacts`, {
        params: {
          page,
          size,
        },
      });
      setTotal(data.total);
      page === 1 || replyItem
        ? setContacts(data.contacts)
        : setContacts([...contacts, ...data.contacts]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminContacts(page, size);
  }, []);

  let unread = contacts.filter((item) => item?.replies?.length === 0);

  return (
    <Layout title={"user contacts"}>
      <div className={loading ? "dim" : ""}>
        <div className="row ">
          <div className="  p-2">
            <h4>Message history</h4>
            <InfiniteScroll
              dataLength={contacts?.length}
              next={() => {
                setPage(page + 1);
                getAdminContacts(page + 1, size);
              }}
              hasMore={contacts?.length < total}
              loader={<h1>Loading...</h1>}
              endMessage={<h4 className=" text-center">All items loaded</h4>}
            >
              {contacts?.length &&
                contacts.map((item, i) => {
                  return (
                    <div
                      key={item._id}
                      className={` border border-2 p-2 px-3 ${
                        i % 2 ? "bg-light" : "bg-white"
                      }`}
                    >
                      <p>
                        <b>You:</b> ({moment(item?.createdAt).fromNow()},
                        {new Date(item?.createdAt).toLocaleString()})
                      </p>
                      <p>Message: {item.message} </p>
                      <p>
                        Time: ({moment(item?.createdAt).fromNow()},
                        {new Date(item?.createdAt).toLocaleString()})
                      </p>

                      <hr className=" w-25" />
                      <h5>
                        {item?.replies?.length ? "An Admin" : "No reply yet"}
                      </h5>
                      {item?.replies &&
                        item?.replies?.reverse().map((rep, i, arr) => {
                          return (
                            <div key={i}>
                              <p className=" fw-bold">
                                Reply-{arr?.length - i}: {rep.msg}
                              </p>
                              <p>
                                Time: {moment(rep?.date).fromNow()},
                                {new Date(rep?.date).toLocaleString()}{" "}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserContacts;
