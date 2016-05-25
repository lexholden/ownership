export class DemoController {
  constructor($scope, VizCatalog, DataService, $rootScope) {
    'ngInject';

    // $scope.data = { logs: [], metrics: []};
    $scope.d = $rootScope.d;
    $scope.config = {
      margin: {top: 20, right: 80, bottom: 30, left: 50},
      width: 700,
      height: 500
    };

    DataService.getCitiesShort().then(data => { $scope.data.metrics = data; });
    DataService.getLogsShort().then(data => { $scope.data.logs = data; });

    // this.test = 'hello';
    // console.log(this.test);
  }
}
