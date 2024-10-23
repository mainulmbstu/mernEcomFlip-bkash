const {
  uploadOnCloudinary,
  deleteImageOnCloudinary,
} = require("../helper/cloudinary");
const { v4: uuidv4 } = require("uuid");

const SSLCommerzPayment = require("sslcommerz-lts");

const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/CategoryModel");
const slugify = require("slugify");
const OrderModel = require("../models/OrderModel");
const { ReviewModel, RatingModel } = require("../models/ReviewModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} = require("bkash-payment");

//==================================================
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, offer, quantity } = req.body;
    // console.log(req.files);
    const pictures = req.files;
    if (!name || !description || !category || !price || !quantity) {
      return res.send({ msg: "All fields are required" });
    }
    if (category === "undefined") {
      return res.send({ msg: "Wrong category" });
    }
    let picturePaths =
      (await pictures.length) && pictures.map((pic) => pic.path);

    let links = [];
    for (spath of picturePaths) {
      const { secure_url, public_id } = await uploadOnCloudinary(
        spath,
        "products"
      ); // path and folder name as arguments
      links = [...links, { secure_url, public_id }];
      if (!secure_url) {
        return res
          .status(500)
          .send({ msg: "error uploading image", error: secure_url });
      }
    }
    let product = await ProductModel.create({
      name: name.toUpperCase(),
      slug: slugify(name),
      description,
      category,
      price,
      if(offer) {
        offer;
      },
      quantity,
      user: req.user?._id,
      picture: links,
    });
    res
      .status(201)
      .send({ msg: "product created successfully", success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "error from product create, check file size and file type",
      error,
    });
  }
};

// //==========single image==============
// const createProduct = async (req, res) => {
//   try {
//     const { name, description, category, price, quantity, shipping } = req.body;
//     // const picture = req.file?.fieldname;
//     const picturePath = req.file?.path
//     if (!name || !description || !category || !price || !quantity) {
//       return res.status(400).send({ msg: "All fields are required" });
//     }

//     const { secure_url, public_id } = await uploadOnCloudinary(
//       picturePath,
//       "products"
//     ); // path and folder name as arguments
//     if (!secure_url) {
//       return res
//         .status(500)
//         .send({ msg: "error uploading image", error: secure_url });
//     }

//     let product = await ProductModel.create({
//       name,
//       slug: slugify(name),
//       description,
//       category,
//       price,
//       quantity,
//       user: req.user?._id,
//       picture: { secure_url, public_id },
//       shipping,
//     });
//     res
//       .status(201)
//       .send({ msg: "product created successfully", success: true, product });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ msg: "error from product create, check file size and file type", error });
//   }
// };
//======================================
const productList = async (req, res) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    let size = req.query.size ? req.query.size : 4;
    let skip = (page - 1) * size;
    let offerIds = (await ProductModel.find({offer:{$gt:0}}).sort({updatedAt:-1}).limit(5)).map(item=>item._id)

    const total = (await ProductModel.find({_id:{$nin:offerIds}})).length
    const products = await ProductModel.find({ _id:{$nin:offerIds} })
      .skip(skip)
      .limit(size)
      .populate("category", 'name')
      // .populate("category", 'name slug')
      // .populate("category", '-picture')
      .sort({ createdAt: -1 });
    if (!products || products.length === 0) {
      return res.send({ msg: "No data found", products, total });
    }
    res.status(200).send({ products, total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error from productList", error });
  }
};
//==============================================
const updateProduct = async (req, res) => {
  try {
    let pid = req.params.pid;
    const { name, description, category, price, offer, quantity } = req.body;
    const pictures = req.files;
    if (category === "undefined") {
      return res.send({ msg: "Wrong category" });
    }
    let product = await ProductModel.findById(pid);
    if (!product) {
      return res.send({ msg: "No data found" });
    }

    if (name) product.name = name.toUpperCase();
    if (name) product.slug = slugify(name);
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (offer) product.offer = offer;
    if (quantity) product.quantity = quantity;

    // upload and delete image on cloudinary
    let picturePaths =
      (await pictures.length) && pictures.map((pic) => pic.path);

    let links = [];
    if (picturePaths.length) {
      for (spath of picturePaths) {
        const { secure_url, public_id } = await uploadOnCloudinary(
          spath,
          "products"
        ); // path and folder name as arguments
        links = [...links, { secure_url, public_id }];
        if (!secure_url) {
          return res
            .status(500)
            .send({ msg: "error uploading image", error: secure_url });
        }
      }

      if (product?.picture?.length && product?.picture[0].public_id) {
        let publicPaths = await product.picture.map((pic) => pic.public_id);
        for (dpath of publicPaths) {
          await deleteImageOnCloudinary(dpath);
        }
      }

      product.picture = links;
    }

    let updatedProduct = await product.save();
    res.status(201).send({
      success: true,
      msg: "product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from product update", error });
  }
};
// const updateProduct = async (req, res) => {
//   try {
//     let pid = req.params.pid;
//     const { name, description, category, price, quantity, shipping } = req.body;
//     // const picture = req.file?.fieldname;
//     const picturePath = req.file?.path;
//     let product = await ProductModel.findById(pid);
//     if (!product) {
//       return res.status(400).send({ msg: "No data found" });
//     }

