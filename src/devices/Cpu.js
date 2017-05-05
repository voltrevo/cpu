'use strict';

const Template = require('./Template');

module.exports = Template({
  stateWidth: (
    1 + // Ram/rom flag
    1 + // Program counter
    8   // Registers
  ),
  inputWidth: (
    1 + // Rom output
    1 + // Ram output
    1 + // Alu output
    0   // TODO: CustomDevices output
  ),
  outputWidth: (
    1 + // Rom input
    4 + // Ram input
    3 + // Alu input
    0   // TODO: CustomDevices input
  ),
  calculate: (state, input, output) => {
    let execRom = state.get(0) === 0;
    const instruction = execRom ? input(0) : input(1);
    let writeRam = 0;

    // Increment program counter by default
    let programCounter = state.get(1) + 1;

    // TODO: Run instruction

    // Send the program counter to rom/ram so we get the next instruction on the
    // next cycle
    if (execRom) {
      output(0, programCounter);
    } else {
      output(1, programCounter);
    }

    output(2, writeRam);
    state.set(1, programCounter);
  },
  visualize: () => {},
});
