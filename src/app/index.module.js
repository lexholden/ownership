/* global malarkey:false, moment:false */

import '../viz';
import { MainController } from './main/main.controller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';

angular.module('demo', ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngAria',
                        'ngResource', 'ngNewRouter', 'ngMaterial', 'toastr', 'zviz'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(($logProvider, toastrConfig, $locationProvider, $componentLoaderProvider) => {
    'ngInject';
    $logProvider.debugEnabled(true);
    $locationProvider.html5Mode(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
    $componentLoaderProvider.setTemplateMapping(function(name) {
      return `app/${ name }/${ name }.html`;
    });

  })
  .run(($rootScope, DataService, VizCatalog) => {
    'ngInject';
    $rootScope.vizTypes = VizCatalog.getAll();
    $rootScope.d = {};
    // $rootScope.d = {nodes: [], links: [], lookup: {}, filterKeys: [] };

  })
  .controller('RouterController', ($router) => {
    'ngInject';
    $router.config([
      { path: '/', component: 'main' }
    ]);
  })
  .controller('MainController', MainController)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective);
