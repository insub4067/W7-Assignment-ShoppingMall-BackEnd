const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Cart = require("../models/cart");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/register-Validater");
const fs = require("fs");
const app = express();
const router = express.Router();

// 카트조회
router.get("/list/:id", async(req, res) => {
    const { loginid } = req.params;
    const result = await Cart.find({loginid: loginid}).sort('-createdAt')
    res.send({result})

})

//카트추가 authMiddleware, 
router.post("/add", async(req, res) => {
    const { productname,  qunatity, username,loginid } = req.body;
    // const { username, loginid } = res.locals.user;
    
    const result = await Product.find({ productname: productname })
    const thumbnail = result[0].thumbnail
    const price = result[0].price
    const totalprice = price*qunatity 
    console.log(totalprice)
    
    const cart = new Cart({
        username,
        loginid,
        username,
        productname,
        price,
        thumbnail,
        qunatity,
        totalprice
    })

    await cart.save();
    const response = { productname, price, thumbnail }
    res.send({response})
})

//카트삭제 authMiddleware,
router.delete("/delete/:id", async(req, res) => {
    const cartId = req.params.id
    console.log(cartId)
    await Cart.findByIdAndDelete(cartId)
    res.send('success')
});

module.exports = router;