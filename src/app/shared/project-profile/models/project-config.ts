export interface ProjectConfig {
  root: any;
  app: any;
  main: any;
  options?: object; // {absolutePath: {root, app, main}}
}

export function isInvalidProjectConfig(config: ProjectConfig): boolean {
  return !config || !config.root || config.root === '' || config.root === '/';
}
