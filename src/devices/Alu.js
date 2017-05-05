'use strict';

/* eslint-disable no-nested-ternary */

const Template = require('./Template');

module.exports = Template({
  stateWidth: 0,
  inputWidth: 3,
  outputWidth: 1,
  calculate: (state, input, output) => {
    const opType = input(0);
    const a = input(1);
    const b = input(2);

    output(0, (
      opType === 0 ? a + b :
      opType === 1 ? a - b :
      opType === 2 ? a * b :
      opType === 3 ? a / b :
      opType === 4 ? a % b :
      0
    ));
  },
  visualize: () => {},
});
