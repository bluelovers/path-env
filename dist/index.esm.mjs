import { env as t } from "process";

import { delimiter as r } from "path";

function _delimiter() {
  return r;
}

function _split(t, n = r) {
  return t.split(n);
}

function _join(t, n = r) {
  return t.join(n);
}

function _pathString(t, r) {
  return _pathArray(_split(t, r), r);
}

function _pathArray(t, n = r) {
  return {
    get: {
      array: () => t,
      string: () => _join(t, n),
      delim: () => n
    },
    set: {
      array: t => _pathArray(t, n),
      string: t => _pathString(t, n),
      delim: r => _pathArray(t, r)
    },
    append: r => _pathArray(t.concat(...r), n),
    prepend: r => _pathArray(r.concat(...t), n),
    surround: r => _pathArray(r.concat(...t).concat(...r), n),
    deduplicate: () => _pathArray(Array.from(new Set(t)), n)
  };
}

function _pathEnv(t, n = "PATH", a = r) {
  const {[n]: e = "", ...i} = t;
  return function main(t, r, n) {
    const replaceFactory = t => main(t, r, t.get.delim());
    return {
      get: {
        path: {
          name: () => r,
          factory: () => t
        },
        env: () => ({
          [r]: t.get.string(),
          ...i
        }),
        rest: () => i
      },
      set: {
        factory: replaceFactory,
        name: r => main(t, r),
        delim: n => main(t, r)
      },
      path: {
        get: {
          ...t.get,
          factory: () => t,
          name: () => r
        },
        set: {
          factory: replaceFactory,
          string: n => main(t.set.string(n), r),
          array: n => main(t.set.array(n), r),
          delim: n => main(t.set.delim(n), r),
          name: r => main(t, r)
        },
        append: r => replaceFactory(t.append(r)),
        prepend: r => replaceFactory(t.prepend(r)),
        surround: r => replaceFactory(t.surround(r)),
        deduplicate: () => replaceFactory(t.deduplicate())
      }
    };
  }(_pathString(e, a), n);
}

var n;

function pathString(r = t.PATH || "", n) {
  return _pathString(r, n);
}

function pathEnv(r = t, n, a) {
  return _pathEnv(r, n, a);
}

!function(t) {
  t.poxix = ":", t.win32 = ";";
}(n || (n = {}));

export { n as EnumPathDelimiter, _delimiter, _join, _pathArray, _pathEnv, _pathString, _split, pathEnv as default, pathEnv, pathString };
//# sourceMappingURL=index.esm.mjs.map
