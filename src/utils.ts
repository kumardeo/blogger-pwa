import fs from 'node:fs';

export async function existsPath(path: string): Promise<boolean> {
  return fs.promises
    .stat(path)
    .then(() => true)
    .catch(() => false);
}

export async function createDirectory(directoryPath: string, fresh = true): Promise<string | undefined> {
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
}

export async function getDirectoryFiles(directoryPath: string): Promise<string[]> {
  if (await existsPath(directoryPath)) {
    return fs.promises.readdir(directoryPath);
  }
  return [];
}