//     if (name) product.name = name;
//     if (name) product.slug = slugify(name);
//     if (description) product.description = description;
//     if (category) product.category = category;
//     if (price) product.price = price;
//     if (quantity) product.quantity = quantity;
//     if (shipping) product.shipping = shipping;

//     // upload and delete image on cloudinary
//     if (picturePath) {
//       let { secure_url, public_id } = await uploadOnCloudinary(
//         picturePath,
//         "products"
//       );
//       if (product.picture && product.picture.public_id) {
//         await deleteImageOnCloudinary(product.picture.public_id);
//       }

//       product.picture = { secure_url, public_id };
//     }

//     let updatedProduct = await product.save();
//     res.status(201).send({
//       success: true,
//       msg: "product updated successfully, refresh to view",
//       updatedProduct,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ success: false, msg: "error from product update", error });
//   }
// };
//=========================================

let createCategories = async (category, parentId = null) => {
  let categoryList = [];
  let filteredCat;
  if (parentId == null) {
    filteredCat = await category.filter((item) => item.parentId == undefined);
  } else {
    filteredCat = await category.filter((item) => item.parentId == parentId);
  }
  for (let v of filteredCat) {
    await categoryList.push({
      _id: v._id,
      name: v.name,
      slug: v.slug,
      user: v.user,
      picture: v.picture,
      parentId: v.parentId,
      updatedAt: v.updatedAt,
      children: await createCategories(category, v._id),
    });
  }
  return categoryList;
};

let getPlainCatList = (filtered, list = []) => {
  for (let v of filtered) {
    list.push(v);
    if (v.children.length > 0) {
      getPlainCatList(v.children, list);
    }
  }
  return list;
};

const productByCategory = async (req, res) => {
  try {
    const { page, size, priceCatArr, catSlug } = req.body;
    let skip = (page - 1) * size;
    let keyCat = await CategoryModel.findOne({ slug: catSlug });
    const category = await CategoryModel.find({});
    let categoryList = await createCategories(category); // function above
    let filtered = await categoryList.filter(
      (parent) => parent?.slug === req.params?.slug
    );

    let catPlain = getPlainCatList(filtered);

    const category2 = await CategoryModel.find({
      $or: [{ _id: keyCat?._id }, { parentId: keyCat?._id }],
    });
    let finalCat = keyCat?.parentId ? category2 : catPlain;

    let args = {};
    if (finalCat?.length > 0) args.category = finalCat;
    if (priceCatArr?.length > 0)
      args.price = { $gte: priceCatArr[0], $lte: priceCatArr[1] };

    const total = await ProductModel.find(args);
    const products = await ProductModel.find(args)
      .skip(skip)
      .limit(size)
      .populate("category", 'name')
    .sort({updatedAt:-1})

    res.status(200).send({ products, total:total?.length });
  } catch (error) {
    console.log(error);
    res.send({ msg: "error from productByCategory", error });
  }
};
//================================================
const moreInfo = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findOne({ _id: pid }).populate(
      "category", 'name'
    );
    // let products = product[0];
    product.rating = product.rating.toFixed(1);
    res.status(200).json({ msg: "got product moreInfo", product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from moreInfo", error });
  }
};

