import { ArchNgPonent, ArchNgPonentInjectable, ArchNgPonentModule, ModuleTypeReferences, NgModuleMetadata, ArchNgPonentComponent, ArchPonentIssue } from '@core/arch-ngponent';
import { ModuleTypeNgPonent } from '@core/arch-ngponent/arch-ngponent-config';
import { RelationshipType } from '@core/arch-relationship/relationship-definition';
import { ArrayObject } from '@core/ArrayObject';
import { NgPonentFeature, NgPonentType, Ponent, PonentsRelation, TsPonent, TsPonentType, PonentHelper, createNgPonent } from '@core/ngponent-tsponent';
import { isArchModule, isArchService } from '@core/arch-ngponent/arch-ngponent';
import { ArchNgPonentRoutes } from '@core/arch-ngponent/arch-ngponent-routes';
import { ArchNgPonentLoadingGroup, LoadingGroups } from './arch-loading-group';
import { PonentRelationBuilder } from './ponent-relation-builder';
import { ArchResolver } from '../resolver/arch-resolver';
import { groupPonents, PonentGrouper } from './ponent-grouper';
import { mapOfArchTreeBuilder } from '@shared/arch-ngponent-store/arch-tree/arch-tree-config';
import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';
import { ModuleIdentifier } from '@shared/arch-ngponent-store/resolver/arch-resolver-definition';
import { ArchTree } from '@core/arch-tree/arch-tree';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { util } from '@util/util';
import { parseThroughRoutes } from '../parsers/parser-through-routes';

const typesOfTsMembers = [ TsPonentType.VariablePonent, TsPonentType.ImportPonent, TsPonentType.FunctionPonent ];

// TODO, replace find with PonentId
function tryFindByName<T extends {name, fileName?}>(ponents: T[], name: string, fileName?: string): T {
  const members = ponents.filter(ponent => ponent.name === name);
  if (members && (members.length === 1 || fileName)) {
    return members.length === 1 ? members[0] : members.find(member => member.fileName === fileName);
  }

  return null;
}
const findByModuleId = (moduleId: ModuleIdentifier) =>
  (ponent: ArchNgPonent): boolean =>
    ponent.fileName === moduleId.moduleFile && ponent.name === moduleId.moduleName;

const filterByPonentType = (ponentType: NgPonentType) =>
  (ponent: ArchNgPonent): boolean => ponent.ngPonentType === ponentType;

export class ArchStoreData {
  private _data: ArchNgPonent[] = [];

  // import resolver
  private _archResolver = new ArchResolver(this);

  // This is tree, the roots are the modules of eager-loading and lazying-loading
  private _loadingGroups: LoadingGroups = {};

  // NgModule
  private _featureModulePonents: Array<ArchNgPonentModule> = new Array();

  // NgModule/Component/Directive/Injectable/Pipe
  private _moduleTypePonents: Array<ArchNgPonent> = new Array();

  // route data ngponents
  private _routeData: ArchNgPonentRoutes[] = [];

  // model ngponents
  private _modelPonents: ArrayObject<ArchNgPonent> = new ArrayObject();

  // other typescript ponents
  private _tsElements: TsPonent[] = [];

  // one archTree describes the relation between ArchNgPonent(sss)
  private _archTrees: { [key in ArchTreeType]? : ArchTree | ArchTree[] } = {};

  constructor() { }

  // ModelTypePonents
  get modelTypePonents(): ArrayObject<ArchNgPonent> {
    return this._modelPonents;
  }

  // RouteTypePonents
  get routeTypePonents(): ArchNgPonentRoutes[] {
    return this._routeData;
  }

  get isEmpty(): boolean {
    return this._data.length === 0;
  }

  // tsMembers
  get tsMembers(): TsPonent[] {
    return this._tsElements;
  }

  // archTress
  getArchTree(treeType: ArchTreeType): ArchTree {
    return this._archTrees ? this._archTrees[treeType] as ArchTree : null;
  }

