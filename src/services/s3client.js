import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';

const randomName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString('hex');


let s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

export async function uploadImage(file) {
    // console.log(process.env.AWS_BUCKET_NAME);
    if(file != null){
        const buffer = await sharp(file.buffer)
            .resize({ height: 600, width: 600, fit: 'cover' })
            .toBuffer();

        const imageName = randomName();

        const input = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: buffer,
            ContentType: file.mimetype,
        };
        try {
            await s3.send(new PutObjectCommand(input));
            return imageName;
        } catch (err) {
            throw new Error(err);
        }
    } else {
        return null;
    }
}

export async function uploadVideo(file) {
    if(file != null) {
        const fileName = randomName();
        const input = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            await s3.send(new PutObjectCommand(input));
            return fileName;
        } catch (err) {
            throw new Error(err);
        }
    }
    else {
        return null;
    }
}

export async function uploadPDF(file) {
    if(file != null) {
        const input = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: randomName(),
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            await s3.send(new PutObjectCommand(input));
            return input.Key;
        } catch (err) {
            throw new Error(err);
        }
    }
    else {
        return null;
    }
}

export async function getFile(fileName) {
    if (fileName != null){
        const input = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
        };
        const command = new GetObjectCommand(input);
        try {
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            return url;
        } catch (err) {
            throw new Error(err);
        }
    } else {
        return "";
    }
}
