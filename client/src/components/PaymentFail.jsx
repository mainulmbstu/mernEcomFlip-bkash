import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const PaymentFail = () => {
  return (
    <Layout title={'Payment fail'}>
      <div className=" text-center mt-5 bg-danger col-md-6 mx-auto p-4 text-white">
        <h2> Sorry payment failed</h2>
        <h4>Your order has been canceled</h4>
        <Link className=" text-white fs-4" to={"/cart"}>
          Try again
        </Link>
      </div>
    </Layout>
  );
};

export default PaymentFail;
