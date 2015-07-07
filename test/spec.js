'use strict';

var assert      = require('assert');
var debug       = console.log;
var dispatcher  = require('../build/dispatcher');
var TIMEOUT     = 60000;
var ACTION      = 'TEST_ACTION';

var handler_1 = function (resolve, reject, options) {
  debug('hander 1', options);
  assert(options.extra === true);
  setTimeout(resolve.bind(this), 1000);
};

var handler_2 = function (resolve, reject, options) {
  debug('hander 2', options);
  assert(options.extra === true);
  setTimeout(resolve.bind(this), 1000);
};

describe('Dispatcher', function () {

  it('should be able to add handlers', function (done) {
    this.timeout(TIMEOUT);
    dispatcher.addHandler(ACTION, handler_1);
    dispatcher.addHandler(ACTION, handler_2);
    dispatcher
    .dispatch(ACTION, { extra: true })
    .then(function () { done(); })
    .catch(function (err) { debug('err', err); });
  });

  it('should be able to remove handlers', function (done) {
    this.timeout(TIMEOUT);
    dispatcher.removeHandler(ACTION, handler_1);
    dispatcher.removeHandler(ACTION, handler_2);
    dispatcher
    .dispatch(ACTION, { extra: true })
    .then(function () { done(); })
    .catch(function (err) { debug('err', err); });
  });

  it('should throw errors', function () {
    this.timeout(TIMEOUT);
    try {
      dispatcher.addHandler(handler_1);
    } catch (err) {
      debug(err.message);
      assert(err instanceof dispatcher.InvalidAction);
    }
    try {
      dispatcher.removeHandler(handler_1);
    } catch (err) {
      debug(err.message);
      assert(err instanceof dispatcher.InvalidAction);
    }
    try {
      dispatcher.dispatch(handler_1);
    } catch (err) {
      debug(err.message);
      assert(err instanceof dispatcher.InvalidAction);
    }
  });
});
