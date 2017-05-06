'use strict';

const Template = require('./Template');

module.exports = Template({
  stateWidth: 256 * 256,
  inputWidth: 5,
  outputWidth: 2,
  calculate: (state, input, output) => {
    const readAddr0 = input(0);
    output(0, state.get(readAddr0));

    const readAddr1 = input(1);
    output(1, state.get(readAddr1));

    const writeEnabled = input(2) !== 0;

    if (!writeEnabled) {
      return;
    }

    const writeAddr = input(3);
    const writeValue = input(4);
    state.set(writeAddr, writeValue);
  },
  visualize: () => {},
});
