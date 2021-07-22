const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Review = require("../models/review");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/register-Validater");
const fs = require("fs");
const { findById } = require("../models/review");
const app = express();
const router = express.Router();

//리뷰 이미지 저장공간 지정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images/review_image");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//리뷰 이미지 파일 형식 체크
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" ===
    file.mimetype === "image/png" || file.mimetype === "image/gif" ) {
        cb(null, true);
    } else {
        cb(new Error("이미지 파일 형식이 맞지 않습니다"), false);
    }
};

//리뷰 이미지 저장 
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});


//리뷰조회
router.get("/", async(req, res) => {

    const result = await Review.find().sort('-createdAt').limit(10)

    res.send({ result })

})


//리뷰 더조회
router.get("/more", async(req, res) => {

    const { beenViewed } = req.body

    const willSkip = (Number(beenViewed))

    const result = await Review.find().sort('-createdAt').skip(willSkip).limit(10)

    res.send({ result })

})


//리뷰추가
router.post("/add", authMiddleware, upload.single('review_image'), async(req, res) => {

    const { content, productname, star } = req.body;
    const { username, loginid } = res.locals.user;
    // const { content, productname, star, username, loginid } = req.body;

    const image = req.file;

    const result = await Product.find({ 'productname': productname })
    const thumbnail = result[0].thumbnail

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dates = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); 
    const seconds = date.getSeconds();

    const createdAt = `${year}년 ${month}월 ${dates}일 ${hours}:${minutes}:${seconds}`

    if(image){

        const review_image = req.file.path;


        const review = new Review({
            thumbnail,
            productname,
            username,
            loginid,
            content,
            star,
            review_image,
            createdAt,
        })
    
        await review.save();
    
        res.send({message: 'Success'})
    

    }

    const review = new Review({
        thumbnail,
        productname,
        username,
        loginid,
        content,
        star,
        createdAt,
    })

    await review.save();

    res.send({message: 'Success'})

})

//별점평균값 가져오기
router.get("/starAverage", async(req,res) => {

    const result = await Review.find()

    const totalReview = result.length

    var sum = 0

    result.forEach( review => sum += review.star) 

    const Average = sum / totalReview

    let average = Average.toString().slice(0,3)

    average *= 1

    res.send({ average })

})

//리뷰 게시글 총수 조회
router.get("/total", async(req,res) => {

    const result = await Review.find()

    const total = result.length

    res.send({ total })

})

//리뷰수정
//authMiddleware, res.locals.user
router.put("/edit/:id", upload.single('review_image'), async(req, res) => {

    const reviewId = req.params.id

    const { content, star } = req.body;

    const result = await Review.findById(reviewId)

    const image = req.file

    if(image){

        const review_image = req.file.path

        fs.unlinkSync(`./${result.review_image}`)

        Review.findByIdAndUpdate(reviewId, {review_image}).then()

    }

    await Review.findByIdAndUpdate(reviewId, {content, star})

    res.send({})

})

//리뷰삭제
//authMiddleware
router.delete("/delete/:id", async(req, res) => {

    const rewviewId = req.params.id

    await Review.findByIdAndDelete(rewviewId)

    res.send({})

});






module.exports = router;
