const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    picture: { type: Array, required: true },

    },
  { timestamps: true }
);

const GalleryModel = mongoose.model("Gallery", gallerySchema);

module.exports = GalleryModel ;
