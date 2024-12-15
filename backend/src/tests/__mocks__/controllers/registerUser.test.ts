import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { registerUser } from '../../../controllers/usersController';

// Mock the Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mPrismaClient),
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('registerUser', () => {
  let req: Partial<Request> | any;
  let res: Response | any;
  let prisma: PrismaClient;

  beforeEach(() => {
    // Mock the Request and Response objects
    req = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    // Initialize Prisma Client mock
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to reset state
  });

  it('should register a new user successfully', async () => {
    // Mock behavior for finding an existing user (should return null, meaning no user exists)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock bcrypt hash to return a dummy hashed password
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    // Mock behavior for creating a user in Prisma
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword123',
      role: 'user',
    });

    // Call the registerUser controller
    await registerUser(req as Request, res);

    // Check that the response status is 201 (created)
    expect(res.status).toHaveBeenCalledWith(201);
    // Check that the response contains the expected message and user data
    expect(res.json).toHaveBeenCalledWith({
      msg: 'User registered successfully',
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword123',
        role: 'user',
      },
    });
  });

  it('should return an error if the user already exists', async () => {
    // Mock behavior for finding an existing user (should return a user)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-id',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword123',
      role: 'user',
    });

    // Call the registerUser controller
    await registerUser(req as Request, res);

    // Check that the response status is 400 (bad request)
    expect(res.status).toHaveBeenCalledWith(400);
    // Check that the response contains the error message
    expect(res.json).toHaveBeenCalledWith({
      msg: 'User already exists',
    });
  });

  it('should return a 500 error if there is a server issue', async () => {
    // Mock behavior for finding an existing user (throws an error)
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Server error'));

    // Call the registerUser controller
    await registerUser(req as Request, res);

    // Check that the response status is 500 (internal server error)
    expect(res.status).toHaveBeenCalledWith(500);
    // Check that the response contains the error message
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Server error',
      error: 'Server error',
    });
  });
});
