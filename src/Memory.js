'use strict';

const assert = require('assert');

module.exports = (n) => {
  const data = new Uint8Array(n);

  const SubMemory = (begin, end) => {
    const memory = {};

    assert(end >= begin);
    assert(begin >= 0);
    assert(end >= 0);

    memory.size = () => end - begin;

    memory.Sub = (subBegin, subEnd) => {
      assert(subBegin >= 0);
      assert(begin + subEnd <= end);

      return SubMemory(begin + subBegin, begin + subEnd);
    };

    memory.Interface = (() => {
      const sz = end - begin;
      // eslint-disable-next-line yoda
      const check = i => assert(0 <= i && i < sz);

      return {
        get: (i) => { check(i); return data[begin + i]; },
        // eslint-disable-next-line no-param-reassign
        set: (i, x) => { check(i); data[begin + i] = x; },
      };
    })();

    return memory;
  };

  return SubMemory(0, n);
};
