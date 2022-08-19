const express = require("express");
const upload = require("../utils/multer");
const {
  allProducts,
  createProduct,
  singleProduct,
  delProduct,
  updateProd,
} = require("../controllers/prodControllers");

const router = express.Router();

//*************** create product route ***************

router.post("/", upload.single("prodImg"), createProduct);

//**************** get all product***********

router.get("/", allProducts);

//************* get single product*************

router.get("/:id", singleProduct);

//********************** delete product***********

router.delete("/:id", delProduct);

//************* update product*************
router.patch("/:id", upload.single("prodImg"), updateProd);

module.exports = router;
