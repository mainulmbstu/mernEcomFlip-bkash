import { Link } from "react-router-dom";
import Layout from "./Layout";

const PaymentSuccess = () => {
  return (
    <Layout title={'Payment success'}>
      <div className=" text-center mt-5 bg-success col-md-6 mx-auto p-4 text-white">
        <h3> Payment successful</h3>
        <h4>Your order has been placed successfully</h4>
        <Link className=" bg-white px-3" to={"/dashboard/user/orders"}>
          Click to see you order
        </Link>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
