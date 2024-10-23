const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const loginMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res
        .status(400)
        .json({ msg: "Unauthorized, token not found", src: "check login" });
    }
    let jwtToken = token.replace("Bearer", "").trim();
    let tokenData = jwt.verify(jwtToken, process.env.JWT_KEY,
      (err, res) => {
        if (err) {
          return "token expired";
        }
        return res;
      }
    );
    if (!tokenData) {
      return res
      .status(400)
      .json({ msg: "Unauthorized, wrong token", src: "check login" });
    }
    
    let userData = await UserModel.findById(tokenData.id, { password: 0 });
    if (tokenData === 'token expired') {
      req.user = "token expired";
      return next()
    }
    req.user = userData;
    next();
  } catch (error) {
    res.status(401).json({ msg: "checkLogin", error });
  }
};

module.exports = loginMiddleware;
