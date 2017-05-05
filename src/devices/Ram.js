'use strict';

const Template = require('./Template');

module.exports = Template({
  stateWidth: 256 * 256,
  inputWidth: 4,
  outputWidth: 1,
  calculate: (state, input, output) => {
    const readAddr = input(0);
    output(0, state.get(readAddr));

    const writeEnabled = input(1) !== 0;

    if (!writeEnabled) {
      return;
    }

    const writeAddr = input(2);
    const writeValue = input(3);
    state.set(writeAddr, writeValue);
  },
  visualize: () => {},
});
