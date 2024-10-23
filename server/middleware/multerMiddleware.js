const { error } = require("console");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

//=========for multi file
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // in bytes

//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === "picture") {
//       if (file.mimetype === "image/jpg" || "image/png") {
//         cb(null, true);
//       } else {
//         cb(new Error("only jpg/png file allowed"));
//       }
//     } else if (file.fieldname === "doc") {
//         if (file.mimetype === "application/pdf" ) {
//           cb(null, true);
//         } else {
//           cb(new Error("only pdf file allowed"));
//         }
//     } else {
//       cb(new Error("there was an unknown error"));
//     }

//   },
// })

//=========for single file

const upload = multer({
  storage: storage,
  limits: { fileSize: 4000000 }, // in bytes
  fileFilter: (req, file, cb) => {
    if ( file.mimetype === "image/jpg"
      || file.mimetype === "image/png"
      || file.mimetype === "image/jpeg"
      || file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(null, false)
     cb(new Error("only jpg, jpeg, png, webp files allowed"));
    }
  }
});

module.exports = upload;
