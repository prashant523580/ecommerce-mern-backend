const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
dotenv.config();
const PORT = process.env.PORT|| 5000;
require("./db/db");
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth")
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialData = require("./routes/admin/initialData");
const PageRoute = require("./routes/admin/page");
const addressRoute = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/admin.order");
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD,OPTIONS, PUT, PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin",
    "X-Requested-With", "Content-Type", "Accept")
    res.header("Cross-Origin-Resource-Policy", "Same-Origin")
    next()
})
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use("/public/", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialData);
app.use("/api/page", PageRoute);
app.use("/api", addressRoute);
app.use("/api", orderRoutes);
app.use("/api",adminOrderRoute);
app.listen(PORT,() => {
    console.log(`listening port to ${PORT}`);
})