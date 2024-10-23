import ProductUpdateInput from "./ProductUpdateInput";

const UpdateProductModal = ({ value }) => {
  

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
          id="editProduct"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit product
                </h5>
                <button
                  onClick={()=>value.setEditProduct("")}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <ProductUpdateInput
                  value={value}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
