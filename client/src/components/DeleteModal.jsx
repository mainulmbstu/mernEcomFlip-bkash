import React from "react";

const DeleteModal = ({ value }) => {
  

  return (
    <div>
      <div>
        <div>
          {/* Button trigger modal */}

          {/* <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#updateCategory" 
          >
            Launch demo modal
          </button> */}

          {/* Modal */}
        </div>
        <div
          className="modal fade"
          id="deleteCategory"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <h5>{`Do you want to delete ${value?.item?.name} ?`}</h5>
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
                  onClick={() => value.func(value?.item?._id)}
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

export default DeleteModal;
