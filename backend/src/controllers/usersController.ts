import { Request, Response } from 'express';
import prisma from '../config/db';

interface GetUserRequest extends Request {
    params: {
        id: string;
    };
}

export const getUser = async (req: GetUserRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Get all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err : any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};