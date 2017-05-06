'use strict';

const Template = require('./Template');

const HALT = 0;            // Halt execution
const CHG_RAM = 1;         // Change to ram execution

const ADD = 2;             // Set ALU op to ADD
const SUB = 3;             // Set ALU op to SUB
const MUL = 4;             // Set ALU op to MUL
const DIV = 5;             // Set ALU op to DIV
const MOD = 6;             // Set ALU op to MOD

const PUSH_RAM = 7;        // Push the RAM output onto the stack
const PUSH_ALU = 8;        // Push the ALU output onto the stack

const PUSH_DUP = 9;        // Push the top value of the stack onto the stack

const POP_RAM_R_ADDR = 10; // Pop from the stack to RAM_R_ADDR
const POP_RAM_W_ADDR = 11; // Pop from the stack to RAM_W_ADDR
const POP_RAM_W_VAL = 12;  // Pop from the stack to RAM_W_VAL
const POP_ALU_A = 13;      // Pop from the stack to ALU_A
const POP_ALU_B = 14;      // Pop from the stack to ALU_B

const POP_PROG = 15;       // Pop from the stack to PROG
const POP_CND_EXEC = 16;   // Pop from the stack, and if zero, do an extra
                           // increment of PROG to skip next instruction

// const PUSH_X = 32768+X  // The top half of the instruction space is reserved
                           // for literals. It means subtract 32768 from the
                           // instruction value (ignore highest bit) and push
                           // that onto the stack.
                           // E.g. PUSH_0 is 32768, PUSH_5 is 32773, etc.

const WAIT = 17;           // Do nothing this cycle

const push = x => 32768 + x;

const romMemory = Uint16Array.from([
  push(3),
  push(5),
  POP_ALU_B,
  POP_ALU_A,
  MUL,
  WAIT,
  PUSH_RAM,
  HALT,
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
