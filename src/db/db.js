const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongodb+srv://tripods:<password>@cluster0.oahmr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oahmr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    // mongoose.connect('mongodb://localhost:27017/ecommerce',{
    //     useNewUrlParser: true,
    //     useCreateIndex:true,
    //     useUnifiedTopology: true,
    //     useFindAndModify: false
    // })
    .then(() => {
        console.log("connected");
    }).catch((err) => {
        console.log(err)
    })