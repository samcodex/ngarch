export interface ArchEndPointList {
  ngArch: ArchEndPoint;
  projectConfig: ArchEndPoint;
  projectFiles: ArchEndPoint;
  projectInfo: ArchEndPoint;
}

export interface ArchEndPoint {
  path: string;
  output?: OutputType;
}

export enum OutputType {
  Json = 'json'
}
