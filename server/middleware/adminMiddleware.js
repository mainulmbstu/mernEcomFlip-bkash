

const adminMiddleware = async (req, res, next) => {
  try {
    let admin = req?.user?.role;
    if (!admin) {
      return res.status(400).send({
        msg: "Unauthorized, you are not an Admin",
        src: "adminMiddleware",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ msg: "adminMiddleware", error });
  }
};

module.exports = adminMiddleware;