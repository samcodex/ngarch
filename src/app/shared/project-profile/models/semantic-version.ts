
// https://semver.npmjs.com/
const tilde = {
  symbol: '~',
  description: 'include everything greater than a particular version in the same minor range'
};
const carat = {
  symbol: '^',
  description: 'include everything greater than a particular version in the same major range'
};
const range = '';

const symbols = /^(~|\^|=|>=?|<=?)/;

export interface SemanticVersion {
  prefix: string;
  major: number;
  minor: number;
  patch: number;
}

export class SemanticVersionClass {
  private semVer: string;

  private _prefix: string;
  private _major: number;
  private _minor: number;
  private _patch: number;

  constructor(semanticVersion: string) {
    this.semVer = semanticVersion;
    const result = parseSemantic(semanticVersion);

    this._prefix = result.prefix;
    this._major = result.major;
    this._minor = result.minor;
    this._patch = result.patch;
  }

  get semanticVersion(): string {
    return this.semVer;
  }

  get major(): number {
    return this._major;
  }

  get minor(): number {
    return this._minor;
  }

  get patch(): number {
    return this._patch;
  }

  get prefix(): string {
    return this._prefix;
  }
}

export function parseSemantic(semanticVersion: string): SemanticVersion {
  const [ first, second, third ] = semanticVersion.split('.');
  const minor = parseInt(second, 10);
  const patch = parseInt(third, 10);
  let major: number, prefix: string = null;
  if (symbols.test(first)) {
    prefix = first.match(symbols)[0];
    const ver = first.replace(symbols, '');
    major = parseInt(ver, 10);
  } else {
    major = parseInt(first, 10);
  }

  return { prefix, major, minor, patch };
}
