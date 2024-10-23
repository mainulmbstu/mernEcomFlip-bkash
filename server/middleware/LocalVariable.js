const localVariable = async (req, res, next) => {
  try {
      req.app.locals = {
          OTP:null,
          resetSession:false
      }
      next()
  } catch (error) {
    res.status(500).send({ msg: "error from localVariable", error });
  }
};


module.exports = localVariable;