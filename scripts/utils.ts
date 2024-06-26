import fs from 'node:fs';

export const existsPath = async (path: string) =>
  fs.promises
    .stat(path)
    .then(() => true)
    .catch(() => false);

export const createDirectory = async (directoryPath: string, fresh = true) => {
  if (fresh === true) {
    const exists = await fs.promises
      .stat(directoryPath)
      .then(() => true)
      .catch(() => false);
    if (exists) {
      await fs.promises.rm(directoryPath, { recursive: true });
    }
  }
  return await fs.promises.mkdir(directoryPath, { recursive: true });
};

export const getDirectoryFiles = async (directoryPath: string) => {
  if (await existsPath(directoryPath)) {
    const fileNames = await fs.promises.readdir(directoryPath);
    return fileNames;
  }
  return [];
};
