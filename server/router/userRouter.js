const express = require("express");
const userControlls = require("../controllers/userControlls");
const loginMiddleware = require("../middleware/loginMiddleware");
const localVariable = require("../middleware/LocalVariable");


const router = express.Router();

router.get("/", userControlls.home);
router.post("/getotp",localVariable, userControlls.getOTP);
router.post("/register", userControlls.register);
router.post("/login", userControlls.login);
router.get("/user", loginMiddleware, userControlls.loggedUser);
router.post("/user/update", loginMiddleware, userControlls.userUpdate);
router.get("/user/orders", loginMiddleware, userControlls.userOrders);
router.get("/gallery", userControlls.gallery);
router.post("/contact", userControlls.contact);
router.get("/get-contacts",loginMiddleware, userControlls.getContacts);
//=================== forgot password
router.post("/userVerified", localVariable, userControlls.userVerified);
router.post("/OTPVerified/:email", userControlls.OTPVerified);
router.post("/reset-new-password/:email", userControlls.ResetNewPassword);



// user authentication (for Private.jsx)
router.get("/userAuth", loginMiddleware, (req, res) => {
    res.status(200).send({ok:true})
});



module.exports = router;



