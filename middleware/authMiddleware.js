const jwt = require('jsonwebtoken')
var dotenv = require('dotenv')

dotenv.config()
const authenticateUser = (req,res,next) =>{
    const jwtToken = req.session.token;
    const user = req.user;
    console.log("User:" , user)
    // console.log("Token: ", jwtToken)
    if(jwtToken){
        jwt.verify(jwtToken, `${process.env.SESSION_SECRET}`,(err,decodedToken) =>{
            if(err){
                return res.status(401).send('Unauthorized: Invalid token');
            }
            req.userId = decodedToken.userId;
            next()
        });
        
    }
    else if(user){
        console.log('user:' , user)
        next();
    }
    else {
        // console.log(req.user)
        return res.status(401).redirect('/auth/login')
    }

}

module.exports = authenticateUser;

