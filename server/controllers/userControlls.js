const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel  = require("../models/userModel");
const  OrderModel  = require("../models/OrderModel");
const  GalleryModel  = require("../models/GalleryModel");
const  {ContactModel}  = require("../models/ContactModel");
const otpGenerator = require("otp-generator");
const mailer = require("../helper/nodeMailer");
const mailerContact = require("../helper/nodeMailerContact");
const localVariable = require("../middleware/LocalVariable");

const home = async (req, res) => {
  try {
    await res.send("hello mern4");
  } catch (error) {
    res.send(error);
  }
};
//============================================================
const getOTP = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({ msg: "All fields are required" });
    }
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).send({ msg: "User already exist" });
    }
    const mobileExist = await UserModel.findOne({ phone });
    if (mobileExist) {
      return res.status(400).send({ msg: "Mobile number already exist" });
    }
    req.app.locals.OTP = await otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let credential = {
      email,
      subject: "Register OTP",
      body: `<h2>Hi ${name},</h2>
      <h3>Your registration OTP is ${req.app.locals.OTP}. You can use it only once. </h3>
      Thanks for staying with us`,
    };
    mailer(credential);
    req.app.locals.resetSession = true;

    res.status(201).send({
      msg: `OTP has been sent to ${email}`,
      OTP: req.app.locals.OTP,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from register", error });
  }
};
//============================================================
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, regOTP } = req.body;
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({ msg: "All fields are required" });
    }
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).send({ msg: "User already exist" });
    }
    const mobileExist = await UserModel.findOne({ phone });
    if (mobileExist) {
      return res.status(400).send({ msg: "Mobile number already exist" });
    }
    if (regOTP !== req.app.locals.OTP) {
      req.app.locals.OTP = null;
      return res.status(400).send({ msg: "Wrong OTP" });
    }
    
    if (regOTP === req.app.locals.OTP && req.app.locals.resetSession === true) {
      let hashedPass = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPass,
        phone,
        address,
      });
      req.app.locals.resetSession = false;
      let credential = {
        email,
        subject: "Registration successful",
        body: `<h2>Hi ${name},</h2>
      <h3>You have been registered successfully. Your ID is ${newUser._id}. </h3>
      Thanks for staying with us`,
      };
      mailer(credential);

      res.status(201).send({
        msg: `Congratulation !! Registration successful.`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error from register", error });
  }
};
//===================================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).send({ msg: "User not registered" });
    }
    let passMatch = await bcrypt.compare(password, userExist.password);
    if (!passMatch) {
      return res.status(400).send({ msg: "password not matched" });
    }
    id = userExist._id;
    let token = await jwt.sign({ email, id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    let userInfo = await UserModel.findById(id, { password: 0 });
    res.status(200).send({ msg: "Login successfully", userInfo, token });
  } catch (error) {
    res.status(500).send({ msg: "error from login", error });
  }
};

//===========================================================================
const loggedUser = async (req, res) => {
  try {
    let userData = req.user;
    // console.log(userData);
    res.status(200).send({ userData });
  } catch (error) {
    res.status(401).send({ msg: "userControls, user", error });
  }
};
//============================================================
const userUpdate = async (req, res) => {
  try {
    let { id, name, storeName, email, password, phone, address } = req.body;
    storeName = storeName?.toUpperCase();

    let user = await UserModel.findById(req.user._id, {
      password: 0,
      role: 0,
    });
    if (!user) {
      return res.status(400).send({ msg: "No user found" });
    }

    if (phone !== user?.phone) {
      const mobileExist = await UserModel.findOne({ phone });
      if (mobileExist) {
        return res.status(400).send({ msg: "Mobile number already exist" });
      }
    }

    //  let hashedPass= await bcrypt.hash(password, 10)

    if (id) user._id = id;
    if (name) user.name = name;
    if (storeName) user.storeName = storeName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (address) user.address = address;
    let updatedUser = await user.save();
    let credential = {
      email,
      subject: "Update profile successful",
      body: `<h2>Hi ${updatedUser?.name},</h2>
      <h3>Your profile has been updated successfully. </h3>
      Thanks for staying with us`,
    };
    mailer(credential);

    res.status(201).send({
      success: true,
      msg: "user updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, msg: "error from user update", error });
  }
};
//===========================================================================
const userOrders = async (req, res) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    let size = req.query.size ? req.query.size : 4;
    let skip = (page - 1) * size;
    const total = await OrderModel.find({
      user: req.user._id,
    });
    const orderList = await OrderModel.find({ user: req.user._id })
      .populate("user", { password: 0, })
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 });

    if (!orderList || orderList.length === 0) {
      return res.status(400).send({ msg: "No data found" });
    }
    res.status(200).send({ orderList, total: total.length });
  } catch (error) {
    res.status(401).json({ msg: "error from userorders", error });
  }
};

