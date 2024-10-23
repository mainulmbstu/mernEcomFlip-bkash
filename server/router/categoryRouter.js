const express = require("express");
const loginMiddleware = require("../middleware/loginMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const categoryControlls = require("../controllers/categoryControlls");
const upload = require("../middleware/multerMiddleware");


const router = express.Router();

router.post('/create-category', loginMiddleware, adminMiddleware,upload.single('picture'), categoryControlls.createCategory)

router.post('/update-category/:id', loginMiddleware, adminMiddleware, upload.single('picture'), categoryControlls.updateCategory)

router.delete('/delete-category/:id', loginMiddleware, adminMiddleware, categoryControlls.deleteCategory)

router.get('/category-list', categoryControlls.categoryList)
router.get("/category-search", categoryControlls.getSearchCategory);

router.get("/single-category/:slug", categoryControlls.singleCategory);




module.exports=router