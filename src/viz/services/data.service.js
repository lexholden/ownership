let d3 = require('d3');
let $ = require('jquery');

export class DataService {

  constructor($router, $log, D3Promise, $http) {
    'ngInject';

    this.$http = $http;
    this.data;

  }

  getData() {
    // var table;
    // var url = 'https://spreadsheets.google.com/feeds/list/1Ercu-WQVWnpfs3wKe3SQ9BhzW2ROr2mrACjYhdjNA9o/1/public/values?alt=json-in-script&callback=?';

    // $.getJSON(url, data => {
    //   console.log(data);
    // });

    // this.$http.jsonp('https://spreadsheets.google.com/feeds/cells/0Arsmj0C07X0kdEpqSUpIUjdtT1dwTzFnUXZHZGE0alE/od6/public/values?alt=json-in-script&callback=?')
    //   .success(data => {
    //     console.log(data);
    //   }).error(data => {
    //     console.log(data);
    //   });

    // var table, google = { visualization: {Query:{setResponse: function(d) {table = d; return d;}}} };
    return this.$http.jsonp('https://spreadsheets.google.com/tq?&tq=&key=1Ercu-WQVWnpfs3wKe3SQ9BhzW2ROr2mrACjYhdjNA9o&gid=2');

    // this.$http.jsonp('http://spreadsheets.google.com/feeds/list/1Ercu-WQVWnpfs3wKe3SQ9BhzW2ROr2mrACjYhdjNA9o/1/public/basic?alt=json-in-script&callback=myFunc', data => {
    //   console.log(data);
    // });
    // this.$http.get('https://sheets.googleapis.com/v4/spreadsheets/1Ercu-WQVWnpfs3wKe3SQ9BhzW2ROr2mrACjYhdjNA9o/values/A1:D4');
    // return this.$http.jsonp('http://spreadsheets.google.com/feeds/list/1Ercu-WQVWnpfs3wKe3SQ9BhzW2ROr2mrACjYhdjNA9o/1/public/values?alt=json-in-script&amp;callback=importGSS');
    // return this.$http.jsonp('https://spreadsheets.google.com/tq?&tq=&key=1Ercu-WQVWnpfs3wKe3SQ9BhzW2ROr2mrACjYhdjNA9o&gid=2');
  }