  // find method
  findPonentByFileName(fileName: string): ArchNgPonent[] {
    return this._data.filter(ponent => ponent.fileName === fileName);
  }

  // find ponent by name
  findPonentByName(ponentName: string, ponentFile: string): ArchNgPonent {
    return this._data.find(item => item.name === ponentName && item.fileName === ponentFile);
  }

  findPonentByModuleId(moduleId: ModuleIdentifier): ArchNgPonent {
    return this.findPonentByName(moduleId.moduleName, moduleId.moduleFile);
  }

  filterByPonentType(ponentType: NgPonentType): ArchNgPonent[] {
    return this._data.filter(filterByPonentType(ponentType));
  }

  findComponentByModuleId(moduleId: ModuleIdentifier): ArchNgPonentComponent {
    return this.filterByPonentType(NgPonentType.Component).find(findByModuleId(moduleId));
  }

  tryFindPonentByName(name: string, fileName?: string): ArchNgPonent {
    return tryFindByName(this._data, name, fileName);
  }

  findPonentAndSpecificDependencies(name: string, relationshipType: RelationshipType[]): ArchNgPonent[] {
    const archNgPonent = this.tryFindPonentByName(name);
    if (archNgPonent) {
      return archNgPonent.getSelfAndSpecificDependencies(relationshipType);
    } else {
      return null;
    }
  }

  findPonentAndDependenciesByName(name: string, isDirectedDependencies: boolean = true): ArchNgPonent[] {
    const archNgPonent = this.tryFindPonentByName(name);
    if (archNgPonent) {
      return isDirectedDependencies
        ? archNgPonent.getSelfAndDependencies()
        : archNgPonent.getSelfAndAllDependenciesInDeep();
    } else {
      return null;
    }
  }

  // LoadingGroups
  getImportedPonentsFromLoadingGroup(): ArchNgPonentLoadingGroup[] {
    return Object.values(this._loadingGroups)
      .sort( (group1, group2) => group1.isBootstrapGroup === group2.isBootstrapGroup ? 0 : group1.isBootstrapGroup ? -1 : 1 );
  }

  getRootModulesOfLoadingGroup(): ArchNgPonent[] {
    return this.getImportedPonentsFromLoadingGroup()
      .map(group => group.archNgPonents)
      .filter(ngPonents => ngPonents.filter(ngPonent => ngPonent.isRootOfLoadingGroup))
      .map(twoDimension => twoDimension[0]);
  }

  getAllPonentsByLoadingGroupName(groupName: string): ArchNgPonent[] {
    const loadingGroups = this._loadingGroups;
    if (loadingGroups.hasOwnProperty(groupName)) {
      return loadingGroups[groupName].archNgPonents;
    } else {
      return null;
    }
  }

  getMainNgModuleName(): string {
    const groups = Object.values(this._loadingGroups);
    const ngPonent = groups.find(group => group.isBootstrapGroup);
    return ngPonent.ngPonentName;
  }

  // ModuleTypePonents
  getAllDataFromModuleTypePonents(): ModuleTypeNgPonent[] {
    return this._moduleTypePonents.sort(ArchNgPonent.sort);
  }

  getAllServicesFromModuleTypePonents(): ArchNgPonentInjectable[] {
    return this._moduleTypePonents
      .filter(isArchService);
  }

  getBootstrapModule(): ArchNgPonentModule {
    return this._featureModulePonents.find(archNgPonent => archNgPonent.isBootstrapModule);
  }

  getRootRoutePonent() {

  }

  tryFindModulePonentByName(name: string, fileName?: string): ArchNgPonent {
    return tryFindByName(this._moduleTypePonents, name, fileName);
  }

  tryFindArchRoutePonentByName(name: string, fileName?: string): ArchNgPonentRoutes {
    return tryFindByName(this._routeData, name, fileName);
  }

  filterImportPonents(fileName: string): TsPonent[] {
    return this._tsElements.filter(tsPonent => tsPonent.fileName === fileName
      && tsPonent.ponentType === TsPonentType.ImportPonent);
  }

