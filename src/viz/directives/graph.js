let d3 = require('d3');

export function Graph(element, config, d, viz, DataService) {
  'ngInject';

  d = d || {nodes: [], links: [], lookup: {}, filterKeys: [] };

  console.log(d);
  // console.log(d3.layout);

  function renderGraph() {

    var el = d3.select(element[0]);
    // console.log(el);
    var width = 1000, height = 1000;
    // var width = 1000el.style(900), height = el.style(1000);
    // console.log(width);
    var force = d3.layout.force()
      .nodes(d.nodes)
      .links(d.links)
      .size([width, height])
      .friction(0.5)
      .charge(d => {
        var charge = -1000 - (d.revenue ? d.revenue.v.toString().length * 500 : 0);
        /*console.log(d.name + ': ' + charge);*/
        return charge;
      })
      .linkDistance(d => {
        return (5 + (d.source.subsidiaries.length) + (d.target.subsidiaries.length)
          + (d.source.nodeSize) + (d.target.nodeSize));
      })
      .on('tick', tick);

    // viz.current = force;
    var zoom;

    // d3.select(window).on('resize', resize);

    var svg = el.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .call(zoom = d3.behavior.zoom().scaleExtent([0.02, 10]).on('zoom', redrawCanvas));

    var defs = svg.append('svg:defs');

    var innervis = svg.append('g');

    var links = innervis.selectAll('.link').data(d.links),
      nodes = innervis.selectAll('.node').data(d.nodes);

    links.enter().append('line')
      .attr('class', 'link')
      .attr('stroke-linecap', 'round');

    var nodeG = nodes.enter().append('g')
      .attr('class', 'node')
      .call(force.drag())
      .on('mouseover', d => { if (d.img64) { var nodeSelection = d3.select(this); nodeSelection.select('text').style({opacity: 1}); } })
      .on('mouseout', d => { if (d.img64) { var nodeSelection = d3.select(this); nodeSelection.select('text').style({opacity: 0}); } });

    nodeG.append('circle')
      .attr('r', d => { return d.img64 ? 0 : d.nodeRadius; })
      // .attr('fill', 'url(/#tile-ww)')
      .on('dblclick', dblclick);

    nodeG.append('image')
      .attr('href', d => { return d.img64; })
      .attr('x', d => { return -d.nodeSize; })
      .attr('y', d => { return -d.nodeSize; })
      .attr('height', d => { return d.nodeSize * 2; })
      .attr('width', d => { return d.nodeSize * 2; });

    nodeG.append('text')
      .text(d => { return d.name; })
      // .attr('style', function(d) { console.log(d); return 'opacity: ' + d.img64 ? 0 : 1 })
      .style('opacity', d => { return d.img64 ? 0 : 1; })
      .attr('text-anchor', 'middle')
      .attr('dy', d => { return d.nodeRadius + 25; })
      .attr('class', 'node-text')
      .attr('fill', '#CCC');

    var drag = force.drag().on('dragstart', dragstart);

    force.start();

    // console.log('directive!');

    // return {
    //   restrict: 'E',
    //   replace: true,
    //   scope: {
    //     data: '=',
    //     config: '='
    //   },
    //   link: (scope, el, attrs) => {

    //     console.log(el);

        // console.log(scope.data);
        // console.log(scope.config);

        // // TODO We should generate everything based on config properties
        // // TODO We should listen to the time service for updates
        // // TODO We need to listen to changes in data
        // // TODO Worth listening to changes in config?

        // var svg = d3.select(el[0]).append('svg')
        //   .attr('width', '100%')
        //   .attr('height', scope.config.margin || '500px')
        //   .append('g')
        //     .attr('transform', 'translate(' + (scope.config.margin.left || 50) + ',' + (scope.config.margin.top || 20) + ')');

        // $window.onresize = function() {
        //   scope.$apply();
        // };

        // scope.$watch(() => {
        //   return angular.element($window)[0].innerWidth;
        // }, () => {
        //   scope.render();
        // });

        // scope.render = function() {

        // };


        // var margin = {top: 20, right: 80, bottom: 30, left: 50},
        //   width = 700 - margin.left - margin.right,
        //   height = 500 - margin.top - margin.bottom;

        // var x = d3.time.scale().range([0, width]);
        // var y = d3.scale.linear().range([height, 0]);
        // var color = d3.scale.category10();
        // var xAxis = d3.svg.axis().scale(x).orient('bottom');
        // var yAxis = d3.svg.axis().scale(y).orient('left');
        // var line = d3.svg.line().interpolate('basis').x(function(d) { return x(d.date); }).y(function(d) { return y(d.temperature); });
        // var bisectDate = d3.bisector(function(d) { return d.date; }).left;
        // var formatValue = d3.format(',.2f');
        // var formatCurrency = function(d) { return '$' + formatValue(d); };



        // // DataService.getCitiesShort().then((data) => {

        // color.domain(d3.keys(scope.data.metrics[0]).filter(function(key) { return key !== 'date'; }));
        // scope.data.metrics.forEach(function(d) { d.date = d3.time.format('%Y%m%d').parse(d.date); });

        // var cities = color.domain().map(function(name) {
        //   return {
        //     name: name,
        //     values: scope.data.metrics.map(function(d) {
        //       return {date: d.date, temperature: +d[name]};
        //     })
        //   };
        // });

        // x.domain(d3.extent(scope.data.metrics, function(d) { return d.date; }));

        // y.domain([
        //   d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
        //   d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
        // ]);

        // var city = svg.selectAll('.city').data(cities)
        //   .enter().append('g')
        //     .attr('class', 'city');

        // city.append('path')
        //   .attr('class', 'line')
        //   .attr('d', function(d) { return line(d.values); })
        //   .style('stroke', function(d) { return color(d.name); });

        // city.append('text')
        //   .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        //   .attr('transform', function(d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.temperature) + ')'; })
        //   .attr('x', 3)
        //   .attr('dy', '.35em')
        //   .text(function(d) { return d.name; });

        // var pointer = city.append('circle')
        //   .attr('class', 'pointer')
        //   .attr('r', 2.5);

        // svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
        // svg.append('g').attr('class', 'y axis').call(yAxis)
        //   .append('text')
        //     .attr('transform', 'rotate(-90)')
        //     .attr('y', 6)
        //     .attr('dy', '.71em')
        //     .style('text-anchor', 'end')
        //     .text('Temperature (ºF)');

        // svg.append('rect')
        //   .attr('class', 'overlay')
        //   .attr('width', width)
        //   .attr('height', height)
        //   .on('mouseover', function() { pointer.style('display', null); })
        //   .on('mouseout', function() { pointer.style('display', 'none'); })
        //   .on('mousemove', mousemove);

        // scope.filter = function(v, i, a) {
        //   console.log(v);
        //   return true;
        // };

        // function mousemove() {

        //   var x0 = x.invert(d3.mouse(this)[0]),
        //     i = bisectDate(scope.data.metrics, x0, 1),
        //     d0 = scope.data.metrics[i - 1],
        //     d1 = scope.data.metrics[i],
        //     d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        //     // console.log({x0: x0, i: i, d0: d0, d1: d1, d: d, cities: cities});

        //   var n = 0;
        //   pointer.attr('transform', function(data) {
        //     var datp = cities.filter((c) => { return c.name === data.name; })[0].values[i];
        //     return 'translate(' + x(datp.date) + ',' + y(datp.temperature) + ')';
        //   });

        //   var maxDate = d.date.setDate(d.date.getDate() + 2);
        //   var minDate = d.date.setDate(d.date.getDate() - 2);

        //   // console.log({max: maxDate.toString(), min: minDate.toString()});

        //   scope.logs.forEach((l) => {
        //     // console.log(l);
        //     if (l.date >= minDate && l.date <= maxDate) {
        //       console.log('woo, this log fits here! ');
        //       // console.log(l);
        //       l.show = true;
        //     } else {
        //       // console.log('this log falls outside...');
        //       l.show = false;
        //     }
        //     // console.log('checking if log at ' + l.date + ' should be shown when hovering over ' + d.date);
        //   });

        //   // pointer.select('text').text(formatCurrency(d.close));

        // }

        // });

        // DataService.getLogsShort().then(data => {

        //   data.forEach((d)=>{
        //     if (Object.keys(d).length !== 2) { console.log('there was an error, eh?'); }
        //     d.date = d3.time.format('%Y%m%d').parse(d.date);
        //     d.show = false;
        //   });
        //   scope.logs = data;
        // });

      // },
      // controller: ($scope) => {
      //   'ngInject';
      //   console.log('this');

      // },
      // template: '<div>Hello</div>' // require('./graph.html')
    // };


    function tick() {
      links.attr('x1', d => { return d.source.x; })
          .attr('y1', d => { return d.source.y; })
          .attr('x2', d => { return d.target.x; })
          .attr('y2', d => { return d.target.y; });

      nodes.attr('transform', d => { return 'translate(' + d.x + ',' + d.y + ') scale(' + 1 + ')'; });
        // .attr('cx', function(d) {return d.x; })
        // .attr("cy", function(d) { return d.y; });
    }

    function resize() {
      console.log(el[0]);
      var width = parseInt(d3.select(el[0]).style('width'), 10);
      console.log(width);
    }

    function dblclick(d) {
      // d3.select(this).classed('fixed', d.fixed = false);
    }

    function dragstart(d) {
      // console.log('dragstart');
      // d3.select(this).classed('fixed', d.fixed = true);
    }

    function redrawCanvas() {
      innervis.attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
    }

  }



  if (d.nodes && d.nodes.length) {
    renderGraph();
  } else {
    console.log('trying to render a force graph but we have no data yet!');
  }


}
