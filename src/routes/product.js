const express = require("express");
const {
    authorize,
    adminMiddleware
} = require("../common/commonAuth");
const Product = require("../models/product");
// const { addCategory, getCategories } = require("../controller/category");
const auth = require("../middleware/auth");
const multer = require("multer");
// const  upload = multer({dest: "uploads/"})
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const {
    createProduct,
    getAllProduct,
    getProductBySlug,
    deleteProductById,
    getProductDetailsById
} = require("../controller/product");
const fs = require("fs");
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname)
    }
});
// let source_path = path.dirname (__dirname);
let uploads = multer({
    storage
});
router.post("/create", authorize, adminMiddleware, uploads.array("productPicture"), createProduct);
router.get("/slug/:slug", getProductBySlug);
router.get("/:productId", getProductDetailsById);
router.delete("/delete", authorize, adminMiddleware, deleteProductById);
router.post("/getproduct", getAllProduct);
module.exports = router;