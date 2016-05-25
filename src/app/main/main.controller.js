export class MainController {
  constructor($timeout, webDevTec, toastr, $rootScope, $scope, DataService) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1462392718860;
    this.toastr = toastr;
    $scope.types = $rootScope.vizTypes;
    $scope.type = $scope.types[0];
    $scope.type.active = true;

    this.activate($timeout, webDevTec);

    $scope.d = $rootScope.d = {};

    DataService.getData().success(data => {
      console.log(data);
    }).error(data => {
      // console.log($scope);
      $scope.d = $rootScope.d = DataService.structureData(table);
      // VizCatalog.render();
      // $rootScope.render($rootScope.vizTypes[0]);
    });

  }

  activate($timeout, webDevTec) {
    this.getWebDevTec(webDevTec);
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
  }

  getWebDevTec(webDevTec) {
    this.awesomeThings = webDevTec.getTec();

    angular.forEach(this.awesomeThings, (awesomeThing) => {
      awesomeThing.rank = Math.random();
    });
  }

  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    this.classAnimation = '';
  }
}
