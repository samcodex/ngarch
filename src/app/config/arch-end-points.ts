import { ArchEndPointList, OutputType } from './end-point-definition';

export const ArchEndPoints: ArchEndPointList = {
  ngArch: {
    path: 'ngarch'
  },
  projectConfig: {
    path: 'project-config'
  },
  projectFiles: {
    path: 'project-files',
    output: OutputType.Json
  },
  projectInfo: {
    path: 'project-info'
  }
};
