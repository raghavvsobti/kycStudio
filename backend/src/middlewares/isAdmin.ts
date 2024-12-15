import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

const isAdmin = async(req: Request, res: Response, next: NextFunction) => {
	// check if the role is admin for the user
	try {
		await prisma.user.findFirst({
			where: {
				id: req?.body?.user?.id
			}
		})
	} catch (error) {
		console.log(error, "isAdmin");
	}
};

export default isAdmin;
