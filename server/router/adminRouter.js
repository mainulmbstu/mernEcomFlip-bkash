const express = require("express");
const loginMiddleware = require("../middleware/loginMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminControlls = require("../controllers/adminControlls");
const upload = require("../middleware/multerMiddleware");

const router = express.Router();

router.get('/user-list', loginMiddleware, adminMiddleware, adminControlls.userList  )
router.get('/contacts', loginMiddleware, adminMiddleware, adminControlls.adminContacts  )
router.post('/contact-reply', loginMiddleware, adminMiddleware, adminControlls.adminContactReply  )
router.get('/user-search', loginMiddleware, adminMiddleware, adminControlls.searchUser  )
router.post('/order-list', loginMiddleware, adminMiddleware, adminControlls.orderList  )
router.delete('/user/:id', loginMiddleware, adminMiddleware, adminControlls.deleteUser  )
router.post('/user/status/:id', loginMiddleware, adminMiddleware, adminControlls.userStatusUpdate  )
router.post('/order/status/:oid', loginMiddleware, adminMiddleware, adminControlls.orderStatusUpdate  )
router.get('/order-search', loginMiddleware, adminMiddleware, adminControlls.orderSearch  )
router.get('/product-list', loginMiddleware, adminMiddleware, adminControlls.adminProductList  )
router.get('/product-search', loginMiddleware, adminMiddleware, adminControlls.adminSearchProductList  )
router.post('/gallery', loginMiddleware, adminMiddleware, upload.array('picture', 100), adminControlls.gallery  )
router.get('/total-sale', loginMiddleware, adminMiddleware, adminControlls.totalSale  )
router.post('/offer', loginMiddleware, adminMiddleware,adminControlls.offer  )

// admin authentication (for Private.jsx)
router.get("/adminAuth", loginMiddleware, adminMiddleware, (req, res) => {
  res.status(200).send({ ok: true });
});




module.exports=router