import * as PIXI from 'pixi.js';

export class Route {
  name: string;
  container: PIXI.Container | null;
  info: { [key: string]: any } = {};
  children: Route[] = [];
  childrenMap: {
    [key: string]: Route
  } = {};
  handlers: {
    [key: string]: ((data: any) => void)[],
  } = {};

  constructor(name: string, container?: PIXI.Container, info?: Route['info']) {
    this.name = name;
    this.container = container || null;
    this.info = info || {};
  }

  addRoute(names: string[], container: PIXI.Container): void {
    let routeName = names[0];
    if (this.childrenMap[routeName]) {
      if (names.length === 1) return;
      return this.childrenMap[routeName].addRoute(names.slice(1), container);
    }

    const route = new Route(routeName, names.length === 1 ? container : undefined)
    this.childrenMap[routeName] = route;
    this.children.push(route);
    route.container.renderable = false;

    if (names.length !== 1) this.childrenMap[routeName].addRoute(names.slice(1), container);
  }

  getRoute(names: string[]): Route | undefined {
    if (names.length === 0) return;
    if (names.length === 1) return this.childrenMap[names[0]];

    const route = this.childrenMap[names[0]];
    if (!route) return;
    return route.getRoute(names.slice(1));
  }

  getRoutes(names: string[]): Route[] {
    if (!Array.isArray(names)) {
      if (!this.childrenMap[names]) return [];
      return [this.childrenMap[names]];
    }
    if (names.length === 0) return;
    if (names.length === 1) {
      if (!this.childrenMap[names[0]]) return [];
      return [this.childrenMap[names[0]]];
    }

    const route = this.childrenMap[names[0]];
    if (!route) return;
    return [route, ...route.getRoutes(names.slice(1))];
  }

  syncVisibility(currentRoutes: Route[]) {
    const activeChild: Route | null = null;
    const currentName = currentRoutes[0]?.name;
    this.children.forEach(child => {
      child.container.renderable = child.name === currentName;
      child.container.interactiveChildren = child.container.renderable;
    });
    if (currentRoutes.length === 1) {
      return;
    }
    activeChild?.syncVisibility(currentRoutes.slice(1));
  }

  on(event: string, handler: (data: any) => void) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }

  emit(event: string, data: any) {
    if (!this.handlers[event]) return;
    this.handlers[event].forEach(handler => handler(data));
  }
}

export class Routing {
  app: PIXI.Application | null;
  hashMap: {
    [key: string]: Route
  } = {};
  list: Route[] = [];
  currentRoute: Route[] = [];

  provideApp(app: PIXI.Application) {
    this.app = app;
    this.app.ticker.add(() => {
      this.list.forEach(route => {
        route.container.renderable = this.isCurrentRoute(route.name);
        route.container.interactiveChildren = route.container.renderable;
        // if (
        //   !route.children || !route.container.renderable
        //   || this.currentRoute.length === 1
        // ) return;
        route.syncVisibility(this.currentRoute.slice(1));
      });
    });
  }

  addRoute(names: string | string[], container: PIXI.Container): void {
    const routeName = Array.isArray(names) ? names[0] : names;

    if (!routeName) return;

    // If names is string, then we dont need to dive further.
    if (!Array.isArray(names)) {
      if (this.hashMap[routeName]) return;
      this.hashMap[routeName] = new Route(routeName, container);
      this.list.push(this.hashMap[routeName]);
      return;
    }

    // If we are dealing with an array, we need to exclude a case of it consisting of only 1 element.
    if (this.hashMap[routeName]) {
      if (names.length === 1) return;
      return this.hashMap[routeName].addRoute(names.slice(1), container);
    }

    this.hashMap[routeName] = new Route(routeName, names.length === 1 ? container : undefined);
    this.list.push(this.hashMap[routeName]);

    if (names.length !== 1) this.hashMap[routeName].addRoute(names.slice(1), container);
  }

  getRoute(nameOrRoute: string | string[]): Route | undefined {
    if (!Array.isArray(nameOrRoute)) return this.hashMap[nameOrRoute];
    if (nameOrRoute.length === 0) return;
    if (nameOrRoute.length === 1) return this.hashMap[nameOrRoute[0]];

    const route = this.hashMap[nameOrRoute[0]];
    if (!route) return;
    return route.getRoute(nameOrRoute.slice(1));
  }

  getRoutes(nameOrRoute: string | string[]): Route[] {
    if (!Array.isArray(nameOrRoute)) {
      if (!this.hashMap[nameOrRoute]) return [];
      return [this.hashMap[nameOrRoute]];
    }
    if (nameOrRoute.length === 0) return;
    if (nameOrRoute.length === 1) {
      if (!this.hashMap[nameOrRoute[0]]) return [];
      return [this.hashMap[nameOrRoute[0]]];
    }

    const route = this.hashMap[nameOrRoute[0]];
    if (!route) return;
    return [route, ...route.getRoutes(nameOrRoute.slice(1))];
  }

  setCurrentRoute(nameOrRoute: string) {
    if (!this.hashMap[nameOrRoute]) {
      return console.error(`Route with name "${nameOrRoute}" does not exist!`);
    }
    this.currentRoute = [this.hashMap[nameOrRoute]];
  }

  navigate(nameOrRoute: string | string[]) {
    const routes = this.getRoutes(nameOrRoute);
    if (
      (Array.isArray(nameOrRoute) && routes.length !== nameOrRoute.length)
      || (!Array.isArray(nameOrRoute) && routes.length !== 1)
    ) return;
    const oldRoutes = this.currentRoute;
    this.currentRoute = routes;
    routes[routes.length - 1].emit('navigatedTo', { oldRoutes, newRoutes: this.currentRoute });
  }

  isCurrentRoute(nameOrRoute: string | string[]): boolean {
    if (!Array.isArray(nameOrRoute)) {
      return this.currentRoute[0] ? this.currentRoute[0].name === nameOrRoute : false;
    }
    if (nameOrRoute.length === 0) return false;
    for (let i = 0; i < nameOrRoute.length; i++) {
      const route = this.currentRoute[i];
      if (!route || route.name !== nameOrRoute[i]) return false;
    }
    return true;
  }
}

const currentRouting = new Routing();

export default currentRouting;