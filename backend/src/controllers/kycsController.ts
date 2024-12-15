import { Request, Response } from 'express';
import { uploadFile, uploadToCloudinary } from '../cloudinary';
import prisma from '../config/db';


interface PostKYCRequest extends Request {
    params: {
        id: string;
    };
    body: {
        kycData: any;
        // file: Express.Multer.File;
    };
}


export const postKYCForm = async (req: PostKYCRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    // Use multer to handle file upload
    uploadFile(req, res, async (err: any) => {
        if (err) {
            res.status(400).json({ msg: 'File upload error', error: err.message });
            return;
        }

        try {
            // Parse kycData from the request body
            const kycData = JSON.parse(req.body.kycData || '{}');

            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                res.status(404).json({ msg: 'User not found' });
                return;
            }

            // Upload file to Cloudinary
            let fileUrl = '';
            if (req.file) { // Use req.file provided by multer
                const uploadResult = await uploadToCloudinary(req.file);
                fileUrl = uploadResult.secure_url; // Cloudinary URL of the uploaded file
            }

            // Update the user with KYC data and file URL
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    kycData: {
                        ...kycData,
                        fileUrl,
                    },
                },
            });

            res.status(200).json({
                msg: 'KYC form submitted successfully!',
                user: updatedUser,
            });
        } catch (err: any) {
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    });
};



interface UpdateKycRequest extends Request { 
    params: {
        id: string;
    };
    body: {
        status: string;
    };
}

export const updateKycStatus = async (req: UpdateKycRequest, res: Response): Promise<void> => { 
    const { id } = req.params;
    const { status } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { kycStatus: status },
        });

        res.status(200).json({ msg: 'KYC status updated successfully!', user: updatedUser });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}