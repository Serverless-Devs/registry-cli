import * as path from 'path';
import * as core from '@serverless-devs/core';
import * as _ from 'lodash';
import { createProgressBar } from './utils';
import { readLines, getFileHash } from './file';
import logger from './common/logger';

const { fse, colors, archiver } = core;
const { green, grey } = colors;


const isWindows: boolean = process.platform === 'win32';

export async function pack(file: string, codeignore: any, zipPath: any): Promise<any> {
  // const { zipPath } = await generateRandomZipPath();

  const { compressedSize } = await packTo(file, codeignore, zipPath);

  // get md5 of zip file and rename it with md5
  const zipFileHash = await getFileHash(zipPath);
  const zipPathWithMd5 = path.join(path.dirname(zipPath), `${path.basename(zipPath) || zipFileHash}`);
  await fse.rename(zipPath, zipPathWithMd5);

  return {
    filePath: zipPathWithMd5,
    fileSizeInBytes: compressedSize,
    fileHash: zipFileHash,
  };
}

async function packTo(file: string, codeignore: any, targetPath: string, prefix = '', zlibOptions = {}): Promise<any> {
  if (!(await fse.pathExists(file))) {
    throw new Error(`Zip file ${file} is not exist.`);
  }
  core.Logger.debug('FC-DEPLOY', `pack file is ${targetPath}, absFilePath is ${file}`);

  const stats = await fse.lstat(file);

  if (codeignore && codeignore(file)) {
    throw new Error(`File ${file} is ignored.`);
  }

  core.Logger.debug('FC-DEPLOY', `append ${stats.isFile() ? 'file' : 'folder'}: ${file}, absolute path is ${path.resolve(file)}`);

  const bar = createProgressBar(`${green(':zipping')} :bar :current/:total :rate files/s, :percent :etas`, { total: 0 });

  const output = fse.createWriteStream(targetPath);
  const zipArchiver = archiver('zip', {
    zlib: _.merge({
      level: 6,
    }, zlibOptions),
  }).on('progress', (progress) => {
    bar.total = progress.entries.total;
    bar.tick({
      total: progress.entries.processed,
    });
  }).on('warning', (err) => {
    logger.log(err, 'yellow');
  }).on('error', (err) => {
    logger.log(`    ${green('x')} ${targetPath} - ${grey('zip error')}`, 'red');
    throw err;
  });

  // copied from https://github.com/archiverjs/node-archiver/blob/master/lib/core.js#L834-L877
  // but add mode support
  zipArchiver.symlink = function (filepath, target, { mode }) {
    const data = Object.assign({}, {
      type: 'symlink',
      name: filepath.replace(/\\/g, '/'),
      linkname: target.replace(/\\/g, '/'),
      sourceType: 'buffer',
    });

    if (mode) {
      Object.assign(data, {
        mode,
      });
    }

    this._entriesCount++;
    this._queue.push({
      data,
      source: Buffer.alloc(0),
    });

    return this;
  };

  let count;

  zipArchiver.pipe(output);

  const asbFilePath = path.resolve(file);
  const isBootstrap = isBootstrapPath(asbFilePath, asbFilePath, true);

  if (stats.isFile()) {
    zipArchiver.file(asbFilePath, {
      name: path.basename(file),
      prefix,
      mode: (isBootstrap || isWindows) ? stats.mode | 73 : stats.mode, // add execution permission, the binary of 73 is 001001001
    });

    count = 1;
  } else if (stats.isDirectory()) {
    count = await zipFolder(zipArchiver, file, [], codeignore, file, prefix);
  } else {
    throw new Error(`File ${file} must be a regular file or directory.`);
  }

  return await new Promise((resolve, reject) => {
    output.on('close', () => {
      const compressedSize = zipArchiver.pointer();
      resolve({ count, compressedSize });
    });

    try {
      zipArchiver.finalize();
    } catch (err) {
      reject(err);
    }
  });
}

async function zipFolder(zipArchiver, folder, folders, codeignore, codeUri, prefix = '') {
  folders.push(folder);
  const absCodeUri = path.resolve(codeUri);
  const dir = path.join(...folders);
  const dirItems = await fse.readdir(dir);

  const absDir = path.resolve(dir);
  const relativeFromCodeUri = path.relative(absCodeUri, absDir);

  if (!_.isEmpty(relativeFromCodeUri)) {
    zipArchiver.append(null, {
      name: relativeFromCodeUri,
      type: 'directory',
      prefix,
    });
  }

  return (await Promise.all(dirItems.map(async (f) => {
    const fPath = path.join(dir, f);
    let s;

    try {
      s = await fse.lstat(fPath);
    } catch (error) {
      return 0;
    }
    if (codeignore && codeignore(fPath)) {
      core.Logger.debug('FC-DEPLOY', `file ${fPath} is ignored.`);
      return 0;
    }

    const absFilePath = path.resolve(fPath);
    const relative = path.relative(absCodeUri, absFilePath);

    const isBootstrap = isBootstrapPath(absFilePath, absCodeUri, false);
    if (s.size === 1067) {
      const content = await readLines(fPath);
      if (_.head(content) === 'XSym' && content.length === 5) {
        const target = content[3];
        zipArchiver.symlink(relative, target, {
          mode: (isBootstrap || isWindows) ? s.mode | 73 : s.mode,
        });
        return 1;
      }
    }

    if (s.isFile() || s.isSymbolicLink()) {
      zipArchiver.file(fPath, {
        name: relative,
        prefix,
        mode: (isBootstrap || isWindows) ? s.mode | 73 : s.mode,
        stats: s, // The archiver uses fse.stat by default, and pasing the result of lstat to ensure that the symbolic link is properly packaged
      });

      return 1;
    } else if (s.isDirectory()) {
      return await zipFolder(zipArchiver, f, folders.slice(), codeignore, codeUri, prefix);
    }
    logger.log(`Ignore file ${absFilePath}, because it isn't a file, symbolic link or directory`, 'red');
    return 0;
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  }))).reduce(((sum: any, curr: any) => sum + curr), 0);
}

function isBootstrapPath(absFilePath, absCodeUri, isFile = true) {
  let absBootstrapDir;
  if (isFile) {
    absBootstrapDir = path.dirname(absCodeUri);
  } else {
    absBootstrapDir = absCodeUri;
  }
  return path.join(absBootstrapDir, 'bootstrap') === absFilePath;
}