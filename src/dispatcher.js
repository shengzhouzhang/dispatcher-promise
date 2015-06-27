
import Debug from 'debug';

let _handlers = {};
let debug = Debug('dispatcher');

function addHandler (action, handler) {
  debug(`add handler`);
  if(typeof action !== 'string') { throw new InvalidAction(); }
  if(!_handlers[action]) { _handlers[action] = []; }
  _handlers[action].push(handler);
};

function removeHandler (action, handler) {
  debug(`remove handler`);
  if(typeof action !== 'string') { throw new InvalidAction(); }
  let handlers, index;
  if(!(handlers = _handlers[action]) ||
     (index = handlers.indexOf(handler)) === -1) {
    return;
  }
  handlers.splice(index, 1);
};

function dispatch (action, options) {
  debug(`dispatch ${action}`);
  if(typeof action !== 'string') { throw new InvalidAction(); }
  return Promise.all(
    _handlers[action].map(
      handler => new Promise((resolve, reject) => {
        return handler(resolve, reject, options);
      })
    )
  )
  .then(results => {
    if (!results || !results.length) { return null; }
    else if (results.length === 1) { return results.pop(); }
    else { return results; }
  });
};

class InvalidAction extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidAction';
    this.message = message || 'invalid action type';
  }
}

export default { addHandler, removeHandler, dispatch, InvalidAction };
