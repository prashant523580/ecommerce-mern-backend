const Product = require("../models/product");
const slugify = require("slugify");
const category = require("../models/category");
const Page = require("../models/page");

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            quantity,
            category
        } = req.body;
        let productPicture = [];
        if (req.files.length > 0) {
            productPicture = req.files.map(file => {
                return {
                    img: file.filename
                }
            });
        }
        const product = await new Product({
            name,
            slug: slugify(name),
            price,
            description,
            productPicture,
            quantity,
            category,
            createdBy: req.user._id
        })
        const data = await product.save();
        if (data) {
            res.status(201).json({
                product
            })
        }
    } catch (err) {
        console.log(err)
    }
}

exports.getAllProduct = async (req, res) => {
    try {
        let products = await Product.find().populate("category","name");
        let page = await Page.find();
        if(products || page){

            res.status(200).json({
                products,
                page
            })
        }
    } catch (err) {
        res.status(422).json({
            err
        });
    }
}

exports.getProductBySlug = async (req, res) => {
    try {
        let {
            slug
        } = req.params;
        console.log(slug)
        let currentCategory = await category.findOne({
            slug
        }).select("_id type");
        // console.log(currentCategory)
        if (currentCategory) {
            let currentProducts = await Product.find({
                category: currentCategory._id
            });
            console.log(currentProducts)
            res.status(200).json({
                currentProducts,
                productByPrice: {
                    under5k: currentProducts.filter(product => product.price <= 5000),
                    under10k: currentProducts.filter(product => product.price > 5000 && product.price <= 10000),
                    under20k: currentProducts.filter(product => product.price > 10000 && product.price <= 20000),
                    under30k: currentProducts.filter(product => product.price > 20000 && product.price <= 30000),
                    under60k: currentProducts.filter(product => product.price > 40000 && product.price <= 60000),
                    above60k: currentProducts.filter(product => product.price > 60000 && product.price <= 300000)
                }
            })
        }
    } catch (err) {
        res.status(422).json(err);
    }
}

exports.deleteProductById = async (req, res) => {
    try {
        const {
            productId
        } = req.body;
        let deletedProduct = await Product.deleteOne({
            _id: productId
        });
        res.status(202).json({
            message: "product deleted successfully..."
        })
    } catch (err) {
        res.status(422).json(err);
    }
}

exports.getProductDetailsById = async (req, res) => {
    try {
        const {
            productId
        } = req.params;
        console.log(productId)
        if (productId) {
            let productDetails = await Product.findOne({
                _id: productId
            });
            if (productDetails) {
                res.status(200).json({
                    product: productDetails
                })
            } else {
                return res.status(400).json({
                    error: "Params required"
                });
            }
        }

    } catch (err) {
        res.status(400).json(err);
    }
}