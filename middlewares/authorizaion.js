import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyTokenSuperAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token, "===");

    if (!token) {
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.ADMIN_SECRET);
        if (decoded) next();
    } catch (error) {
        next(error);
    }
};

const verifyTokenHostelAdmin = (req, res, next) => {

    //   const data =JSON.parse( req.headers.authorization);

    //   console.log(data,"=====");

    //   const{token} = data


    //   console.log(token,"hello");


    const token = req.headers.authorization
    console.log(token,"+++ Hello +++");

    if (!token) {
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, {
            expiresIn: '3d',
          });
        if (decoded) {
            {
                req.user = decoded
                console.log(req.user,"wooooooooooow");
                next();
            }
        }

    } catch (error) {
        next(error)
    }
};

export default {
    verifyTokenSuperAdmin,
    verifyTokenHostelAdmin

}
