const Block = require("./models/Block");
const Transaction = require("./models/Transaction");
const UTXO = require("./models/UTXO");
const { PUBLIC_KEY } = require("./config");
const db = require("./db");
//const TARGET_DIFFICULTY = BigInt("0x" + "0".repeat(4) + "F".repeat(60)); //we are using the one from the Blockchain class that gets changed as we go
const BLOCK_REWARD = 10;

//start by not mining until prompted
let mining = false;

function startMining() {
  mining = true;
  mine();
}
function stopMining() {
  mining = false;
}

function mine() {
  if (!mining) return; //this stops the function from running the next one when you run stopMining

  const block = new Block();

  //Need to add transactions from mempool

  const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  while (BigInt("0x" + block.hash()) >= db.blockchain.TARGET_DIFFICULTY) {
    block.nonce++;
  }

  block.execute();

  //add block to chain
  db.blockchain.addBlock(block);

  //a very nice way of checking the blocks
  //   console.log(
  //     `Just mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${
  //       block.nonce
  //     }`
  //   );

  console.log(
    `Mined block #${db.blockchain.blockHeight()} at nonce ${block.nonce}`
  );

  db.blockchain.calculateDifficulty(block.timestamp);

  mine(); //go again, what are you waiting for we need that reward!
}

module.exports = {
  startMining,
  stopMining,
};
