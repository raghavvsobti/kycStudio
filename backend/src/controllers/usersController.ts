import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

interface RegisterRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}

export const registerUser = async (req: RegisterRequest, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
			res.status(400).json({ msg: 'User already exists' });
			return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user',
            },
        });

        res.status(201).json({ msg: 'User registered successfully', user });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export const loginUser = async (req: LoginRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


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