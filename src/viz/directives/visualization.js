let d3 = require('d3');

export function Visualization($compile, $rootScope, VizCatalog, $timeout) {
  'ngInject';

  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      config: '=',
      type: '='
    },
    controller: ($scope, $rootScope, $compile, $element, $timeout, DataService) => {
      'ngInject';
      $scope.VizCatalog = VizCatalog;

      $scope.render = (type) => {
        $timeout($scope.VizCatalog.render($scope.id, type, $scope.data), 0);
      };

      $scope.$watch('data', d => {
        // console.log('edited viz data');
        $scope.render($scope.type);
      });

      var listen = $scope.$on('update', (s, type) => {
        // console.log(type);
        // console.log('updating this viz, eh?');
        $scope.render(type);
      });

      // $timeout(() => {
      //   $scope.$watch('data', d => {
      //     $scope.render();
      //   });
      // }, 1);

    },
    link: (scope, el, attrs) => {

      scope.el = el;
      scope.id = VizCatalog.registerElement(el);

      // scope.render();
      // console.log(scope.id);

      // var template = '<' + scope.type.key + '/>';
      // var compiled = $compile(template)(scope);
      // el.append(compiled);
    }
    // template: require('./graph.html')
  };
}
