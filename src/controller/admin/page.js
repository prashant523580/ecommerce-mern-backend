const Page = require("../../models/page");
const product = require("../../models/product");
const Category = require("../../models/category");

exports.createPage = async (req,res) => {
    try{
        const {banners,products} = req.files;
        if(banners.length > 0){
           req.body.banners =  banners.map((banner,ind) => ({
                img:`/public/${banner.filename}`,
                navigateTo: `banner?categoryId=${req.body.category}&type=${req.body.type}`
            }))
        }
        if(products.length > 0){
            req.body.products = products.map((product,ind) => ({
                img:`/public/${product.filename}`,
                navigateTo: `product?categoryId=${req.body.category}&type=${req.body.type}`
            }))
        }
        req.body.createdBy = req.user; 
        Page.findOne({category: req.body.category})
        .exec((error,page) => {
            if(error) return res.status(400).json({error});
            if(page){

                Page.findOneAndUpdate({category: req.body.category},req.body)
                .exec((error,updatedPage) => {
                    if(error) return res.status(400).json({error});
                    if(updatedPage){
                        return res.status(201).json({page: updatedPage});
                    }
                })
            }else{

                const createdPage =  new Page(req.body);
                 createdPage.save();
                // console.log(createdPage)
                    res.status(201).json({
                      page : createdPage
                    });
            }
        })
    }catch(err){
        console.log(err)
    }
}

exports.getPage = async(req,res) => {
    const {category,type} = req.params;
    const products = await product.find({category}).populate("category", "name");
    // console.log(category,products)
    if(type === "page"){
        Page.findOne({category:category})
        .exec((error,page) => {
            if(error) return res.status(400).json({error});
            if(page) return res.status(200).json({page,products});
        })
    }
}