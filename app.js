const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ejs = require("ejs");
const app = express();
const router = express.Router();



mongoose.connect("mongodb://localhost:27017/epimint", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // user: 'test',
    // pass: 'test',
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use(
    cors({
        // origin: "",
        origin: '*'
    })
);

app.get("/", async (req, res) => {
    res.send("Server Ready");
});

app.use(express.urlencoded({ extended: false }), router);
app.use(express.json());
app.use("/images", express.static("images"));

//뷰세팅
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//ejs렌더
app.get('/addProduct', (req, res) => {
    let name = req.query.name;
    res.render('addProduct', { name });
})

//라우터 연결
const userRouters = require("./routers/user")
app.use("/user", [userRouters])

const cartRouter = require("./routers/cart");
app.use("/cart", [cartRouter]);

const productRouter = require("./routers/product");
app.use("/product", [productRouter]);

const reviewRouters = require("./routers/review")
app.use("/review", [reviewRouters])

app.listen(8080, () => {
    console.log("Server Ready");
});