/**
 * @function
 * @summary write key-path accessor
 * @param obj
 * @param path
 * @returns nested object from obj access by dot separated path
 * @constructor
 */
Leaf = function (obj, path) {
  path = path.split('.');
  var res = obj;
  for (var i = 0; i < path.length; i++) res = res[path[i]];
  return res;
};