'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _handlers = {};
var debug = (0, _debug2['default'])('dispatcher');

function addHandler(action, handler) {
  debug('add handler');
  if (typeof action !== 'string') {
    throw new InvalidAction();
  }
  if (!_handlers[action]) {
    _handlers[action] = [];
  }
  _handlers[action].push(handler);
};

function removeHandler(action, handler) {
  debug('remove handler');
  if (typeof action !== 'string') {
    throw new InvalidAction();
  }
  var handlers = undefined,
      index = undefined;
  if (!(handlers = _handlers[action]) || (index = handlers.indexOf(handler)) === -1) {
    return;
  }
  handlers.splice(index, 1);
};

function dispatch(action, options) {
  debug('dispatch ' + action);
  if (typeof action !== 'string') {
    throw new InvalidAction();
  }
  if (!_handlers[action]) {
    return Promise.resolve();
  }
  return Promise.all(_handlers[action].map(function (handler) {
    return new Promise(function (resolve, reject) {
      return handler(resolve, reject, options);
    });
  })).then(function (results) {
    if (!results || !results.length) {
      return null;
    } else if (results.length === 1) {
      return results.pop();
    } else {
      return results;
    }
  });
};

var InvalidAction = (function (_Error) {
  function InvalidAction(message) {
    _classCallCheck(this, InvalidAction);

    _get(Object.getPrototypeOf(InvalidAction.prototype), 'constructor', this).call(this, message);
    this.name = 'InvalidAction';
    this.message = message || 'invalid action type';
  }

  _inherits(InvalidAction, _Error);

  return InvalidAction;
})(Error);

exports['default'] = { addHandler: addHandler, removeHandler: removeHandler, dispatch: dispatch, InvalidAction: InvalidAction };
module.exports = exports['default'];