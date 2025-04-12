class RouteManager {
  private selectedRoutes: any[] = [];

  addRoute(route: any) {
    this.selectedRoutes.push(route);
  }

  removeRoute(routeId: string) {
    this.selectedRoutes = this.selectedRoutes.filter(route => route.id !== routeId);
  }

  getRoutes() {
    return this.selectedRoutes;
  }
}