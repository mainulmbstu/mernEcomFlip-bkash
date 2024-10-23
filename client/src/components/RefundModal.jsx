import React from 'react'

const RefundModal = ({ value }) => {

 let { refundItem, refundBkash } = value

  return (
    <div>
      <div>
        <div>
          {/* Button trigger modal */}

          {/* <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#refund" 
          >
            Launch demo modal
          </button> */}

          {/* Modal */}
        </div>
        <div
          className="modal fade"
          id="refund"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Refund confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <h5>Order ID: {refundItem?._id} </h5>
                <h5>TRXN ID: {refundItem?.payment?.trxn_id} </h5>
                <h4>Amount: BDT {refundItem?.total} </h4>
              </div>
              <div className="modal-footer d-flex justify-content-evenly">
                <button
                  type="button"
                  className="btn btn-secondary w-25"
                  data-bs-dismiss="modal"
                >
                  NO
                </button>
                <button
                  onClick={() => refundBkash(refundItem)}
                  type="button"
                  className="btn btn-primary w-25"
                  data-bs-dismiss="modal"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundModal