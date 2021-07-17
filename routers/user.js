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

//회원가입
router.post("/register", async (req, res) => {

  try {
        
    const { username, loginid, password, confirmPassword } = req.body;

    const encryptedPassword = crypto.createHash('sha512').update(password).digest('base64'); //암호화 
    
    const user = new User({ username, loginid, password });
    user.password = encryptedPassword
    await user.save(); 
    res.status(201).send({ result: '회원가입이 완료되었습니다' });

} catch(err) {
    console.log(err);
    res.status(400).send({
        errorMessage: '회원가입에 실패하였습니다 ',
    });

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

  res.send({ userId: user.userId })

});


module.exports = router;
