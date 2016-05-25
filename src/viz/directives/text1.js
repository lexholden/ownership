let d3 = require('d3');

export function Text1(el, config) {

  var div = d3.select(el[0]).html('hello');//.enter().append('p').html('hello');

  console.log(div);

}
