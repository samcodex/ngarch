import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { IActionMapping, ITreeOptions } from 'angular-tree-component';
import { last } from 'lodash-es';
import { zip } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchEndPoints } from '@config/arch-end-points';
import { ProjectConfig, ProjectProfileService } from '@shared/project-profile';
import { RestService } from '@shared/services/rest/rest.service';
import { util } from '../../util/util';

@Component({
  selector: 'arch-explorer-dock',
  templateUrl: './explorer-dock.component.html',
  styleUrls: ['./explorer-dock.component.scss']
})
export class ExplorerDockComponent implements OnInit, OnDestroy {

  @Output() clickFileNode = new EventEmitter<string>();

  nodes: FileNode[] = [];

  options: ITreeOptions = {};

  private projectConfig: ProjectConfig;

  constructor(
    private rest: RestService,
    private profileService: ProjectProfileService
  ) { }

  ngOnInit() {
    const actionMapping: IActionMapping = {
      mouse: {
        click: (tree, node, $event) => {
          if (node.isLeaf) {
            this.clickFileNode.emit(node.id);
          }
        }
      }
    };

    zip(
      this.profileService.getProjectConfig(),
      this.rest.getWithReloader<string[]>(ArchEndPoints.projectFiles, false, true)
    )
    .pipe(
      takeUntilNgDestroy(this)
    )
    .subscribe( data => {
      const [config, files] = data;
      const root: FileNode = {
        id: config.app,
        name: `root (${config.app})`,
        isExpanded: true,
        hasChildren: true,
        children: []
      };

      const nodes = this.nodes = [root];
      createNode(root, config, root.children, files);

      this.projectConfig = config;
      this.options = {
        actionMapping: actionMapping
      };
    });
  }

  ngOnDestroy() {}

}

function createNode(root: FileNode, config: any, nodes: FileNode[], data: string[],
    folders: FolderNode = {} as any, index: number = 0) {

  const item: string = data[index];
  const node: FileNode = {
    id: item,
    name: item
  };

  let parent = findDirectory(folders, item);
  if (util.isDirectory(item)) {
    node.children = [];
    node.hasChildren = true;
    node.isExpanded = false;
    folders[node.id] = node;

    if (parent) {
      node.name = node.name.replace(util.toFolderPath(parent.id), '');
      parent.children.push(node);
    } else {
      node.name = index === 0 ? last(node.name.split('/')) : node.name.replace(util.toFolderPath(config.app), '');
      nodes.push(node);
    }
  } else {
    if (!parent) {
      parent = root;
    }

    node.name = node.name.replace(util.toFolderPath(parent.id), '');
    parent.children.push(node);
  }

  if (index < data.length - 1) {
    createNode(root, config, nodes, data, folders, ++index);
  }
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
