'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var process = require('process');
var path = require('path');

function _delimiter() {
  return path.delimiter;
}
function _split(str, delim = path.delimiter) {
  return str.split(delim);
}
function _join(array, delim = path.delimiter) {
  return array.join(delim);
}
function _pathString(str, delim) {
  return _pathArray(_split(str, delim), delim);
}
function _pathArray(array, delim = path.delimiter) {
  const append = addend => _pathArray(array.concat(...addend), delim);

  const prepend = addend => _pathArray(addend.concat(...array), delim);

  const surround = addend => _pathArray(addend.concat(...array).concat(...addend), delim);

  const deduplicate = () => _pathArray(Array.from(new Set(array)), delim);

  return {
    get: {
      array: () => array,
      string: () => _join(array, delim),
      delim: () => delim
    },
    set: {
      array: x => _pathArray(x, delim),
      string: x => _pathString(x, delim),
      delim: x => _pathArray(array, x)
    },
    append,
    prepend,
    surround,
    deduplicate
  };
}
function _pathEnv(env, name = 'PATH', delim = path.delimiter) {
  const {
    [name]: str = '',
    ...restEnv
  } = env;

  const factory = _pathString(str, delim);

  function main(factory, name, delim) {
    const replaceFactory = x => main(x, name, x.get.delim());

    return {
      get: {
        path: {
          name: () => name,
          factory: () => factory
        },
        env: () => ({
          [name]: factory.get.string(),
          ...restEnv
        }),
        rest: () => restEnv
      },
      set: {
        factory: replaceFactory,
        name: x => main(factory, x),
        delim: x => main(factory, name)
      },
      path: {
        get: { ...factory.get,
          factory: () => factory,
          name: () => name
        },
        set: {
          factory: replaceFactory,
          string: x => main(factory.set.string(x), name),
          array: x => main(factory.set.array(x), name),
          delim: x => main(factory.set.delim(x), name),
          name: x => main(factory, x)
        },
        append: addend => replaceFactory(factory.append(addend)),
        prepend: addend => replaceFactory(factory.prepend(addend)),
        surround: addend => replaceFactory(factory.surround(addend)),
        deduplicate: () => replaceFactory(factory.deduplicate())
      }
    };
  }

  return main(factory, name);
}

exports.EnumPathDelimiter = void 0;

(function (EnumPathDelimiter) {
  EnumPathDelimiter["poxix"] = ":";
  EnumPathDelimiter["win32"] = ";";
})(exports.EnumPathDelimiter || (exports.EnumPathDelimiter = {}));

function pathString(str = process.env['PATH'] || '', delim) {
  return _pathString(str, delim);
}
function pathEnv(envObject = process.env, name, delim) {
  return _pathEnv(envObject, name, delim);
}

exports._delimiter = _delimiter;
exports._join = _join;
exports._pathArray = _pathArray;
exports._pathEnv = _pathEnv;
exports._pathString = _pathString;
exports._split = _split;
exports["default"] = pathEnv;
exports.pathEnv = pathEnv;
exports.pathString = pathString;
//# sourceMappingURL=index.cjs.development.cjs.map
