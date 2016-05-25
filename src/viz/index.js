let d3 = require('d3');
import { show } from './filters/show.js';
import { DataService } from './services/data.service';
import { ValidateSchema } from './services/validate.service';
import { D3Promise } from './services/promise.service.js';
import { VizCatalog } from './services/vizcat.service';
import { Visualization } from './directives/visualization';
import { Graph } from './directives/graph';
import { Force } from './directives/force';
import { Text1 } from './directives/text1';
import { Text2 } from './directives/text2';

var visualizations = [
  { key: 'force', def: Force, config: {}, test: 'hello' },
  { key: 'graph', def: Graph, config: {}, test: 'hello' },
  { key: 'text1', def: Text1, config: {}, test: 'hello' },
  { key: 'text2', def: Text2, config: {}, test: 'hello' }
];

var module = angular.module('zviz', [])
  // .provider('DynamicDirectiveManager', DynamicDirectiveManager)
  .config(($logProvider, $compileProvider) => {
    // TODO Any config for zviz
  })
  .filter('show', show)
  .service('D3Promise', D3Promise)
  .service('DataService', DataService)
  .service('ValidateSchema', ValidateSchema)
  .service('VizCatalog', VizCatalog)
  .directive('visualization', Visualization)
  // .directive('')
  .run((VizCatalog) => {
    visualizations.forEach(v => {
      VizCatalog.register(v);
    });
    // console.log(VizCatalog);
  });

// visualizations.forEach(v => {
//   // console.log(v);
//   module.directive(v.key, v.class);
// });

// console.log(module);

module.exports = module;
