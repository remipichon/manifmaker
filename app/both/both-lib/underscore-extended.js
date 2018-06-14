_.intersectionObjects = _.intersect = function (array) {
  var slice = Array.prototype.slice;
  var rest = slice.call(arguments, 1);
  return _.filter(_.uniq(array), function (item) {
    return _.every(rest, function (other) {
      //return _.indexOf(other, item) >= 0;
      return _.any(other, function (element) {
        return _.isEqual(element, item);
      });
    });
  });
};