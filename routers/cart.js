const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/register-Validater");
const fs = require("fs");
const app = express();
const router = express.Router();









module.exports = router;