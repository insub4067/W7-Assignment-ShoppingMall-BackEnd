const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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




const userRouters = require("./routers/user")
app.use("/user", [userRouters])

const cartRouter = require("./routers/cart");
app.use("/cart", [cartRouter]);

const productRouter = require("./routers/product");
app.use("/product", [productRouter]);



app.listen(8080, () => {
    console.log("Server Ready");
});