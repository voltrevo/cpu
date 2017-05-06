'use strict';

const Template = require('./Template');

module.exports = Template({
  stateWidth: 256 * 256,
  inputWidth: 4,
  outputWidth: 2,
  calculate: (state, input, output) => {
    const readAddr0 = input(0);
    output(0, state.get(readAddr0));

    const readAddr1 = input(1);
    output(1, state.get(readAddr1));

    const writeAddr = input(2);
    const writeValue = input(3);
    state.set(writeAddr, writeValue);
  },
  visualize: () => {},
});
