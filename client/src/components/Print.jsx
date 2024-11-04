// /* eslint-disable*/

import React from 'react';
import PriceFormat from '../Helper/PriceFormat';

const Print = ({ printItem }, ref) => {
  return (
    <div ref={ref} className={printItem ? "mt-5 px-5" : "d-none"}>
      <div className="row">
        <div className=" text-center mb-4">
          <h3> MAINUL ECOM DEMO</h3>
          <p>Delduar, Tangail, Dhaka, Bangladesh</p>
          <p>email: mainuldemo@gmail.com</p>
          <p>Phone: 01743914780</p>
        </div>
        <div className="col-6">
          <h3>INVOICE</h3>
        </div>
        <div className="col-6">
          <p>Invoice No. {printItem?._id} </p>
          <p>
            Payment Method.{" "}
            {printItem?.payment?.bkashNo ? "Bkash" : "SSL COMMERZ"} (
            {printItem?.payment?.bkashNo})
          </p>
          <p>Incoice Date: {new Date().toLocaleDateString()} </p>
        </div>
      </div>

      <hr />
      <div className="row">
        <div className="col-6">
          <h4>Shipping Information</h4>
          <h6>Name: {printItem?.user?.name} </h6>
          <p>Phone: {printItem?.user?.phone} </p>
          <p>Email: {printItem?.user?.email} </p>
          <p>Address: {printItem?.user?.address} </p>
        </div>
        {/* <div className="col-6">
          <h4>Billing Information</h4>
          <h6>
            Payment Type: {printItem?.payment?.payment_method?.type} (
            {printItem?.payment?.payment_method?.card?.brand}){" "}
          </h6>
          <h6>
            Name: {printItem?.payment?.payment_method?.billing_details?.name}{" "}
          </h6>
          <p>
            Email: {printItem?.payment?.payment_method?.billing_details?.email}{" "}
          </p>
          <p>
            Phone: {printItem?.payment?.payment_method?.billing_details?.phone}{" "}
          </p>
          <p>
            Address:{" "}
            {JSON.stringify(
              printItem?.payment?.payment_method?.billing_details?.address
            )}{" "}
          </p>
        </div> */}
      </div>
      <hr />
      <div className="row">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Sub-Total</th>
            </tr>
          </thead>

          <tbody>
            {printItem &&
              printItem?.products.map((item, i) => {
                return (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      {
                        <PriceFormat
                          price={item.price - (item.price * item?.offer) / 100}
                        />
                      }
                    </td>
                    <td>{item.amount}</td>
                    <td>
                      {
                        <PriceFormat
                          price={
                            (item?.price - (item?.price * item?.offer) / 100) *
                            item.amount
                          }
                        />
                      }
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className=" d-flex justify-content-end pe-5">
          <h4>Total Price: {<PriceFormat price={printItem.total} />}</h4>
        </div>
      </div>
    </div>
  );
};

const forwardPrint= React.forwardRef(Print)
export default forwardPrint;