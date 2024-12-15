import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
			res.status(400).json({ msg: 'User already exists' });
			return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user', // Optional: set default role
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

interface PostKYCRequest extends Request {
    params: {
        id: string;
    };
    body: {
        kycData: any;
    };
}

export const postKYCForm = async (req: PostKYCRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { kycData } = req.body;

    try {
        // Find the user by ID
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        // Update KYC data
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { kycData },
        });

        res.status(200).json({ msg: 'KYC form submitted successfully', user: updatedUser });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
