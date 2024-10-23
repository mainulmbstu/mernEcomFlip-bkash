require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbcon = require("./db");
const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const multer = require("multer");
const bodyParser = require("body-parser");



const corsOption = {
  origin: process.env.FRONT_URL,
  method: "GET, POST, PATCH, PUT, DELETE, HEAD",
  Credentials: true,
};

const app = express();
app.use(cors(corsOption));
app.use(express.json());


app.use('/public', express.static('public'))
// for static path of public folder
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('hello ecom')
// })
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/category", categoryRouter);
app.use("/products", productRouter);

// sslcommerz
const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false //true for live, false for sandbox



//============ error middleware
app.use((err, req, res, next) => {
  if (err) {
   res.status(501).send(err.message);
  } else {
    res.send('success')
  }
})


let port= process.env.PORT || 8080

dbcon().then(() => {
  app.listen(port, () => {
    console.log(`server running on ${process.env.mode} mode on ${port}`);
  });
});
