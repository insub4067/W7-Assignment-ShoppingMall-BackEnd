const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/register-Validater");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const secretKey = 'MintChoco';
const User = require("../models/user");
const crypto = require('crypto');


const postUserschema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9]/)
    .min(3)
    .required(),

  loginid: Joi.string()
      .regex(/^[a-zA-Z0-9]/)
      .min(3)
      .required(),

  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]/)
    .min(6)
    .required(),

});

router.post("/register", async (req, res) => {
try {

  const { loginid, username, password } =
  await postUserschema.validateAsync(req.body);

  const { passwordconfirm } = req.body;

  if (password !== passwordconfirm) {
      res.status(400).send({errorMessage: '비밀번호가 일치하지 않습니다.'})
      return;
  } 

  const existUser = await User.find({
  $and: [{ $or: [{ username }, { loginIid }] }],
  });
  if (existUser.length) {
      return res.status(400).send({errorMessage: '이미 가입된 닉네임 혹은 아이디입니다.'})
  }

  await User.create({ loginid, username, password });
  return res.status(201).send({message: '회원가입을 축하합니다.'})
  
} catch (err) {

  const error = err.message;
  console.log(error);
  res.status(400).send({message: '회원가입 양식이 올바르지 않습니다.'})

}
});

//로그인
router.post('/login', authMiddleware, async (req, res) => {

    try {
        const { loginid, password } = req.body;
        const user = await User.findOne({
          loginid,
          password,
        });
        if (!user) {
          return res.status(400).send({
            errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
          });
        }

        // 토큰 생성
        const userInfo = { userId: user._id, login: user.loginid, usernmae: user.username };

        const token = jwt.sign(userInfo, secretKey);
        
        res.send({ token });
      } catch (err) {
        console.error(err);
        res.status(400).send({
          errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
        });
      }

});

//토큰확인
router.get('/auth', authMiddleware, async (req, res) => {

  const user = res.locals.user;

  res.send({ userId : user.userId })

});


module.exports = router;
