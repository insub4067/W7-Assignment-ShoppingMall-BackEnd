const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Joi = require("joi");

const registerValidation = Joi.object({
  username: Joi.string().email().required(),
  loginid: Joi.string().alphanum().min(3).trim().required(), //알파벳+숫자, 최소3자이상, 공백제거하고 받음
  password: Joi.string().min(4).trim().required(), //최소 4자이상, 공백제거하고 받음
  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");



//회원가입 벨리데이션
module.exports = async (req, res, next) => {

  try {
    console.log(req.body)
    
    if (loginid === password) {
      res.status(400).send({
        errorMessage: "아이디와 비밀번호는 동일하게 설정할 수 없습니다",
      });
    }

    // 아이디 중복검사
    const exist_id = await User.findOne({ loginid });

    if (exist_id) {
      res.status(400).send({
        errorMessage: "아이디가 중복되었습니다",
      });
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