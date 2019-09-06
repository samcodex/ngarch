
const forwardSlash = /([^:]\/)\/+/g;
export class SlashPath {
  slash: string;
  path: string;
  isForwardSlash: boolean;

  constructor(path: string) {
    this.path = path;
    this.isForwardSlash = forwardSlash.test(path);
    this.slash = this.isForwardSlash ? '\\' : '/';
  }

  resolve(...subPaths: string[]) {
    let path = this.path;

    subPaths.forEach(subPath => {
      path = this.resolveOne(path, subPath);
    });

    return path;
  }

  private resolveOne(path: string, subPath: string): string {
    let slash = path.endsWith(this.slash) ? '' : this.slash;
    slash = subPath.startsWith(this.slash) ? '' : slash;
    return path + slash + subPath;
  }
}
