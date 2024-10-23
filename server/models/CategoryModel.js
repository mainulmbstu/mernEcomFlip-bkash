const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, lowercase: true },
    parentId: { type: String },
    picture: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // or mongoose.ObjectId
      ref: "User", //collection name in mongoose.model('Category', categorySchema)
    },
  },
  {
    timestamps: true,
  }
);
//===========wiyhout image============
// const categorySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true, unique:true },
//     slug: { type: String, lowercase: true },
//     parentId: { type: String, default:''},
//   },
//   {
//     timestamps: true
//   }
// );

const CategoryModel = mongoose.model("Category", categorySchema);








module.exports = CategoryModel;
