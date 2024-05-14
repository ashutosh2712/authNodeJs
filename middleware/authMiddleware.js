const jwt = require('jsonwebtoken')
var dotenv = require('dotenv')

dotenv.config()
const authenticateUser =(req,res,next) =>{
    const jwtToken = req.session.token;
  
    if(jwtToken){
        jwt.verify(jwtToken, `${process.env.SESSION_SECRET}`,(err,decodedToken) =>{
            if(err){
                return res.status(401).send('Unauthorized: Invalid token');
            }
            req.userId = decodedToken.userId;
            next()
        });
        
    }else if(req.user){
        next();
    }
    else {
        return res.status(401).redirect('/auth/login')
    }

    
}

module.exports = authenticateUser;