  structureData(data) {
    console.log(data);
    var d = {nodes: [], links: [], lookup: {}, filterKeys: [], roots: [] };
    var currencies = { '$': 'USD', '£': 'GBP', '€': 'Euro', 'CAD': 'CAD', 'CHF': 'Swiss Franc' };
    var ckeys = Object.keys(currencies);
    d.length = angular.toJson(data).length;
    // console.log(d);

    data.table.rows.forEach((r, ri) => {
      var row = {};
      // console.log(r);

      r.c.forEach((x, xi) => {
        if (x !== null && x.v !== null && x.v.length !== 0) {
          row[data.table.cols[xi].label.toLowerCase()] = x;
        }
      });

      if (row.name) {
        row.id = ri;

        // Parse single value parameters
        ['name', 'bio', 'img64', 'imgurl', 'parent', 'wiki'].forEach((v, vi) => {
          if (row[v]) {
            // console.log(row.name + ' has property ' + v + ' so parsing the value ' + row[v].v);
            row[v] = row[v].v;
          }
        });

        // Parse single value parameters with a lookup entry
        ['ceo', 'founder','family', 'license', 'founded', 'employees'].forEach(v => {
          if (row[v]) {
            row[v] = row[v].v;
            addLookup(row, v);
          }
        });

        // TODO Can we guess family based on root level parent?

        // Parse values with a heirarchy a > b > c > d
        ['country', 'industry'].forEach((v, vi) => {
          if (row[v]) {
            row[v].b = row[v].v.split(' > ');
            addLookup(row, v);
            // addLookup(row, row[v].b[0]);
          }
        });

        // Parse currency values
        ['revenue'].forEach(v => {
          if (row[v]) {
            // console.log('working on currency for ' + row[v]);
            var found = false, n = 0, curr;
            while (!found && n < ckeys.length) {
              // console.log('comparing ' + ckeys[n] + ' to see if matches the currency of ' + row[v].f);
              if (row[v].f.startsWith(ckeys[n])) {
                // console.log('we know it is currency ' + currencies[ckeys[n]]);
                found = true;
                row[v].currencySymbol = ckeys[n];
              }
              n++;
            }
            if (angular.isUndefined(row[v].currencySymbol)) {
              console.error('ERROR: A currency does not exist: ' + row[v].f);
            }
            // row[v].currencySymbol = row[v].f[0];
            // if (currencies[row[v].currencySymbol]) {
            //   row[v].currency = currencies[row[v].currency];
            // } else {
            //   console.error('ERROR: A currency does not exist: ' + row[v].currencySymbol);
            // }
          }
        });

        row.subsidiaries = [];
        row.nodeRadius = (row.revenue ? row.revenue.v.toString().length * 4 : 4) + 4;
        row.nodeSize = row.nodeRadius * 4;

        if (angular.isDefined(d.lookup[row.name])) {
          console.error('ERROR: "' + row.name + '" exists twice!'); // TODO What if it exists more than twice?
        }

        d.lookup[row.name] = row;
        d.nodes.push(row);
      }
    });

    d.nodes.forEach((n, i) => {
      // console.log('checking parents ' + n.name);
      if (n.parent) {
        n.parent = n.parent.split('\n');
        // var percentage = 0;
        n.parent.forEach((p, pi) => {
          var breakdown = p.split(':');
          if (breakdown.length > 1) {
            // percentage += breakdown[1];
            // console.log('This parent comes with an amount: ' + breakdown[0] + ' owns ' + breakdown[1]);
          }
          p = breakdown[0];
          if (angular.isUndefined(d.lookup[p])) {
            // TODO Can we string score to suggest likely comparisons https://github.com/joshaven/string_score
            console.error('ERROR: "' + p + '" (parent of ' + n.name + ') does not exist.');
          } else {
            d.lookup[p].subsidiaries.push(n);
            d.links.push({source: d.lookup[p].id, target: n.id, type: 'ownership', percentage: (breakdown[1] || 100) });
          }
        });
      }
    });

    var unconnected = 0;
    d.nodes.forEach(n => {
      if (!n.subsidiaries.length && !n.parent) {
        unconnected++;
        console.log('WARNING: ' + n.name + ' has no connections');
      } else if (!n.parent) {
        // console.log('INFO: ' + n.name + ' looks like a top root with children')
        d.roots.push(n);
      }
    });

    console.log('INFO: There are ' + unconnected + ' unconnected nodes');
    return d;

        // Row: The row to lookup, v: The key
    function addLookup(row, v) {
      var lookupKey = 'lookup' + v;

      if (angular.isUndefined(d[lookupKey])) {
        d[lookupKey] = { _list: [] };
        d.filterKeys.push({key: lookupKey, property: v, lookup: d[lookupKey]});
      }

      var category;

      if (angular.isString(row[v])) {
        category = row[v];
      } else if (angular.isNumber(row[v])) {
        category = row[v]; // TODO we should tier these?
      } else if (angular.isUndefined(category)) {
        if (angular.isUndefined(row[v].b)) {
          console.log('it seems' + row.name + ' is unhappy with cat ' + v + ' because ' + angular.toJson(row[v].b));
          console.log(row);
        } else {
          category = row[v].b[0];
        }

      } else {
        console.error('ERROR: We have an unrecognised category value');
        category = 'Uncategorized';
      }

      if (d[lookupKey][category]) {
        d[lookupKey][category].push(row);
      } else {
        // console.log('We have a new ' + v + ': ' + row[v]);
        d[lookupKey]._list.push(category);
        d[lookupKey][category] = [ row ];
      }
    }

  }

  getCities() {
    return d3.promise.tsv('assets/data/cities.tsv');
  }

  getCitiesShort() {
    return d3.promise.tsv('assets/data/citiesshort.tsv');
  }

  getLogs() {
    return d3.promise.csv('assets/data/logs.csv');
  }

  getLogsShort() {
    return d3.promise.csv('assets/data/logsshort.csv');
  }

}
