const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Review = require("../models/review");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/register-Validater");
const fs = require("fs");
const app = express();
const router = express.Router();


//리뷰추가
router.post("/add", authMiddleware, async(req, res) => {



})






module.exports = router;
