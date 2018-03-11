import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { zip } from 'rxjs/observable/zip';
import { TREE_ACTIONS, IActionMapping, ITreeOptions } from 'angular-tree-component';

import { ProjectFilesService } from '../../shared/services/project-files/project-files.service';
import { ProjectConfigService } from './../../shared/services/project-config/project-config.service';

@Component({
  selector: 'arch-explorer-dock',
  templateUrl: './explorer-dock.component.html',
  styleUrls: ['./explorer-dock.component.scss']
})
export class ExplorerDockComponent implements OnInit {

  @Output() clickFileNode = new EventEmitter<string>();

  nodes: FileNode[] = [];

  options: ITreeOptions = {};

  constructor(
    private projectFiles: ProjectFilesService,
    private projectConfig: ProjectConfigService
  ) { }

  ngOnInit() {
    const actionMapping: IActionMapping = {
      mouse: {
        click: (tree, node, $event) => {
          if (node.isLeaf) {
            this.clickFileNode.emit(node.id.replace('..', ''));
          }
        }
      }
    };

    zip(
      this.projectConfig.getData(),
      this.projectFiles.getData()
    ).subscribe( data => {
      const config = data[0];
      const files: string[] = data[1];
      const root: FileNode = {
        id: config.app,
        name: `root (${config.app})`,
        isExpanded: true,
        hasChildren: true,
        children: []
      };

      const nodes = this.nodes = [root];
      createNode(root, config, root.children, files);

      this.options = {
        actionMapping: actionMapping
      };
    });
  }

}

function createNode(root: FileNode, config: any, nodes: FileNode[], data: string[],
    folders: FolderNode = {} as any, index: number = 0) {

  const item: string = data[index];
  const node: FileNode = {
    id: item,
    name: item
  };

  let parent = findDirectory(folders, item);
  if (isDirectory(item)) {
    node.children = [];
    node.hasChildren = true;
    node.isExpanded = false;
    folders[node.id] = node;

    if (parent) {
      node.name = node.name.replace(toFolderPath(parent.id), '');
      parent.children.push(node);
    } else {
      node.name = node.name.replace(toFolderPath(config.app), '');
      nodes.push(node);
    }
  } else {
    if (!parent) {
      parent = root;
    }

    node.name = node.name.replace(toFolderPath(parent.id), '');
    parent.children.push(node);
  }

  if (index < data.length - 1) {
    createNode(root, config, nodes, data, folders, ++index);
  }
}

const extensions = ['html', 'ts', 'scss', 'htm', 'css'];
function isDirectory(file: string): boolean {
  const ext = file.split('.').pop();
  return extensions.indexOf(ext) === -1;
}

function toFolderPath(path) {
  const last = path.substr(path.length - 1);
  return (last === '/') ? path : path + '/';
}

function findDirectory(folders: FolderNode, fileName: string ): FileNode {
  const paths = fileName.split('/');
  const path = paths.slice(0, paths.length - 1).join('/');
  return folders[path] ;
}

interface FolderNode {
  [folder: string]: FileNode;
}

interface FileNode {
  id?: string;
  name: string;
  isExpanded?: boolean;
  hasChildren?: boolean;
  children?: FileNode[];
}
