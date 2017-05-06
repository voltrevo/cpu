'use strict';

const Template = require('./Template');

const HALT = 0;            // Halt execution
const CHG_RAM = 1;         // Change to ram execution

const ADD = 2;             // Set ALU op to ADD
const SUB = 3;             // Set ALU op to SUB
const MUL = 4;             // Set ALU op to MUL
const DIV = 5;             // Set ALU op to DIV
const MOD = 6;             // Set ALU op to MOD

const PUSH_ALU = 7;        // Push the ALU output onto the stack
const PUSH_RAM = 8;        // Push the RAM output onto the stack

const PUSH_DUP = 9;        // Push the top value of the stack onto the stack

const POP_ALU_A = 10;      // Pop from the stack to ALU_A
const POP_ALU_B = 11;      // Pop from the stack to ALU_B
const POP_RAM_R_ADDR = 12; // Pop from the stack to RAM_R_ADDR
const POP_RAM_W_ADDR = 13; // Pop from the stack to RAM_W_ADDR
const POP_RAM_W_VAL = 14;  // Pop from the stack to RAM_W_VAL

const POP_PROG = 15;        // Pop from the stack to PROG
const POP_CND_EXEC = 16;    // Pop from the stack, and if zero, do an extra
                            // increment of PROG to skip next instruction

module.exports = Template({
  stateWidth: (
    1 + // Ram/rom flag
    1 + // Program counter
    1 + // Stack Ptr
    8   // Stack
  ),
  inputWidth: (
    1 + // Rom output
    2 + // Ram output
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

    output(4, writeRam);
    state.set(1, programCounter);
  },
  visualize: () => {},
});
