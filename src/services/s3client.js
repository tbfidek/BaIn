import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import sharp from 'sharp';

const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString('hex');
console.log(process.env.AWS_BUCKET_REGION)
// Create an Amazon S3 service client object.
let s3 = new S3Client({
    region:process.env.AWS_BUCKET_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY
    }
});

export async function uploadFile(file) {
    // console.log(process.env.AWS_BUCKET_NAME);
    const buffer = await sharp(file.buffer)
        .resize({ height: 600, width: 600, fit: 'cover' })
        .toBuffer();

    const imageName = randomImageName();

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
}

export async function getFile(imageName) {
    const input = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
    };
    const command = new GetObjectCommand(input);
    try {
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return url;
    } catch (err) {
        throw new Error(err);
    }
}