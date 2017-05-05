'use strict';

const Memory = require('./Memory');

module.exports = ({
  stateWidth,  // bytes of internal state
  inputWidth,  // bytes of input
  outputWidth, // bytes of output
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

    const state = Memory(stateWidth);

    device.tick = () => calculate(state, input.get, output.set);
    device.visualize = viz => visualize(state.get, input.get, output.get, viz);

    return device;
  },
});
