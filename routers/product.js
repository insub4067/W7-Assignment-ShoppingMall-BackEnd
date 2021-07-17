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
        cb(null, "./images/thumbNail");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toLocaleString() + file.originalname);
    },
});

//썸네일 이미지 파일 형식 체크
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
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


// const upload = multer({
//     dest: "./images/thumbNail"
// })





module.exports = router;
