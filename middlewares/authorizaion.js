import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyTokenSuperAdmin = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.ADMIN_SECRET);
        if (decoded) {
            {
                req.user = decoded
                next();
            }
        }
    } catch (error) {
        next(error);
    }
};

const verifyTokenHostelAdmin = (req, res, next) => {

    const token = req.headers.authorization

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
                next();
            }
        }

    } catch (error) {
        next(error)
    }
};

const verifyTokenStudent = (req, res, next) => {

    const token = req.headers.authorization;
    if (!token) {
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.USER_SECRET_KEY, {
            expiresIn: '3d',
        });
        if (decoded) {
            {
                req.user = decoded
                next();
            }
        }

    } catch (error) {
        next(error)
    }
};


export default {
    verifyTokenSuperAdmin,
    verifyTokenHostelAdmin,
    verifyTokenStudent

}
