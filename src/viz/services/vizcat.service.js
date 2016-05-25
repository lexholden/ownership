let d3 = require('d3');

export class VizCatalog {
  constructor($rootScope) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.catalog = []; // TODO Should this be a collection?
    this.lookup = {};
    this.vizcatalog = [];
  }

  register(type) {
    // console.log('INFO: Registering viztype ' + type.key);
    if (this.lookup[type.key]) {
      console.error('trying to enter a viztype that already exists: ' + type.key + '!');
    } else {
      this.lookup[type.key] = type;
      this.catalog.push(type);
      // this.DynamicDirectiveManager.registerDirective(type);
      // angular.module('zviz').directive(type.key, type.class);
      // console.log(angular.module('zviz'));
    }
  }

  registerElement(el, viz) {
    // console.log('registering a new visualization switcher');
    if (angular.isUndefined(viz)) {
      // console.log('did not define the default type, so setting ' + this.catalog[0].key);
      viz = this.catalog[0].key;
    }
    var id = this.vizcatalog.length;
    this.vizcatalog.push({id: id, el: el, default: viz });
    return id;
  }

  render(id, config, data) {
    var viz = this.vizcatalog[id];
    if (angular.isUndefined(config)) {
      // console.log('we did not pass config, so going with the default');
      config = this.lookup[viz.default];
    }
    console.log('rendering a "' + config.key + '" visualization in element ' + viz.id);
    var el = viz.el;
    d3.select(el[0]).html(''); // Clear all other content
    // console.log(viz);
    // console.log(el);
    // console.log(config);
    if (angular.isUndefined(viz.current)) {
      // console.log(viz.current);
      // console.log('we have no viz to delete!');
    } else {
      // viz.current.stop();
      // console.log('we already have a viz we need to stop!');
    }
    config.def(el, config, data, viz);
  }

  renderAll(type) {
    console.log(type);
    this.$rootScope.$broadcast('update', type);
  }

  update(config) {
    // TODO Can we live update this viz for some reason?
  }

  getOne(key) {
    return this.lookup[key];
  }

  getAll() {
    return this.catalog;
  }

}

// export class VizRender {
//   constructor($rootScope) {
//     'ngInject';
//     this.$rootScope = $rootScope;
//   }
// }
