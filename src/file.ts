import readline from 'readline';
import md5File from 'md5-file';
import * as core from '@serverless-devs/core';

const { fse } = core;

export function readLines(fileName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const lines = [];

    readline.createInterface({ input: fse.createReadStream(fileName) })
      .on('line', (line) => lines.push(line))
      .on('close', () => resolve(lines))
      .on('error', reject);
  });
}

export async function getFileHash(filePath: string): Promise<string> {
  if (await isFile(filePath)) {
    return await md5File(filePath);
  }
  throw new Error(`Get file hash error, target is not a file, target path is: ${ filePath}`);
}

async function isFile(inputPath) {
  return await pathJudge(inputPath, 'isFile');
}

async function pathJudge(inputPath, type) {
  try {
    const stats = await fse.lstat(inputPath);
    switch (type) {
      case 'exists': return true;
      case 'isFile': return stats.isFile();
      case 'isDir': return stats.isDirectory();
      default: throw new Error('Unsupported type in pathJudge function.');
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

export async function getFileSize(filePath): Promise<number> {
  const stat = await fse.lstat(filePath);
  return stat.size;
}