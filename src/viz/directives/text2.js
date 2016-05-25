let d3 = require('d3');

export function Text2(el, config) {

  var div = d3.select(el[0]).html('howdy');//.enter().append('p').html('hello');

  console.log(div);

}
