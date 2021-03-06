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

const WAIT = 17;           // Do nothing this cycle

// const PUSH_X = 32768+X  // The top half of the instruction space is reserved
                           // for literals. It means subtract 32768 from the
                           // instruction value (ignore highest bit) and push
                           // that onto the stack.
                           // E.g. PUSH_0 is 32768, PUSH_5 is 32773, etc.

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

    // Increment program counter by default
    let programCounter = state.get(1) + 1;

    let stackPtr = state.get(2) % 8;
    const stackTop = () => state.get(3 + stackPtr);

    const push = (value) => {
      stackPtr = (stackPtr + 1) % 8;
      state.set(3 + stackPtr, value);
    };

    const pop = () => {
      const ret = state.get(3 + stackPtr);
      stackPtr = (stackPtr + 8 - 1) % 8;
      return ret;
    };

    switch (instruction) {
      case HALT: {
        // Cancel out the default increment so nothing changes
        programCounter--;
        break;
      }

      case CHG_RAM: {
        execRom = false;
        state.set(0, 1);
        break;
      }

      case ADD: { output(5, 0); break; }
      case SUB: { output(5, 1); break; }
      case MUL: { output(5, 2); break; }
      case DIV: { output(5, 3); break; }
      case MOD: { output(5, 4); break; }

      case PUSH_RAM: { push(input(2)); break; }
      case PUSH_ALU: { push(input(3)); break; }

      case PUSH_DUP: { push(stackTop); break; }

      case POP_RAM_R_ADDR: { output(2, pop()); break; }
      case POP_RAM_W_ADDR: { output(3, pop()); break; }
      case POP_RAM_W_VAL: { output(4, pop()); break; }
      case POP_ALU_A: { output(6, pop()); break; }
      case POP_ALU_B: { output(7, pop()); break; }

      case POP_PROG: { programCounter = pop(); break; }

      case POP_CND_EXEC: {
        if (pop() === 0) {
          programCounter++;
        }
        break;
      }

      case WAIT: {
        // Do nothing (program counter will still increment)
        break;
      }

      default: {
        if (instruction > 32768) {
          push(instruction - 32768);
        }
      }
    }

    state.set(2, stackPtr);

    // Send the program counter to rom/ram so we get the next instruction on the
    // next cycle
    if (execRom) {
      output(0, programCounter);
    } else {
      output(1, programCounter);
    }

    state.set(1, programCounter);
  },
  visualize: () => {},
});
