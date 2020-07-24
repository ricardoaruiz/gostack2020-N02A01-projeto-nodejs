import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  async saveFile(fileName: string): Promise<string> {
    fs.promises.rename(
      path.resolve(uploadConfig.tempDirectory, fileName),
      path.resolve(uploadConfig.uploadDirecotry, fileName),
    );
    return fileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    const file = path.resolve(uploadConfig.uploadDirecotry, fileName);
    try {
      await fs.promises.stat(file);
    } catch {
      return;
    }
    fs.promises.unlink(file);
  }
}
