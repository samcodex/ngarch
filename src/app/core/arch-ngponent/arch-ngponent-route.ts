import { NgPonent, TsPonent, TsPonentType, PonentHelper } from '../ngponent-tsponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { ArchNgPonent } from './arch-ngponent';
import { ArchNgPonentMetadata } from './arch-ngponent-metadata';
import { ModuleIdentifier } from '@shared/arch-ngponent-store/resolver/arch-resolver-definition';
import { ArchNgPonentRoutes } from './arch-ngponent-routes';

export class NgRouteMetadata extends ArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.Route;
  properties = ['path', 'pathMatch', 'matcher',
    'component', 'redirectTo', 'outlet', 'canActivate', 'canActivateChild',
    'canDeactivate', 'canLoad', 'data', 'resolve', 'children',
    'loadChildren', 'runGuardsAndResolvers'];
  usedProperties = [];

  metadata: {
    path?: string,
    pathMatch?: string,
    matcher?: any,
    component?: any,
    redirectTo?: string,
    outlet?: string,
    canActivate?: any[],
    canActivateChild?: any[],
    canDeactivate?: any[],
    canLoad?: any[],
    data?: any,
    resolve?: any,
    children?: any,
    loadChildren?: any,
    runGuardsAndResolvers?: any
  };

  descriptions = {
    path: 'The path to match against, a URL string that uses router matching notation. Can be a wild card (**) that matches any URL (see Usage Notes below). Default is "/" (the root path).',
    pathMatch: 'The path-matching strategy, one of "prefix" or "full". Default is "prefix".',
    matcher: 'A URL-matching function to use as a custom strategy for path matching. If present, supersedes path and pathMatch.',
    component: 'The component to instantiate when the path matches. Can be empty if child routes specify components.',
    redirectTo: 'A URL to which to redirect when a the path matches. Absolute if the URL begins with a slash (/), otherwise relative to the path URL. When not present, router does not redirect.',
    outlet: 'Name of a RouterOutlet object where the component can be placed when the path matches.',
    canActivate: 'An array of dependency-injection tokens used to look up CanActivate() handlers, in order to determine if the current user is allowed to activate the component. By default, any user can activate.',
    canActivateChild: 'An array of DI tokens used to look up CanActivateChild() handlers, in order to determine if the current user is allowed to activate a child of the component. By default, any user can activate a child.',
    canDeactivate: 'An array of DI tokens used to look up CanDeactivate() handlers, in order to determine if the current user is allowed to deactivate the component. By default, any user can deactivate.',
    canLoad: 'An array of DI tokens used to look up CanLoad() handlers, in order to determine if the current user is allowed to load the component. By default, any user can load.',
    data: 'Additional developer-defined data provided to the component via ActivatedRoute. By default, no additional data is passed.',
    resolve: 'A map of DI tokens used to look up data resolvers.',
    children: 'An array of child Route objects that specifies a nested route configuration.',
    loadChildren: 'A LoadChildren object specifying lazy-loaded child routes.',
    runGuardsAndResolvers: `Defines when guards and resolvers will be run. One of "paramsOrQueryParamsChange" : Run when query parameters change.
      "always" : Run on every execution. By default, guards and resolvers run only when the matrix parameters of the route change.`
  };
}

export class ArchNgPonentRoute extends ArchNgPonent {

  private _subRoutes: ArchNgPonentRoutes;

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, new NgRouteMetadata());
  }

  get hasPath(): boolean {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('path');
    return !!value;
  }

  get hasRedirectTo(): boolean {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('redirectTo');
    return !!value;
  }

  get hasChildren(): boolean {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('children');
    return !!value;
  }

  get hasComponent(): boolean {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('component');
    return !!value;
  }

  get hasLoadChildren(): boolean {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('loadChildren');
    return !!value;
  }

  get subRoutes(): ArchNgPonentRoutes {
    return this._subRoutes;
  }

  get hasSubRoutes(): boolean {
    return !!this._subRoutes;
  }

  getPath(): string {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('path');
    const path = value ? value[0] : null;
    return path;
  }

  getRedirectTo(): string {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('redirectTo');
    const redirectTo = value ? value[0] : null;
    return redirectTo;
  }

  getComponentName(): string {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('component');
    const componentName = value ? value[0] : null;
    return componentName;
  }

  getLoadChildrenValue(): string {
    const value = this.getMetadataOf<NgRouteMetadata, any[]>('loadChildren');
    const loadChildren = value ? value[0] : null;
    return loadChildren;
  }

  getChildrenTsPonent(): TsPonent {
    const arrayChildren = this.getMetaRefOf('children');
    return arrayChildren ? arrayChildren[0] : null;
  }

  getComponentTsPonent(): TsPonent {
    const tsPonents = this.getMetaRefOf('component');
    return tsPonents && Array.isArray(tsPonents) ? tsPonents[0] : null;
  }

  getLoadChildrenTsPonent(): TsPonent {
    const tsPonents = this.getMetaRefOf('loadChildren');
    return tsPonents && Array.isArray(tsPonents) ? tsPonents[0] : null;
  }

  getComponentModuleIdentifier(): ModuleIdentifier {
    if (this.hasComponent) {
      const tsPonent = this.getComponentTsPonent();

      if (tsPonent) {
        return {
          moduleFile: tsPonent.identifierFile,
          moduleName: tsPonent.value
        };
      }
    }

    return null;
  }

  getLoadChildrenModuleId(): ModuleIdentifier {
    if (this.hasLoadChildren) {
      const tsPonent = this.getLoadChildrenTsPonent();

      if (tsPonent) {
        return {
          moduleFile: tsPonent.__moduleFile__,
          moduleName: tsPonent.__moduleName__
        };
      }
    }

    return null;
  }

  getShortDescription(): string {
    let short: string[] = [];
    const path = this.getPath();
    const redirectTo = this.getRedirectTo();
 
    if (path !== null) {
      short.push('path: ' + path );
    }

    if (redirectTo) {
      short.push('redirectTo: ' + redirectTo);
    }

    return short.length ? short.join(', ') : null;
  }
  // getLoadChildrenModuleId(): ModuleIdentifier {
  //   if (this.hasLoadChildren) {
  //     const ponentTypes = [TsPonentType.ObjectExpressionPonent, null];
  //     const ponentNames = [null, 'loadChildren'];
  //     const tsPonent =  PonentHelper.findTsPonentByType(this.tsPonent, ponentTypes, ponentNames);

  //     if (tsPonent) {
  //       const moduleFile = tsPonent.__moduleFile__;
  //       const moduleName = tsPonent.__moduleName__;
  //       return { moduleFile, moduleName };
  //     }
  //   }

  //   return null;
  // }

  setSubRoutes(routes: ArchNgPonentRoutes) {
    this._subRoutes = routes;
  }
}
