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
const { required } = require("joi");

//회원가입
router.post("/register", async (req, res) => {

  const { username, loginid, password, confirmPassword } = req.body;


  const schema = Joi.object({
    username: Joi.string()
    .min(2)
    .required(),
    loginid: Joi.string()
    .min(3)
    .pattern(new RegExp("^[a-zA-Z0-9]"))
    .required(),
    password: Joi.string()
    .min(4)
    .pattern(new RegExp())
    .required(),
  });

  const { error, value } = schema.validate({ username: username, loginid: loginid, password: password });

  if (error){ 
    res.status(400).send({
        errorMessage: '형식을 확인해 주세요.'
    })

    return;
  }

  if(password === username){
    res.status(400).send({
        errorMessage: "이름과 패스워드가 같습니다."
    })
    return;
  } 

  if(password !== confirmPassword){
    res.status(400).send({
        errorMessage: "패스워드가 일치하지 않습니다.",
    })
    return;
  }

  const existUsers = await User.find({
    $or : [ { loginid }],
  });
  if(existUsers.length) {
      res.status(400).send({
          errorMessage: "이미 가입된 닉네임 입니다." 
      });
      return;
  }


  const encryptedPassword = crypto.createHash('sha512').update(password).digest('base64'); //암호화 
  
  const user = new User({ username, loginid, password });
  user.password = encryptedPassword
  await user.save(); 
  res.status(201).send({ result: '회원가입이 완료되었습니다' });


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

  res.send({ userId: user.userId })

});


module.exports = router;
