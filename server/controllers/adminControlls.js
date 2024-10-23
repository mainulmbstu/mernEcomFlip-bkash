const UserModel = require("../models/userModel");
const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/productModel");
const GalleryModel = require("../models/GalleryModel");
const { ContactModel, ContactReplyModel } = require("../models/ContactModel");
const mailer = require("../helper/nodeMailer");
const { v4: uuidv4 } = require("uuid");

const {
  uploadOnCloudinary,
  deleteImageOnCloudinary,
} = require("../helper/cloudinary");
//====================================
const userList = async (req, res) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    let size = req.query.size ? req.query.size : 4;
    let skip = (page - 1) * size;
    const total = await UserModel.find({}).estimatedDocumentCount();

    const userList = await UserModel.find({}, { password: 0 })
      .skip(skip)
      .limit(size)
      .sort({ updatedAt: -1 });
    if (!userList || userList.length === 0) {
      return res.send({ msg: "No data found" });
    }
    res.status(200).send({ userList, total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error from user list", error });
  }
};
//===============================================================
const searchUser = async (req, res) => {
  try {
    const { keyword } = req.query;
    let page = req.query?.page ? req.query?.page : 1;
    let size = req.query?.size ? req.query?.size : 4;
    let skip = (page - 1) * size;
    const searchUser = await UserModel.find(
      {
        $or: [
          { email: { $regex: keyword, $options: "i" } },
          { phone: { $regex: keyword, $options: "i" } },
        ],
      },
      { password: 0 }
    )
      .skip(skip)
      .limit(size);
    res.status(200).send({
      msg: "got user from search",
      searchUser,
      total: searchUser.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from userSearch", error });
  }
};
//======================================================================

let deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    await UserModel.findByIdAndDelete(id);
    if (!UserModel) {
      return res.status(400).send({ msg: "No data found" });
    }
    res.status(200).send({ msg: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from delete users", error });
  }
};
//======================================================
let userStatusUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    let { role } = req.body;
    await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    if (!UserModel) {
      return res.status(400).send({ msg: "No data found" });
    }
    res.status(200).send({ msg: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from update users", error });
  }
};
//========================================================

const orderList = async (req, res) => {
  try {
    let page = req.body.page ? req.body.page : 1;
    let size = req.body.size ? req.body.size : 4;
    let skip = (page - 1) * size;
    // let page = req.query.page ? req.query.page : 1;
    // let size = req.query.size ? req.query.size : 4;
    // let skip = (page - 1) * size;
    await OrderModel.deleteMany({ "payment.status": false });
    const total = await OrderModel.find({}).estimatedDocumentCount();
    const orderList = await OrderModel.find({})
      .populate("user", { password: 0 })
      .skip(skip)
      .limit(size)
      // .populate("products")
      // .populate({
      //   path: "products",
      //   populate: {
      //     path: "category",
      //   },
      // })
      .sort({ createdAt: -1 });

    if (!orderList || orderList.length === 0) {
      return res.status(403).send({ msg: "No data found", orderList, total });
    }
    res.status(200).send({ orderList, total });
  } catch (error) {
    res.status(500).json({ msg: "error from orderList", error });
  }
};

//======================================================
let orderStatusUpdate = async (req, res) => {
  try {
    let oid = req.params.oid;
    let { status } = req.body;
    let order = await OrderModel.findByIdAndUpdate(
      oid,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(400).send({ msg: "No data found" });
    }
    res.status(200).send({ msg: "order updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from update order", error });
  }
};
//=====================================================================
const adminProductList = async (req, res) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    let size = req.query.size ? req.query.size : 4;
    let skip = (page - 1) * size;

    const total = await ProductModel.find({}).estimatedDocumentCount();

    const products = await ProductModel.find({})
      .skip(skip)
      .limit(size)
      .populate("user", { password: 0 })
      .populate("category")
      .sort({ createdAt: -1 });
    if (!products || products.length === 0) {
      return res.send({ msg: "No data found", products, total });
    }
    res.status(200).send({ products, total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error from orderList", error });
  }
};

//=============================================

const adminSearchProductList = async (req, res) => {
  try {
    const { keyword } = req.query;
    let page = req.query?.page ? req.query?.page : 1;
    let size = req.query?.size ? req.query?.size : 4;
    let skip = (page - 1) * size;

    const totalSearch = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    const searchProduct = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .populate("category")
      .skip(skip)
      .limit(size);

    res.status(200).send({
      msg: "got user from searchProduct",
      searchProduct,
      total: totalSearch.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from adminSearchProductList", error });
  }
};

//========================================================

const orderSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    let page = req.query?.page ? req.query?.page : 1;
    let size = req.query?.size ? req.query?.size : 4;
    let skip = (page - 1) * size;
    const searchUser = await UserModel.find(
      {
        $or: [
          { email: { $regex: keyword, $options: "i" } },
          { phone: { $regex: keyword, $options: "i" } },
        ],
      },
      { name: 1, _id: 1, email: 1 }
    );

    const total = await OrderModel.find({
      $or: [
        { status: { $regex: keyword, $options: "i" } },
        { user: searchUser[0]?._id },
      ],
    });
    const searchOrders = await OrderModel.find({
      $or: [
        { status: { $regex: keyword, $options: "i" } },
        { user: searchUser[0]?._id },
      ],
    })
      .skip(skip)
      .limit(size)
      .populate("user", { password: 0 })
      // .populate("products")
      // .populate({
      //   path: "products",
      //   populate: {
      //     path: "category",
      //   },
      // })
      .sort({ createdAt: -1 });

    res.status(200).send({
      msg: "got orders from search",
      total: total.length,
      searchOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from orderSearch", error });
  }
};

//=================================================

const gallery = async (req, res) => {
  try {
    const picturePath = req.files.map((file) => file.path);
    // console.log(picturePath);
    // const { secure_url, public_id } = await uploadOnCloudinary(
    //   picturePath[1],
    //   "gallery"
    // ); // path and folder name as arguments
    // if (!secure_url) {
    //   return res
    //     .status(500)
    //     .send({ msg: "error uploading images", error: secure_url });
    // }

    let imageList = await GalleryModel.find({});

    if (imageList.length === 0) {
      let images = await GalleryModel.create({ picture: picturePath });
      return res
        .status(201)
        .send({ msg: "images uploaded successfully", success: true, images });
    }
    totalImage = [...imageList[0]?.picture, ...picturePath];
    let images = await GalleryModel.findByIdAndUpdate(
      imageList[0]?._id,
      { picture: totalImage },
      { new: true }
    );
    res
      .status(201)
      .send({ msg: "images updated successfully", success: true, images });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "error from gallery create",
      error,
    });
  }
};

//====================================
const adminContacts = async (req, res) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    let size = req.query.size ? req.query.size : 4;
    let skip = (page - 1) * size;
    const total = await ContactModel.find({}).estimatedDocumentCount();

    const contacts = await ContactModel.find({})
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 });
    if (!contacts || contacts.length === 0) {
      return res.send({ msg: "No data found" });
    }
    res.status(200).send({ contacts, total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error from user list", error });
  }
};