  tryFindTsMemberByName(name: string, fileName?: string): TsPonent {
    return tryFindByName(this._tsElements, name, fileName);
  }

  resolveArchNgPonent(hostFilename: string, name: string): ArchNgPonent {
    return this._archResolver.resolveArchNgPonent(hostFilename, name);
  }

  public cleanStoreData() {
    this._data.length = 0;
    this._featureModulePonents.length = 0;
    util.clearObject(this._loadingGroups);
    this._moduleTypePonents.length = 0;
    this._routeData.length = 0;
    this._modelPonents.clear();
    this._tsElements.length = 0;
    this._archResolver.clear();
    Object.keys(this._archTrees).forEach(key => {
      util.clearObject(this._archTrees[key]);
    });
  }

  public updateStoreData(ponents: Ponent[], projectName: string): ArchStoreData {
    this.cleanStoreData();

    if (!ponents) {
      return this;
    }

    // Core - 2
    // append the new ArchNgPonent to store
    const updateForNewArchNgPonent = (ngponentItem: ArchNgPonent) => {
      // update store's data
      this._data.push(ngponentItem);
      // create loadingGroups
      this.createLoadingGroup(ngponentItem);
      // update store's references: module, routeData, service, model
      this.updateReferences(ngponentItem);
    };

    // Core - 1
    // convert GroupItem into ArchNgPonent, adding ArchNgPonent to its purpose.
    const convertGroupItemToArchNgPonent = (groupItem: PonentGrouper) => {
      // create ArchNgPonent
      const ngponentItem: ArchNgPonent = groupItem.convertToArchNgPonent(typesOfTsMembers);

      if (ngponentItem) {
        updateForNewArchNgPonent(ngponentItem);
      } else if (typesOfTsMembers.includes(<any>groupItem.ponentType)) {
        this._tsElements.push(groupItem.tsPonent);
      }
    };

    // Core - 0,
    const groupers = groupPonents(ponents);
    groupers.forEach(convertGroupItemToArchNgPonent);

    // update TsPonent resolver
    this._archResolver.updateIndex(this._tsElements);

    // update store's loadingGroups
    this.updateLoadingGroups();

    // update relationship
    const ponentRelationBuilder = new PonentRelationBuilder(this, this._data);
    ponentRelationBuilder.updateRelationship();

    // routes' related ponents, lazy loading, such as loadChildren
    this._routeData.forEach(createRouteArchNgPonent);

    // The routes didn't declare data type, so the server cannot catch it
    // have to dynamic create its NgPonent here
    const createRoutesArchPonent = (routesTsPonent: TsPonent) => {
      // create NgPonent for routes TsPonent and its children(route TsPonent)
      const ngPonent = createNgPonent(routesTsPonent, NgPonentType.Routes);
      routesTsPonent.members[0].members.forEach(member => {
        member.ngPonent = createNgPonent(member, NgPonentType.Route);
      });

      // create new ArchNgPonentRoutes
      const routesArchPonent = new ArchNgPonentRoutes(routesTsPonent.name, ngPonent, routesTsPonent);
      const suggestion = 'Please indicate the data type, such as \'Routes | Route[]\'';
      routesArchPonent.appendIssue(ArchPonentIssue.NoDataType, suggestion);

      // update store data
      updateForNewArchNgPonent(routesArchPonent);
      // convert ArchNgPonentRoutes' children into ArchNgPonentRoute
      createRouteArchNgPonent(routesArchPonent);

      return routesArchPonent;
    };

    parseThroughRoutes(this, createRoutesArchPonent);

    // arch tree
    const treeTypes = Object.keys(ArchTreeType);
    treeTypes.forEach(treeType => {
      const treeBuilder = mapOfArchTreeBuilder[treeType];
      this._archTrees[treeType] = treeBuilder(this, projectName);
    });

    // console.log(this);

    return this;
  }

