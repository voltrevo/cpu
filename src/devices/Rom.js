'use strict';

const Template = require('./Template');

const romMemory = Uint16Array.from([
  // TODO: Program that copies startup program from disk into ram and starts
  // running it.
]);

module.exports = Template({
  stateWidth: 0,
  inputWidth: 1,
  outputWidth: 1,
  calculate: (state, input, output) => {
    const addr = input(0);
    output(0, romMemory[addr]);
  },
  visualize: () => {},
});
