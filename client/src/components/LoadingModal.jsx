
const LoadingModal = () => {
  return (
    <div>
      <div>
        <div>
          {/* Button trigger modal */}

          {/* <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#updateCategory"      // same with modal id
          >
            Launch demo modal
          </button> */}

          {/* Modal */}
        </div>
        <div
          className="modal fade"
          id="loadingModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Please wait
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className=" h-100 d-flex justify-content-center">
                  <div
                    className="spinner-border align-self-center"
                    style={{ width: "3rem", height: "3rem" }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
