import { util } from '@util/util';

export class AngularFilePath {
  private _filePath: string;
  private _projectRoot: string;
  private _sourceRoot: string;
  private _appPath: string;
  private _paths: string[];
  private _fileName: string;

  constructor(filePath: string, sourceRoot = 'src') {
    this._filePath = filePath;
    this._sourceRoot = sourceRoot;
    const parts = filePath.split('/');
    const partLen = parts.length;
    const srcIndex = parts.findIndex(part => part === sourceRoot);
    const last = parts[partLen - 1];

    this._projectRoot = parts.slice(0, srcIndex).join('/');
    this._appPath = parts[srcIndex + 1];

    if (util.isDirectory(last)) {
      this._fileName = null;
      this._paths = parts.slice(srcIndex + 1);
    } else {
      this._fileName = last;
      this._paths = parts.slice(srcIndex + 2, partLen - 1);
    }
  }

  get absolutePath(): string {
    return this._filePath;
  }

  get relativePathOfProject(): string {
    const paths = [this._appPath, this.relativePathOfApp];
    return paths.join('/');
  }

  get relativePathOfApp(): string {
    const paths = [...this._paths];
    if (this._fileName) {
      paths.push(this._fileName);
    }
    return paths.join('/');
  }

  get directoryOfApp(): string {
    return this._paths.join('/');
  }

  get fullFilePath(): string {
    return this._filePath;
  }

  equalTo(filePath: string): boolean {
    return this._filePath === filePath;
  }

  equalToAngularPath(filePath: AngularFilePath): boolean {
    return this._filePath === filePath.fullFilePath;
  }

  resolveFilePath(filename: string) {
    return util.resolvePaths(this._projectRoot, this._sourceRoot, this._appPath, this._paths, filename);
  }
}