//==========================================

const productSearch = async (req, res) => {
  try {
    const { keyword, page, size, priceCatArr } = req.body;
    let skip = (page - 1) * size;
    const category = await CategoryModel.find({});
    let categoryList = await createCategories(category);
    const keyCat = await CategoryModel.findOne({
      name: { $regex: keyword, $options: "i" },
    });
    let filtered = await categoryList.filter(
      (parent) => parent?.slug === keyCat?.slug
    );
    let catPlain = getPlainCatList(filtered);
    // if not top parent
    const category2 = await CategoryModel.find({
      $or: [{ _id: keyCat?._id }, { parentId: keyCat?._id }],
    });

    let args = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: keyCat?.parentId ? category2 : catPlain },
      ],
    };
    if (priceCatArr.length > 0)
      args.price = { $gte: priceCatArr[0], $lte: priceCatArr[1] };

    const totalProd = await ProductModel.find(args);
    const products = await ProductModel.find(args)
      .skip(skip)
      .limit(size)
      .populate("category", 'name')
      .sort({ createdAt: -1 });

    res.status(200).send({
      msg: "got product from search",
      products,
      total: totalProd?.length,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ msg: "error from productSearch", error });
  }
};
//===============================================================
const similarProducts = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .populate("category", 'name')
      .limit(12)
      .sort({ updatedAt: -1 });
    res.status(200).send({ msg: "got product from search", products });
  } catch (error) {
    console.log(error);
    res.status(401).send({ msg: "error from similarProducts", error });
  }
};
//============================================ was for home pge
const productFilter = async (req, res) => {
  try {
    const { checkedCat, priceCat, pageOrSize } = req.body;
    let page = pageOrSize?.page;
    let size = pageOrSize?.size;
    let skip = (page - 1) * size;
    let args = {};
    if (checkedCat.length > 0) args.category = checkedCat;
    if (priceCat.length > 0)
      args.price = { $gte: priceCat[0], $lte: priceCat[1] };
    const total = (await ProductModel.find(args)).length;
    const products = await ProductModel.find(args)
      .skip(skip)
      .limit(size)
      .populate("category")
      .sort({ updatedAt: -1 });

    res.status(200).send({ success: true, products, total });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from productFilter", error });
  }
};
//===========================================
const singleProduct = async (req, res) => {
  try {
    const singleProduct = await ProductModel.findOne({ _id: req.params.pid })
      .populate("category", 'name')
      .populate("user", { password: 0 });

    if (!singleProduct) {
      return res.status(400).send("No data found");
    }
    res.status(200).send(singleProduct);
  } catch (error) {
    res.status(401).json({ msg: "error from singleProduct", error });
  }
};

