const jwt = require('jsonwebtoken')
var dotenv = require('dotenv')
dotenv.config()
const authenticateUser =(req,res,next) =>{
    const token = req.session.token;
  
    if(!token){
        return res.status(401).redirect('/auth/login')
    }

    jwt.verify(token, `${process.env.SESSION_SECRET}`,(err,decodedToken) =>{
        if(err){
            return res.status(401).send('Unauthorized: Invalid token');
        }
        req.userId = decodedToken.userId;
        next()
    });
    
}

module.exports = authenticateUser;

