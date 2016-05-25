export function show(d) {
  'ngInject';

  return function(d) {
    console.log(d);
    return d.show;
  };

}