//=================================================================
let deleteProduct = async (req, res) => {
  try {
    let pid = req.params.pid;
    let deleteItem = await ProductModel.findById(pid);
    if (!deleteItem) {
      return res.status(400).send({ msg: "No data found" });
    }
    if (deleteItem.picture?.length && deleteItem.picture[0].public_id) {
      let publicPaths = await deleteItem?.picture?.map((pic) => pic.public_id);
      for (dpath of publicPaths) {
        await deleteImageOnCloudinary(dpath);
      }
    }

    await ProductModel.findByIdAndDelete(pid);
    res.status(200).send({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(401).send({ msg: "error from deleteProduct", error });
  }
};

//============checkout ==========================



//============== check oout by bkash

const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL,
  username: process.env.BKASH_USER,
  password: process.env.BKASH_PASSWORD,
  app_key: process.env.BKASH_APP_KEY,
  app_secret: process.env.BKASH_APP_SECRET,
};

//====== payment_id is added in order model
const orderCheckoutBkash = async (req, res) => {
  try {
    const { cart, total, orderID, callbackURL, reference } = req.body;

    
    const paymentDetails = {
      amount: total || 1, // your product price
      callbackURL: callbackURL, // your callback route
      orderID: orderID || "Order_101", // your orderID
      reference: reference || "1", // your reference
    };
    const result = await createPayment(bkashConfig, paymentDetails);

      let order = {
        products: cart,
        total,
        payment: {
          payment_id: result.paymentID,
        },
        user: req.user._id,
      };
      await OrderModel.create(order);
    // res.redirect(result?.bkashURL);
    res.send(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from orderCheckoutBkash", error });
  }
}

const bkashCallback = async (req, res) => {
  try {
    const { status, paymentID } = req.query;
    let result;
    let response = {
      statusCode: "4000",
      statusMessage: "Payment Failed",
    };
    if (status === "success")
      result = await executePayment(bkashConfig, paymentID);

    if (result?.transactionStatus === "Completed") {
      // payment success
      // insert result in your db
    }
    if (result)
      response = {
        statusCode: result?.statusCode,
        statusMessage: result?.statusMessage,
      };
    // You may use here WebSocket, server-sent events, or other methods to notify your client
    if (response?.statusCode === '0000') {
      res.redirect(
        `${process.env.BASE_URL}/products/payment/success/${paymentID}/${result?.trxID}`
      );
        } else {
      res.redirect(
        `${process.env.BASE_URL}/products/payment/fail/${paymentID}`
      );
      
    }
      
  } catch (e) {
    console.log(e);
  }
}
//====================================
const bkashRefund = async (req, res) => {
  try {
    const { paymentID, trxID, amount } = req.body;
    const refundDetails = {
      paymentID,
      trxID,
      amount,
    };
    const result = await refundTransaction(bkashConfig, refundDetails);
    if (result?.statusCode=== '0000') {
      await OrderModel.findOneAndUpdate(
        { "payment.trxn_id": trxID },
        { "payment.refund": "refunded" },
        { new: true }
      );
    }

    res.send(result);
  } catch (e) {
    console.log(e);
  }
};

const bkashSearch = async (req, res) => {
  try {
    const { trxID } = req.query;
    const result = await searchTransaction(bkashConfig, trxID);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
};

const bkashQuery = async (req, res) => {
  try {
    const { paymentID } = req.query;
    const result = await queryPayment(bkashConfig, paymentID);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
};
// =============================================================

const orderSuccessBkash = async (req, res) => {
  try {
    let { payment_id, trxn_id } = req.params;

    let updated = await OrderModel.findOneAndUpdate(
      { "payment.payment_id": payment_id },
      { "payment.status": true, "payment.trxn_id": trxn_id },
      { new: true }
    );

    if (updated.isModified) {
      for (let v of updated.products) {
        let product = await ProductModel.findById(v._id);
        product.quantity = product.quantity - v.amount;
        product.save();
      }

      res.redirect(
        `${process.env.FRONT_URL}/products/payment/success/${updated._id}`
      );
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from orderSuccess", error });
  }
};
//============================================================
const orderFailBkash = async (req, res) => {
  try {
  let {payment_id} = req.params;
    let deleted = await OrderModel.findOneAndDelete({
      "payment.payment_id": payment_id,
    });
    if (deleted.$isDeleted) {
      res.redirect(`${process.env.FRONT_URL}/products/payment/fail`);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from orderFail", error });
  }
};

//============== SSL ===============
const orderCheckout = async (req, res) => {
  try {
    const { cart, total } = req?.body;
    let trxn_id = "DEMO" + uuidv4();
    let baseurl = process.env.BASE_URL;


    const data = {
      total_amount: total,
      currency: "BDT",
      tran_id: trxn_id, // use unique tran_id for each api call
      success_url: `${baseurl}/products/payment/success/${trxn_id}`,
      fail_url: `${baseurl}/products/payment/fail/${trxn_id}`,
      cancel_url: `${baseurl}/products/payment/fail/${trxn_id}`,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Multi",
      product_category: "Multi",
      product_profile: "general",
      cus_name: req?.user?.name,
      cus_email: req?.user?.email,
      cus_add1: req?.user?.address,
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: req?.user?.phone,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    // sslcommerz
    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASS;
    const is_live = false; //true for live, false for sandbox

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });
      // console.log("Redirecting to: ", GatewayPageURL);

      let order = {
        products: cart,
        total,
        payment: {
          trxn_id,
        },
        user: req.user._id,
      };
      OrderModel.create(order);
    });

    // res.status(200).send({ success: true, order });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send({ success: false, msg: "error from orderCheckout", error });
  }
};

// =============================================================

const orderSuccessSSL = async (req, res) => {
  try {
    let { trxn_id } = req.params;

    let updated = await OrderModel.findOneAndUpdate(
      { "payment.trxn_id": trxn_id },
      { "payment.status": true},
      { new: true }
    );

    if (updated.isModified) {
      for (let v of updated.products) {
        let product = await ProductModel.findById(v._id);
        product.quantity = product.quantity - v.amount;
        product.save();
      }

      res.redirect(
        `${process.env.FRONT_URL}/products/payment/success/${updated._id}`
      );
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from orderSuccess", error });
  }
};

//============================================================
const orderFailSSL = async (req, res) => {
  try {
    let trxn_id = req.params.trxn_id;
    let deleted = await OrderModel.findOneAndDelete({
      "payment.trxn_id": trxn_id,
    });
    if (deleted.$isDeleted) {
      res.redirect(`${process.env.FRONT_URL}/products/payment/fail`);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from orderFail", error });
  }
};

//======================================================================
const reviewProduct = async (req, res) => {
  try {
    const { name, email, review, pid } = req.body;
    if (!review || !name || !pid) {
      return res.json({ msg: "Name and review are required" });
    }
    await ReviewModel.create({ name, email, review, pid });
    let product = await ProductModel.findById(pid);
    await ProductModel.findByIdAndUpdate(pid, { review: product?.review + 1 });

    res.status(201).json({ msg: "Thanks for your review", success: true });
  } catch (error) {
    res.status(500).json({ msg: "error from review", error });
  }
};

//======================================================================
const ratingProduct = async (req, res) => {
  try {
    const { name, email, rating, pid } = req.body;
    if (!rating || !name || !pid) {
      return res.json({ msg: "Name and rating are required" });
    }
    await RatingModel.create({ name, email, rating, pid });
    let product = await ProductModel.findById(pid);
    let calRating =
      (product?.rating * product?.ratingNo + rating) / (product?.ratingNo + 1);
    await ProductModel.findByIdAndUpdate(pid, {
      rating: calRating,
      ratingNo: product?.ratingNo + 1,
    });

    res.status(201).json({ msg: "Thanks for your rating", success: true });
  } catch (error) {
    res.status(500).json({ msg: "error from rating", error });
  }
};

//================================================
const getReview = async (req, res) => {
  try {
    const { pid } = req.params;
    const reviews = await ReviewModel.find({ pid }).sort({createdAt:-1});
    res.status(200).json({ msg: "got review", reviews });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from moreInfo", error });
  }
};

//===============================================================
const offerProductList = async (req, res) => {
  try {
    const { page, size } = req.query;
    let skip = (page - 1) * size;
    
    const total = (await ProductModel.find({offer:{$gt:0}})).length;
    const products = await ProductModel.find({ offer: { $gt: 0 } })
    .skip(skip)
    .limit(size)
    .populate("category", 'name')
    .sort({ updatedAt: -1 });
    
    // console.log(total, products);
  res.status(200).send({ success: true, products, total });
} catch (error) {
  console.log(error);
  res
    .status(500)
    .send({ success: false, msg: "error from offerProductList", error });
}
};

//===============================================================
const getCartUpdate = async (req, res) => {
  try {
    const { cartIdArr } = req.body;
    let products=[]
    if (cartIdArr?.length) {
      for (let v of cartIdArr) {
        const prod = await ProductModel.findById(v).populate("category", 'name');
        prod && await products.push(prod)
      }
    }

    res.status(200).send({ msg: "got product from getCartUpdate", products });
  } catch (error) {
    console.log(error);
    res.status(401).send({ msg: "error from getCartUpdate", error });
  }
};

//==============================================================

module.exports = {
  createProduct,
  singleProduct,
  updateProduct,
  deleteProduct,
  productFilter,
  productSearch,
  similarProducts,
  moreInfo,
  productByCategory,
  orderCheckout,
  orderSuccessBkash,
  orderFailBkash,
  productList,
  reviewProduct,
  ratingProduct,
  getReview,
  offerProductList,
  getCartUpdate,
  orderCheckoutBkash,
  bkashCallback,
  bkashRefund,
  bkashSearch,
  bkashQuery,
  orderSuccessSSL,
  orderFailSSL,
};
