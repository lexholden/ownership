class NavbarController {
  constructor($rootScope, $scope, VizCatalog, DataService) {
    'ngInject';

    // "this.creationDate" is available by directive option "bindToController: true"

    $scope.viz = VizCatalog.getAll();

    $scope.render = config => {
      $scope.viz.forEach(v => {
        v.active = false;
      });
      config.active = true;
      VizCatalog.renderAll(config);
    };

    // $scope.viz = $rootScope.vizTypes;
    $scope.d = [];

    var w = $rootScope.$watch('d', d => {
      $scope.roots = d.roots;
      // console.log(d);
      $scope.d = d.filterKeys || [];
    });

    // $scope.render = $rootScope.render;

    // $scope.highlight = (el) => {
    //   // console.log(el);
    // };

    // $scope.render = config => {
    //   console.log(config);
    //   $rootScope.render(config);
    // };

    // console.log($scope.d);

  }
}

export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
      creationDate: '='
    },
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}
