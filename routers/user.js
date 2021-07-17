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

  const { username, loginid, password, confirmPassword, address } = req.body;


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
  
  const user = new User({ username, loginid, password, address });
  user.password = encryptedPassword
  await user.save(); 
  res.status(201).send({ result: '회원가입이 완료되었습니다' });


});

const loginValidater = Joi.object({
  loginid: Joi.string().required(),
  password: Joi.string().min(4).required(),
});

//로그인
router.post('/login', async (req, res) => {

  try {
        
    const { loginid, password } = await loginValidater.validateAsync(req.body);
    const encryptedPassword = crypto.createHash('sha512').update(password).digest('base64'); 
    const user = await User.findOne({ $and : 
        [{ loginid: loginid}, {password : encryptedPassword }] })    

    if (!user) {
        res.status(401).send({ errorMessage: '로그인에 실패했습니다. ' });
        return;
    }
    const token = jwt.sign( //토큰 발급
        { email: user.email, nickname: user.nickname, userId: user.userId },
        secretKey
    ); 

    res.send({
        token,
    });
} catch (err) {
    console.log(err);
    res.status(400).send({
        errorMessage: '로그인에 실패하였습니다. ',
    });
}
});

//중복확인 
router.post("/checkDup", async(req, res) => {

  const checkId = req.body.checkId
  
  const result = await User.find({ "loginid": checkId })

  if(result == ""){
    res.status(200).end()
  }

  if(result !== ""){
    res.status(400).send({ errorMessage: '이미 가입된 아이디 입니다.' })
  }

});




//토큰확인
router.get('/auth', authMiddleware, async (req, res) => {

  const user = res.locals.user;

  res.send({ loginid: user.loginid })

});


module.exports = router;
