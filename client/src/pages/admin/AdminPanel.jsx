import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "./AdminMenu";
import { toast } from 'react-toastify';
import PriceFormat from "../../Helper/PriceFormat";
// import TopProdChart from "../../components/topProdChart";
import DateChart from "../../components/DateChart";
import TopSellingChart from "../../components/TopSellingChart";

const AdminPanel = () => {
  let [endDate, setEndDate] = useState(new Date());
  let stDate = new Date(new Date(endDate) - 30 * 24 * 3600000);
  let [startDate, setStartDate] = useState(new Date(stDate));
  let { Axios } = useAuth();
  let [loading, setLoading] = useState(false);
  let [totalSale, setTotalSale] = useState('');
  let [totalSaleToday, setTotalSaleToday] = useState('');
  let [topProds, setTopProds] = useState([]);
  let [dateTotal, setDateTotal] = useState([]);
  let [timeDiff, setTimeDiff] = useState({days:'', hrs:'', mins:''});
  
  let seconds = Math.floor((new Date(endDate) - new Date(startDate)) / 1000);

  let timeConvert = (seconds) => {
    let days = Math.floor(seconds / 86400)
    let hrs = Math.floor((seconds % 86400)/3600)
    let mins = Math.floor((seconds % 3600)/60)
    setTimeDiff({days, hrs, mins})
  }
   useEffect(() => {
     timeConvert(seconds);
   }, [seconds]);

  //==================================
  let submitted = async (e) => {
    e && e.preventDefault()
    try {
      setLoading(true);
      let { data } = await Axios.get(`/admin/total-sale`, {
        params: {
          startDate,
          endDate,
        },
      });
      setLoading(false);
      if (data.success) {
        setTotalSaleToday(data.totalSaleToday)
        setTotalSale(data.totalSale);
        setTopProds(data.topProds)
        setDateTotal(data.dateTotal);
      } else {
        setTotalSale(data.totalSale);
        toast.error(data.msg)
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    submitted()
  }, [])
  

  return (
    <Layout title={"Admin panel"}>
      <div className={loading ? "dim" : ""}>
        <div className="row ">
          <div className="col-md-3 p-2">
              <AdminMenu />
          </div>
          <div className=" col-md-9 p-2 row">
            <p className=" text-center fs-2 fw-bold">
              <span>Statistic of last</span>{" "}
              <span className={timeDiff?.days ? "" : "d-none"}>
                {timeDiff?.days} days{" "}
              </span>{" "}
              <span className={timeDiff?.hrs ? "" : "d-none"}>
                {timeDiff?.hrs} hours{" "}
              </span>{" "}
              <span className={timeDiff?.mins ? "" : "d-none"}>
                {timeDiff.mins} minutes{" "}
              </span>{" "}
            </p>
            <div className=" p-2 col-md-6 border mt-2">
              <div>
                <form onSubmit={submitted} className=" w-100">
                  <label htmlFor="sdate" className=" fw-bold">
                    Start Date
                    <input
                      id="sdate"
                      className=" mb-3 form-control"
                      onChange={(e) => setStartDate(e.target.value)}
                      // type="date"
                      type="datetime-local"
                    />
                  </label>
                  <label htmlFor="edate" className=" fw-bold">
                    End Date
                    <input
                      id="edate"
                      className=" mb-3 form-control"
                      onChange={(e) => setEndDate(e.target.value)}
                      // type="date"
                      type="datetime-local"
                    />
                  </label>

                  <button
                    className="btn btn-success d-block mb-2"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div>
                <h4>Total Sale: {<PriceFormat price={totalSale} />} </h4>
                <h4 className="text-success">
                  Todays Sale: {<PriceFormat price={totalSaleToday} />}{" "}
                </h4>
              </div>
            </div>
            <div className="p-2 col-md-6 border mt-2">
              <h4>Top {topProds?.length} selling products </h4>
              <TopSellingChart topProds={topProds} />
            </div>
            <div className="col-12 border">
              <DateChart dateTotal={dateTotal} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
