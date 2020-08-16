import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import { S3 } from 'aws-sdk';
import mime from 'mime';

import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_REGION,
    });
  }

  async saveFile(fileName: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tempDirectory, fileName);
    const contentType = mime.getType(originalPath);
    const fileContent = await fs.promises.readFile(originalPath);

    if (!contentType) {
      throw new Error('File not found');
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: fileName,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
        ContentDisposition: `inline filename=${fileName}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return fileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: fileName,
      })
      .promise();
  }
}
