import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: string;
    email: string;
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.headers['authorization'];

    // Check if the token is provided
    if (!token) {
        return res.status(401).json({ msg: 'No token provided, authorization denied' });
    }

    // Bearer token extraction
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ msg: 'Invalid token format' });
    }

    jwt.verify(bearerToken, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }

        req.body.user = decoded as DecodedToken;
        next();
    });
};

export default isAuthenticated;
