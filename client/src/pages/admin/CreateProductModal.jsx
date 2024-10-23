import ProductInput from "./ProductInput";

const CreateProductModal = ({ getProducts }) => {
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
          id="createProduct"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create new product
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <ProductInput getProducts={getProducts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
