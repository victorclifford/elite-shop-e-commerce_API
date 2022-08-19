const Product = require("../models/productModel");
const { cloudinary } = require("../utils/cloudinary");
const mongoose = require("mongoose");

//* CTRAETE NEW PRODUCT
// here we create a new product using the product schema

const createProduct = async (req, res) => {
  try {
    //? Get THE CONTENTS OF INPUT FROM REQ.BODY
    //this will be for the text and number input fields
    const { prodName, prodDescription, prodCategory, prodPrice } = req.body;

    //? UPLOAD IMG TO CLOUDINARY
    // STEP1
    //upload image and save result in a var
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "elite-shop",
    });

    //STEP2
    // EXTRACT img url, and public_id from cloudinary (result)
    const prodImg = result.secure_url;
    const img_id = result.public_id;

    //STEP3
    // Add the exracted items to the list of data in the create collection
    const newProduct = await Product.create({
      prodName,
      prodDescription,
      prodCategory,
      prodPrice,
      prodImg,
      img_id,
    });

    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* GET ALL PRODUCTS
// here we query for all products from the database
const allProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* GET SINGLE PRODUCT
//here we query for single product from db by the product ID

const singleProduct = async (req, res) => {
  //? STEP1
  //get id to find product with from the req.params
  const { id } = req.params;
  try {
    //? STEP2
    // we need to check if ID is a valid mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid product ID!");
    }
    //? STEP3
    //using the findById method, we get the product, check if the product still exists in DB, and respond with the product
    const singleProduct = await Product.findById(id);
    if (!singleProduct) {
      return res
        .status(404)
        .send("this product does not exist or may have been deleted!");
    }
    res.status(200).json(singleProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//******************DELETE PRODUCT****************
const delProduct = async (req, res) => {
  try {
    const { id } = req.params;
    //checking if id of product is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid product ID!");
    }
    //extracting cloudinary public id
    const productToDel = await Product.findById({ _id: id });
    //now deleteing the product from db
    const deletedProd = await productToDel.remove();
    //now deleting img fro cloudinary if product was deleted from db
    await cloudinary.uploader.destroy(productToDel.img_id);
    //sending res if process was successful
    res.status(200).json({
      message: `product with ID: ${deletedProd._id}, was deleted successfully!`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//*****************Update Product*********

const updateProd = async (req, res) => {
  try {
    const { id } = req.params;
    // check if id is a valid mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid Product ID!");
    }

    if (req.file) {
      const prodToUpdt = await Product.findById({ _id: id });
      const uploadImg = await cloudinary.uploader.upload(req.file.path, {
        folder: "elite-shop",
      });
      await cloudinary.uploader.destroy(prodToUpdt.img_id);

      const prodImg = uploadImg.secure_url;
      const img_id = uploadImg.public_id;

      const updated = await Product.findByIdAndUpdate(
        { _id: id },
        { ...req.body, prodImg, img_id }
      );

      if (!updated) {
        res.status(404).send("this product no longer exists!");
      }

      res.status(200).json({ message: "product updated!" });
    } else {
      const updated = await Product.findByIdAndUpdate(
        { _id: id },
        { ...req.body }
      );

      //check if product still exists
      if (!updated) {
        res.status(404).json({ message: "this product no longer exists!!" });
      }

      //if update was successful send response
      res.status(200).json({ message: "product updated!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  allProducts,
  singleProduct,
  createProduct,
  delProduct,
  updateProd,
};
