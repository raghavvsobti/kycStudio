import { Request, Response } from 'express';
import prisma from '../config/db';


export const getStats = async (req: Request, res: Response): Promise<void> => { 
    try {
        const [pendingKyc, ApprovedKyc, rejectedKyc, totalUsers] = await Promise.all([
            prisma.user.count({
                where: {
                    kycStatus: "pending"
                }
            }),
            prisma.user.count({
                where: {
                    kycStatus: "approved"
                }
            }),
            prisma.user.count({
                where: {
                    kycStatus: "rejected"
                }
            }),
            prisma.user.count(),
        ])

        res.status(200).json({
            msg: 'KYC status updated successfully!', stats: {
                pendingKyc,
                ApprovedKyc,
                rejectedKyc,
                totalUsers
        } });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}