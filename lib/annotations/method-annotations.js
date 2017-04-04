var methods = require('../utils/http').methods;
var string = require('../utils/string');
var controller = require("../services/controller");

methods.forEach(function(method) {

  exports[string.capitalize(string.camelCase(method))] = function() {

    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];

    return controller.annotateRoute(method, args);
  }
});
