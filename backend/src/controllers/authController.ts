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

        res.status(200).json({ token, user });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Assuming a stateless logout, the client should handle token removal.
            // If token invalidation is required, you can implement a token blacklist system.
        res.status(200).json({ msg: 'Successfully logged out' });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
