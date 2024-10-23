const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    review: { type: String, required: true },
    pid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", //collection name in mongoose.model('User', userSchema)
      required: true,
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("Review", reviewSchema);


const ratingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    rating: { type: String, required: true },
    pid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", //collection name in mongoose.model('User', userSchema)
      required: true,
    },
  },
  { timestamps: true }
);

const RatingModel = mongoose.model("Rating", ratingSchema);

module.exports = { ReviewModel, RatingModel };
