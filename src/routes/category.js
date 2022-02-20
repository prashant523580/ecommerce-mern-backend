const express = require("express");
const {
    authorize,
    adminMiddleware
} = require("../common/commonAuth");

const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controller/category");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"))
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname)
    }
})
const upload = multer({
    storage
});
router.post("/create", authorize, adminMiddleware, upload.single('categoryImage'), addCategory);
// router.post("/create", upload.single('categoryImage'), addCategory);
router.get("/getcategory", getCategories);
router.post("/update", authorize, adminMiddleware, upload.array('categoryImage'), updateCategory);
router.post("/delete", authorize, adminMiddleware, deleteCategory)
module.exports = router;