import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const destinationDirectory = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tempDirectory: string;
  uploadDirecotry: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {
      url: string;
    };
    aws: {
      url: string;
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tempDirectory: destinationDirectory,
  uploadDirecotry: path.resolve(destinationDirectory, 'upload'),

  multer: {
    storage: multer.diskStorage({
      destination: destinationDirectory,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;
        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {
      url: process.env.APP_API_URL,
    },
    aws: {
      url: process.env.AWS_BUCKET_URL,
      bucket: process.env.AWS_BUCKET,
    },
  },
} as IUploadConfig;