//====================================
const adminContactReply = async (req, res) => {
  try {
    const { email, reply, msgId } = req.body;
    if (!reply || !msgId || !email) {
      return res.json({ msg: "All fields are required" });
    }
    await ContactReplyModel.create({
      email,
      reply,
      msgId,
      user: req.user?._id,
    });
    let findmsg = await ContactModel.findById(msgId);
    let destructure = [...findmsg.replies];
    findmsg.replies = [
      ...destructure,
      { userName: req.user?.name, msg: reply, date: Date.now() },
    ];
    await findmsg.save();

    let credential = {
      email,
      subject: "Contact reply",
      body: `<h2>Hi ${findmsg?.name},</h2>
      <h3>${reply} </h3>
      Thanks for staying with us`,
    };
    mailer(credential);
    res.status(201).json({ msg: "Reply sent successfully", success: true });
  } catch (error) {
    res.status(401).json({ msg: "error from adminContactReply", error });
  }
};

//====================================

const totalSale = async (req, res) => {
  try {
    let sdate = new Date(req.query?.startDate);
    let edate = new Date(req.query?.endDate);

    let todayFull = new Date();
    let todayShort = todayFull.toDateString();
    let today = new Date(todayShort);
    let todayNow = new Date();

    const orders = await OrderModel.find({
      createdAt: { $gte: sdate, $lte: edate },
    });
    const dateTotal = await OrderModel.find({
      createdAt: { $gte: sdate, $lte: edate },
    })
      
      .select({ total: 1, createdAt: 1, products:1 });
    //=====

    // total lisr
    let list = [];
    await orders.map((item) => {
      for (let v of item.products) {
        list.push(v);
      }
    });
    //===== top 5 products
    let result = {};
    await list.map((item) => {
      result[item.name] = (result[item.name] || 0) + item.price;
    });

    let arrTotal = [];
    for (let k in result) {
      await arrTotal.push({ name: k, totalSale: result[k] });
    }
    let topProds = await arrTotal
      .sort((a, b) => {
        return b.totalSale - a.totalSale;
      })
      .slice(0, 5);
    //==============
    
    const ordersToday = await OrderModel.find({
      createdAt: { $gte: today, $lte: todayNow },
    });
    let totalSaleToday =
    ordersToday?.length &&
    ordersToday.reduce((previous, current) => {
      return previous + current.total;
      }, 0);
      
      let totalSale =
      orders?.length &&
      orders.reduce((previous, current) => previous + current.total, 0);

      if (!totalSale || totalSale?.length === 0) {
        return res.send({ msg: "No data found" });
      }
    res
      .status(200)
      .send({ dateTotal, topProds, totalSaleToday, totalSale, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error from totalSale", error });
  }
};

//======================================================
let offer = async (req, res) => {
  try {
    let { selectIds, offer } = req.body;
    if (!selectIds?.length || !offer) {
      return res.send({ msg: "Select product and input offer percentage" });
    }
    for (let id of selectIds) {
      await ProductModel.findByIdAndUpdate(id, { offer }, { new: true });
    }
    res.status(200).send({ msg: "offer updated successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from update offer", error });
  }
};

module.exports = {
  userList,
  deleteUser,
  userStatusUpdate,
  orderList,
  orderStatusUpdate,
  adminProductList,
  orderSearch,
  searchUser,
  adminSearchProductList,
  gallery,
  adminContacts,
  adminContactReply,
  totalSale,
  offer,
};