  // true - continue looping, false - break looping
  traverseNgModuleThroughImports(ngPonent: ArchNgPonentModule, callback: Function, forNgModule = true, canBreak = true) {
    const ngImports = ngPonent.getMetadataOf<NgModuleMetadata, (string | TsPonent)[]>('imports');

    if (ngImports) {
      ngImports
        .some(ngImport => {
          if (ngImport instanceof TsPonent && !forNgModule) {
            return !util.applyCallback(callback, canBreak, ngImport);
          } else {
            const archPonent = this.tryFindModulePonentByName('' + ngImport);
            if (archPonent instanceof ArchNgPonentModule) {
              const returned = util.applyCallback(callback, canBreak, archPonent);
              if (returned) {
                this.traverseNgModuleThroughImports(archPonent, callback, forNgModule, canBreak);
              }
              return !returned;
            }
          }
        });
    }
  }

  private updateReferences(archPonent: ArchNgPonent) {

    if (isArchModule(archPonent)) {
      this._featureModulePonents.push(archPonent);
    }

    if (ModuleTypeReferences.indexOf(archPonent.ngPonentType) > -1) {
      this._moduleTypePonents.push(archPonent);

    } else if (archPonent.ngPonentType === NgPonentType.Model) {
      this._modelPonents.push(archPonent, archPonent.name);

    } else if (archPonent.ngPonentType === NgPonentType.Routes) {
      this._routeData.push(archPonent as ArchNgPonentRoutes);
    }
  }

  private createLoadingGroup(archPonent: ArchNgPonent) {
    if (archPonent.ngPonentType === NgPonentType.NgModule) {
      const features = archPonent.ngPonentFeatures;
      const loadingGroups = archPonent.loadingGroups;
      const ponentName = archPonent.name;
      let isBootstrapGroup: boolean;

      if (features && features.length > 0 && features.indexOf(NgPonentFeature.BootstrapModule) > -1) {
        isBootstrapGroup = true;

      } else if (loadingGroups && loadingGroups.length > 0 && loadingGroups.indexOf(ponentName) > -1) {
        isBootstrapGroup = false;
      }

      if (isBootstrapGroup === true || isBootstrapGroup === false) {
        this._loadingGroups[ponentName] = {
          ngPonentName: ponentName,
          fileName: archPonent.fileName,
          isBootstrapGroup: isBootstrapGroup,
          archNgPonents: []
        };
      }
    }
  }

  private updateLoadingGroups() {
    this._data.forEach( archPonent => {
      if (PonentsRelation.PonentTypesRelateToAngularLoading.indexOf(archPonent.ngPonentType) > -1) {
        archPonent.loadingGroups.forEach(groupName => {
          const groupArchPonents = this._loadingGroups[groupName].archNgPonents;
          // if (groupArchPonents.indexOf(archPonent) === -1) {
            // redundancy design, this method may be invoked more than one time.
            groupArchPonents.push(archPonent);
          // }
        });
      }
    });

    // sort
    const groups = Object.values(this._loadingGroups);
    groups.forEach(group => {
      group.archNgPonents.sort(ArchNgPonent.sort);
    });
  }
}

function createRouteArchNgPonent(routesPonent: ArchNgPonentRoutes) {
  const routesType = [ TsPonentType.ArrayExpressionPonent ];
  const found = PonentHelper.filterTsPonentMembersByType(routesPonent.tsPonent, routesType);

  if (found) {
    const routesMembers = found[0].members;

    routesPonent.children = routesMembers
      .map(routes => routes.ngPonent)
      .filter(route => !!route && route.ponentType === NgPonentType.Route)
      .map(ngPonent => {
        const childTsPonent = ngPonent.getTsPonent();
        const routePonent = new ArchNgPonentRoute('Route', ngPonent, childTsPonent);

        if (routePonent.hasChildren) {
          const grandChildren = routePonent.getChildrenTsPonent();

          const grandRoutes = new ArchNgPonentRoutes('Routes', grandChildren.ngPonent, grandChildren);
          routePonent.setSubRoutes(grandRoutes);
          createRouteArchNgPonent(grandRoutes);
        }

        return routePonent;
      });
  }
}
