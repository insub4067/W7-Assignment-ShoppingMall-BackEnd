const jwt = require("jsonwebtoken");
const User = require("../models/user");


module.exports = async(req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");

    if(tokenType !== 'Bearer'){
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요'
        });
        return;
    };


    try {
        const { userId } = jwt.verify(tokenValue, "MintChoco")
        const foundUser = await User.findOne({userId})
        res.locals.user = foundUser;
        next();
        
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요' 
            });   
            return;
    }

};