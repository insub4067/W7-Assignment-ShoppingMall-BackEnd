const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Joi = require("joi");

const registerValidation = Joi.object({
  username: Joi.string()
  .min(2)
  .required(),
  loginid: Joi.string()
  .alphanum()
  .min(3)
  .pattern(new RegExp("^[a-zA-Z0-9]"))
  .required(), 
  password: Joi.string()
  .min(4)
  .trim()
  .required(), 
  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");




module.exports = async (req, res, next) => {

  try {
    
    //비밀번호 검사
    if(password !== confirmPassword){
      res.status(400).send({
          errorMessage: "패스워드가 일치하지 않습니다.",
      })
      return;
    }

    //아이디 중복 검사
    const exist_id = await User.findOne({ loginid });

    if (exist_id) {
      res.status(400).send({
        errorMessage: "이미 가입된 아이디 입니다.",
      });
      return;
    }

    //비밀번호, 아이디 중복 검사
    if(password === username){
      res.status(400).send({
          errorMessage: "이름과 비밀번호가 같습니다."
      })
      return;
  }

    next();
  } catch (err) {
    res.status(401).send({
      errorMessage: "요청한 형식이 올바르지 않습니다",
    });
    return;
  }
};