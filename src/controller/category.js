const Category = require("../models/category")
const slugify = require("slugify");
const category = require("../models/category");
const shortid = require("shortid");
exports.addCategory = async (req, res) => {
    try {
        let currentCategory = req.body.name;
        let existedCategory = await Category.findOne({
            name: currentCategory
        });
        let categoryObj;
        let categoryUrl;
        if (existedCategory) {
            res.status(400).json({
                message: 'already exist category',
                existedCategory
            });
        } else {
            categoryObj = {
                name: req.body.name,
                slug: `${slugify(req.body.name)}-${shortid.generate()}`
            }
            if (req.file) {
                // categoryUrl = process.env.API + '/public/' + req.file.filename;

                categoryUrl = '/public/' + req.file.filename;
                categoryObj.categoryImage = categoryUrl;
            }

            if (req.body.parentId) {
                categoryObj.parentId = req.body.parentId;
            }
            const cate = await new Category(categoryObj);
            const newCategory = await cate.save();
            res.status(201).json({
                message: "success",
                category: newCategory
            })
        }
    } catch (err) {
        res.status(422).json({
            err
        });
    }
}

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId);
    }
    for (var cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList;
}
exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        // console.log(categories)
        if (categories) {
            const categories_list = createCategories(categories);
            res.status(200).json(categories_list);
        }
    } catch (err) {
        res.status(422).json({
            error: "error"
        })
    }
}
exports.updateCategory = async (req, res) => {
    const {
        _id,
        name,
        parentId,
        type
    } = req.body;
    console.log({
        _id,
        name,
        parentId,
        type
    })
    const updatedCategories = [];
    if (name instanceof Array) {
        for (var i = 0; i < name.length; i++) {
            const category = {
                name: name[i],
                type: type[i]
            }
            if (parentId[i] !== "") {
                category.parentId = parentId[i];
            }
            let updatedCategory = await Category.findOneAndUpdate({
                _id: _id[i]
            }, category, {
                new: true
            });
            updatedCategories.push(updatedCategory);
        }
        return res.status(201).json({
            updatedCategories
        });

    } else {
        const category = {
            name,
            type
        };
        if (parentId !== "") {
            category.parentId = parentId
        }
        let updatedCategory = await Category.findOneAndUpdate({
            _id
        }, category, {
            new: true
        });
        return res.status(201).json({
            updatedCategory
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const {
            payload
        } = req.body;
        let ids = payload.categoriesId;
        let deletedCategory = [];
        for (var i = 0; i < ids.length; i++) {
            const isDeletedCategory = await category.findOneAndDelete({
                _id: ids[i]._id
            });
            deletedCategory.push(isDeletedCategory);
        }
        if (ids.length === deletedCategory.length) {
            res.status(200).json({
                message: "deleted categories successfully.."
            });
        }

    } catch (err) {
        res.status(422).json(err);
    }
}