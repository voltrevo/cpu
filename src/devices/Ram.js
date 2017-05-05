'use strict';

const Template = require('./Template');

module.exports = Template({
  stateWidth: 256 * 256,
  inputWidth: 3,
  outputWidth: 1,
  calculate: (state, input, output) => {
    const isRead = input(0) === 0;
    const addr = input(1);

    if (isRead) {
      output(0, state.get(addr));
    } else {
      const valueToWrite = input(2);
      state.set(addr, valueToWrite);
    }
  },
  visualize: () => {},
});
