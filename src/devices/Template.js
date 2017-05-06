'use strict';

const Memory = require('../Memory');

module.exports = ({
  stateWidth,  // words of internal state
  inputWidth,  // words of input
  outputWidth, // words of output
  calculate,   // (state, input, output) => void
  visualize,   // (state, input, output, viz) => void
}) => ({
  inputWidth,
  outputWidth,
  Device: ({
    input,
    output,
  }) => {
    const device = {};

    const state = Memory(stateWidth).Interface();

    device.tick = () => calculate(state, input.get, output.set);
    device.visualize = viz => visualize(state.get, input.get, output.get, viz);

    return device;
  },
});
