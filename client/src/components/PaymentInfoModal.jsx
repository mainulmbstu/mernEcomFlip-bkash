import React from "react";

const PaymentInfoModal = ({ paymentInfo }) => {
    let text=[]
    let info = () => {
        for (let k in paymentInfo) {
            text.push(<p key={k.trxID}> {k} : {paymentInfo[k]} </p>)
        }
        return text
    }
    
  return (
    <div className={""}>
      <div
        className="modal fade"
        id="paymentAll"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Payment Information
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
                      <div className="modal-body">
                          {
                          
                           info()
                             
                      }
                      </div>
            <div className="modal-footer d-flex justify-content-evenly"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoModal;
