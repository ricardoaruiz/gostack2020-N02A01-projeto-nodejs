import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  async saveFile(fileName: string): Promise<string> {
    this.files.push(fileName);
    return fileName;
  }

  async deleteFile(path: string): Promise<void> {
    const fileIndex = this.files.findIndex(file => file === path);
    this.files.splice(fileIndex, 1);
  }
}
