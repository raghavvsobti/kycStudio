import { Request, Response } from 'express';
import prisma from '../config/db';


export const getStats = async (req: Request, res: Response): Promise<void> => { 
    try {
        const [totalPending, totalApproved, totalRejected, totalUsers] = await Promise.all([
            prisma.user.count({
                where: {
                    kycStatus: { in: ["pending", "PENDING"] }
                }
            }),
            prisma.user.count({
                where: {
                    kycStatus:  { in: ["approved", "APPROVED"] }
                }
            }),
            prisma.user.count({
                where: {
                    kycStatus:  { in: ["rejected", "REJECTED"] }
                }
            }),
            prisma.user.count(),
        ])

        res.status(200).json({
            msg: 'Stats fetched Successfuly!', stats: {
                totalPending,
                totalApproved,
                totalRejected,
                totalUsers
        } });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
        console.log({ msg: 'Server error', error: err.message }, "getStats")
    }
}