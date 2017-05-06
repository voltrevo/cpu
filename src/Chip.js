'use strict';

const BufferedMemory = require('./BufferedMemory.js');

const Alu = require('./devices/Alu.js');
const Cpu = require('./devices/Cpu.js');
const Ram = require('./devices/Ram.js');
const Rom = require('./devices/Rom.js');

const range = n => (new Array(n)).fill(0).map((x, i) => i);

const partition = (memory, sizes) => {
  const partitions = [];

  let pos = 0;
  for (const sz of sizes) {
    partitions.push(memory.Sub(pos, pos + sz));
    pos += sz;
  }

  return partitions;
};

module.exports = () => {
  const devices = [];
  const sz = Cpu.inputWidth + Cpu.outputWidth;
  const buf = BufferedMemory(sz);

  const [cpuIn, cpuOut] = partition(buf.memory, [
    Cpu.inputWidth,
    Cpu.outputWidth,
  ]);

  const cpu = Cpu.Device({
    input: cpuIn.Interface(),
    output: cpuOut.Interface(),
  });

  devices.push(cpu);

  const [romIn, ramIn, aluIn] = partition(cpuOut, [
    Rom.inputWidth,
    Ram.inputWidth,
    Alu.inputWidth,
  ]).map(m => m.Interface());

  const [romOut, ramOut, aluOut] = partition(cpuIn, [
    Rom.outputWidth,
    Ram.outputWidth,
    Alu.outputWidth,
  ]).map(m => m.Interface());

  const rom = Rom.Device({ input: romIn, output: romOut });
  const ram = Ram.Device({ input: ramIn, output: ramOut });
  const alu = Alu.Device({ input: aluIn, output: aluOut });

  devices.push(rom, ram, alu);

  const mem = buf.memory.Interface();

  return {
    tick: () => {
      devices.forEach(dev => dev.tick());
      buf.flush();
    },
    visualize: (viz) => {
      devices.forEach(dev => dev.visualize(viz));
      return range(sz).map(i => mem.get(i));
    },
  };
};
