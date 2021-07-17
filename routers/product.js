const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/register-Validater");
const fs = require("fs");
const app = express();
const router = express.Router();

//썸네일 이미지 저장공간 지정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toLocaleString() + file.originalname);
    },
});

//썸네일 이미지 파일 형식 체크
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" ===
    file.mimetype === "image/png" || file.mimetype === "image/gif" ) {
        cb(null, true);
    } else {
        cb(new Error("이미지 파일 형식이 맞지 않습니다"), false);
    }
};

//썸네일 이미지 저장 
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

// Multer 초기세팅
//   const upload = multer({
//     dest: "./images/thumbnail"
// })

//썸네일, 디테일 이미 업로드
const images =  upload.fields([{ name: 'thumbnail' }, { name: 'detail_image', maxCount: 10 }])

//상품 전체 조회
router.get("/", async(req, res) => {

})


//상품 디테일 조회
router.get("/detail:id", async(req, res) => {

})


//상품 추가
router.post('/add', images, async (req, res) => {

    const { productname, price } = req.body

    const detail_images = [];

    const thumbnail = req.files['thumbnail'][0].path

    req.files['detail_image'].forEach( image => detail_images.push(image.path) )


    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dates = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const createdAt = `${year}년 ${month}월 ${dates}일 ${hours}:${minutes}`

    const product = new Product({
        productname,
        price,
        thumbnail,
        detail_images,
        createdAt,
    });

    await product.save();

    const result = { productname, price, thumbnail, detail_images, createdAt }
    result.productId = product.id;



    res.status(200).send({ result });

});

//상품수정
router.put('/edit/:id', async (req, res) => {

})

//상품삭제
router.delete("delete/:id", async (req, res) => {

})

module.exports = router;
