const express = require("express");
const loginMiddleware = require("../middleware/loginMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const productControlls = require("../controllers/productControlls");
const upload = require("../middleware/multerMiddleware");

const router = express.Router();

router.post('/create-product', loginMiddleware, adminMiddleware, upload.array('picture', 10), productControlls.createProduct)
// router.post('/create-product', loginMiddleware, adminMiddleware, upload.single('picture'), productControlls.createProduct)

// router.get("/product-list", productControlls.productList);
router.post("/category/:slug", productControlls.productByCategory);
router.post("/product-filter", productControlls.productFilter);

router.get("/more-info/:pid", productControlls.moreInfo);
//=============product list

router.get("/product-list-limit", productControlls.productList);
router.get("/offers", productControlls.offerProductList);
//search
router.post("/search", productControlls.productSearch);
//simila products
router.get("/search/similar/:pid/:cid", productControlls.similarProducts);

router.post('/update-product/:pid', loginMiddleware, adminMiddleware, upload.array('picture',20), productControlls.updateProduct)

router.delete('/delete-product/:pid', loginMiddleware, adminMiddleware, productControlls.deleteProduct)
router.post('/review', productControlls.reviewProduct)
router.post('/rating', productControlls.ratingProduct)
router.get("/getreview/:pid", productControlls.getReview);
router.post("/cart-update", productControlls.getCartUpdate);


// ============== checkout ========================================

//======= for ssl==========
router.post("/order/checkout", loginMiddleware, productControlls.orderCheckout);
router.post("/payment/success/:trxn_id",productControlls.orderSuccessSSL);
router.post("/payment/fail/:trxn_id", productControlls.orderFailSSL);
router.get("/order/query-ssl", productControlls.sslQuery);
router.get("/order/search-ssl", productControlls.sslSearch);
router.get("/order/refund-ssl", productControlls.sslRefund);
//===============for stripe
// router.post("/order/checkout", loginMiddleware, productControlls.orderCheckout);
// router.get("/payment/success/:trxn_id",productControlls.orderSuccess);
// router.get("/payment/fail/:trxn_id", productControlls.orderFail);

//================= for bkash
router.post("/order/checkout-bkash", loginMiddleware, productControlls.orderCheckoutBkash);
router.get("/order/bkash-callback", productControlls.bkashCallback);
router.post("/order/refund-bkash", productControlls.bkashRefund);
router.get("/order/search-bkash", productControlls.bkashSearch);
router.get("/order/query-bkash", productControlls.bkashQuery);
router.get("/payment/success/:payment_id/:trxn_id/:bkashNo",productControlls.orderSuccessBkash);
router.get("/payment/fail/:payment_id", productControlls.orderFailBkash);






module.exports=router