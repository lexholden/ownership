let d3 = require('d3');

export class D3Promise {

  constructor($q) {
    'ngInject';

    var module = {};

    function promisify(caller, fn) {
      return function() {
        var args = Array.prototype.slice.call(arguments);

        var deferred = $q.defer();

        var callback = function(error, data) {
          if (error) {
            deferred.reject(Error(error));
            return;
          }
          // console.log(data);
          deferred.resolve(data);
        };
        fn.apply(caller, args.concat(callback));

        return deferred.promise;
      };
    }

    ['csv', 'tsv', 'json', 'xml', 'text', 'html'].forEach(function(fnName) {
      module[fnName] = promisify(d3, d3[fnName]);
    });

    d3.promise = module;

    return module;

  }

}
