const Category = require("../../models/category");
const Order = require("../../models/order");
const Page = require("../../models/page");
const Product = require("../../models/product")
function createCategories(categories,parentId = null){
    const categoryList = [];
    let category;
    if(parentId == null){
       category =  categories.filter(cat => cat.parentId == undefined);
    }else{
        category =categories.filter(cat => cat.parentId == parentId);
    }
    for(var cate of category){
        categoryList.push({
            _id : cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList;
}
exports.initialData = async(req,res) => {
    try{

        const categories = await Category.find({}).exec();
        const products = await Product.find({}).select('_id name category price quantity productPicture description slug')
        .populate({path : 'category', select : '_id name'}).exec();
        const page = await Page.find();
        const order = await Order.find({}).populate("items.productId", "name productPicture").populate("user","name").exec();
        res.status(200).json({
            categories : createCategories(categories),
            products,
            page
        }) 

    }catch(err){
        console.log(err)
    }
}