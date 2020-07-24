import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const destinationDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tempDirectory: destinationDirectory,
  uploadDirecotry: path.resolve(destinationDirectory, 'upload'),
  storage: multer.diskStorage({
    destination: destinationDirectory,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