//===========================================================================
const gallery = async (req, res) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    let size = req.query.size ? req.query.size : 4;
    let skip = (page - 1) * size;
    const total = await GalleryModel.find({});
    const images = await GalleryModel.find({})
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 });
    if (!images || images?.length === 0) {
      return res.status(400).send({ msg: "No data found" });
    }
    res.status(200).send({ images, total: total[0]?.picture.length });
  } catch (error) {
    res.status(401).json({ msg: "error from GalleryModel", error });
  }
};

//======================================================================
const userVerified = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: "User not exist" });
    }
    req.app.locals.OTP = await otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let credential = {
      email,
      subject: "Password reset OTP",
      body: `<h2>Hi ${user.name},</h2>
      <h3>Your OTP is ${req.app.locals.OTP} with validity of 5 minutes. </h3>
      Thanks for staying with us`,
    };
    mailer(credential);

    req.app.locals.resetSession = true;
    res.status(201).send({ msg: `OTP has been sent to ${email}` });
    //  OTP validity
    setTimeout(() => {
      req.app.locals.resetSession = false;
    }, 300000);
  } catch (error) {
    res.status(500).send({ msg: "error from userVerified", error });
  }
};
//======================================================================
const OTPVerified = async (req, res) => {
  try {
    const { email, OTP } = req.body;
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).send({ msg: "Input email" });
    }
    if (OTP !== req.app.locals.OTP) {
      return res.status(400).send({ msg: "Wrong OTP" });
    }

    res.status(201).send({ msg: "OTP matched" });
  } catch (error) {
    res.status(500).send({ msg: "error from OTPVerified", error });
  }
};
//======================================================================
const ResetNewPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { email } = req.params;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: "user not found" });
    }
    if (req.app.locals.resetSession !== true) {
      return res.status(400).send({ msg: "Session expired, try again" });
    }
    let hashedPass = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate(user._id, { password: hashedPass });
    res.status(200).send({ msg: "Password reset succesfully" });

    req.app.locals.resetSession = false;
  } catch (error) {
    res.status(500).send({ msg: "error from ResetNewPassword", error });
  }
};
//======================================================================
const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!message || !name || !email) {
     return res.json({ msg: "All fields are required" });
    }
    await ContactModel.create({ name, email, message });

    res.status(201).json({ msg: "message has been sent successfully", success:true });
  } catch (error) {
    res.status(500).json({ msg: "error from contact", error });
  }
};

//====================================
const getContacts = async (req, res) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    let size = req.query.size ? req.query.size : 4;
    let skip = (page - 1) * size;
    let {email} = req.user
    const total = await ContactModel.find({email}).estimatedDocumentCount();
    const contacts = await ContactModel.find({ email })
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


//==============================================

module.exports = {
  home,
  register,
  login,
  loggedUser,
  userUpdate,
  userOrders,
  gallery,
  userVerified,
  OTPVerified,
  ResetNewPassword,
  getOTP,
  contact,
  getContacts,
};
