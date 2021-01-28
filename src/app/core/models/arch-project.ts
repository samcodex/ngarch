import { NameValue } from './name-value';
import { parseSemantic, SemanticVersion } from '@shared/project-profile/models/semantic-version';

export interface ProjectInfo {
  name: string;
  version: string;
  description: string;
  dependencies: NameValue[];
}

export const versionList = ['angular', 'rxjs', 'lodash', 'lodash-es', 'material', 'jquery', 'bootstrap', 'typescript', 'protractor', 'karma', 'jasmine'];

export function getDependencyVersion(projectInfo: ProjectInfo, depName: string): SemanticVersion {
  const { dependencies } = projectInfo;
  const dep = dependencies.find(dependency => dependency.name === depName);
  return parseSemantic(dep.value);
}
