let d3 = require('d3');

export function Force(element, config, d, viz) {
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
      // .friction(0.5)
      .charge(d => {
        var charge = -1000 - (d.revenue ? d.revenue.v.toString().length * 500 : 0);
        /*console.log(d.name + ': ' + charge);*/
        return charge;
      })
      .linkDistance(d => {
        return (5 + (d.source.subsidiaries.length) + (d.target.subsidiaries.length)
          + (d.source.nodeSize * 1.5) + (d.target.nodeSize));
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
