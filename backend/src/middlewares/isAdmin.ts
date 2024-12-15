import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void | any> => {
  try {
    const userId = req.body.user?.id || req.body.user?.userId

    if (!userId) {
      return res.status(400).json({ msg: 'User ID not found in request' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ msg: 'Not Authorized' });
    }
  } catch (error: any) {
    console.error('Error in isAdmin middleware:', error);
    return res.status(500).json({ msg: 'Server error', error: error.message || error });
  }
};

export default isAdmin;
