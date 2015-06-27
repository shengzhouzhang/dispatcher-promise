
import _ from 'lodash';
import Promise from 'bluebird';
import Debug from 'debug';

let _handlers = {};
let debug = Debug('dispatcher');

function addHandler (action, handler) {
  debug(`add handler`);
  if(typeof action !== 'string') { throw new Error ('invalid action type'); }
  if(!_handlers[action]) { _handlers[action] = []; }
  _handlers[action].push(handler);
};

function removeHandler (action, handler) {
  debug(`remove handler`);
  if(typeof action !== 'string') { throw new Error ('invalid action type'); }
  if(!_handlers[action]) { return; }
  _.remove(_handlers[action], fn => fn === handler);
};

function dispatch (action, options) {
  debug(`dispatch ${action}`);
  return Promise.all(
    _.map(_handlers[action],
      handler => new Promise((resolve, reject) => {
        return handler(resolve, reject, options);
      })
    )
  )
  .then(results => {
    if (results.length === 0) { return null; }
    else if (results.length === 1) { return _.first(results); }
    else { return results; }
  });
};

export default { addHandler, removeHandler, dispatch };
