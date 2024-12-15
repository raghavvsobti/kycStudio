import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mockPrisma from '../prisma';
import { loginUser } from '../../../controllers/usersController';

jest.mock('../../../config/db', () => mockPrisma);

describe('loginUser Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 400 if user is not found', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        req.body = { email: 'test@example.com', password: 'password' };

        await loginUser(req as Request, res as Response);

        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    it('should return 400 if password is incorrect', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({
            email: 'test@example.com',
            password: await bcrypt.hash('correctpassword', 10),
        });
        req.body = { email: 'test@example.com', password: 'wrongpassword' };

        await loginUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    it('should return a JWT token for valid credentials', async () => {
        const hashedPassword = await bcrypt.hash('password', 10);
        mockPrisma.user.findUnique.mockResolvedValue({
            id: 'user-id',
            email: 'test@example.com',
            password: hashedPassword,
            role: 'user',
        });
        req.body = { email: 'test@example.com', password: 'password' };

        const mockToken = 'mockToken';
        jest.spyOn(jwt, 'sign').mockImplementation(() => mockToken);

        await loginUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });
});
