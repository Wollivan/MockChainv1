const { utxos } = require("../db");

class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
  }
  execute() {
    // mark all UTXOs as spent
    this.inputs.forEach((input) => {
      input.spent = true;
    });
    // add all utxos to the db so we can see them
    this.outputs.forEach((output) => {
      utxos.push(output);
    });
  }
}

module.exports = Transaction;
