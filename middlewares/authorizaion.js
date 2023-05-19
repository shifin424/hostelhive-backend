import jwt from 'jsonwebtoken'


const verifyTokenSuperAdmin = (req,res,next)=>{
    const token = req.headers.authorizaion;
    if(!token){
        const error = new Error('No token provided')
        error.statuCode = 401;
        return next(error)
    }
    try{
        const decoded  = jwt.verify(token.split(' ')[1],process.env.ADMIN_SECRET)
        if(decoded) next();
    }catch(error){
        next(error)
    }
}

export default verifyTokenSuperAdmin