const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Review = require("../models/review");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/register-Validater");
const fs = require("fs");
const { findById } = require("../models/review");
const review = require("../models/review");
const app = express();
const router = express.Router();

const upload  = multer({ dest: './images/review_image' })


//리뷰조회
router.get("/", async(req, res) => {

    const { productname } = req.body;
    const result = await review.find({ productname: productname }).sort('-createdAt')

    res.send({ result })

})

//리뷰추가
router.post("/add", authMiddleware, upload.single('review_image'), async(req, res) => {

    const { content, productname } = req.body;
    const review_image = req.file.path;
    const { username, loginid } = res.locals.user;
    // const { content, productname, username, loginid } = req.body;


    const result = await Product.find({ productname: productname })
    const thumbnail = result[0].thumbnail

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dates = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const createdAt = `${year}년 ${month}월 ${dates}일 ${hours}:${minutes}:${seconds}`

    const review = new Review({
        thumbnail,
        productname,
        username,
        loginid,
        content,
        review_image,
        createdAt,
    })

    await review.save();

    res.send({})

})

//리뷰수정
router.put("/edit/:id", authMiddleware, async(req, res) => {

    const rewviewId = req.params.id

    const { content } = req.body;

    await Review.findByIdAndUpdate(rewviewId, {content})

    res.send({})

})

//리뷰삭제
router.delete("/delete/:id", authMiddleware, async(req, res) => {

    const rewviewId = req.params.id

    await Review.findByIdAndDelete(rewviewId)

    res.send({})

});






module.exports = router;
