var TSHelpers = {
  mergeObj: function(arg1, arg2, arg3, arg4, arg5) {
    var args = [arg1, arg2, arg3, arg4, arg5];
    var result = {};
    for (var index in args) {
      var arg = args[index];
      for (var prop in arg) {
        if (typeof arg[prop] != "function") {
          result[prop] = arg[prop];
        }
      }
    }
    return result;
  },
};

module.exports = TSHelpers;
