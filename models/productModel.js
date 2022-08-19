const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    prodName: {
      type: String,
      required: [true, "please provide a product name"],
    },
    prodDescription: {
      type: String,
      required: [true, "please provide a product description"],
    },
    prodCategory: {
      type: String,
      required: [true, "please choose a product category"],
    },
    prodPrice: {
      type: Number,
      required: [true, "please provide a product price"],
    },
    prodImg: {
      type: String,
      required: [true, "please provide a product img"],
    },
    img_id: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
