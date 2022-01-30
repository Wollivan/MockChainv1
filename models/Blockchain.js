const fs = require("fs");
const defaultDifficultyModifier = 1;
const TARGET_DIFFICULTY = BigInt(
  "0x" +
    "0".repeat(defaultDifficultyModifier) +
    "F".repeat(64 - defaultDifficultyModifier)
);

class Blockchain {
  constructor() {
    this.blocks = [];
    this.timestampArr = [];
    this.targetTime = 1000; //miliseconds between blocks desired
    this.tolerance = 100; //for checking if increasing/decreasing is needed
    this.difficultyModifier = defaultDifficultyModifier; //default number of leading 0s
    this.blockCheckInterval = 5; //how often we should check the average
    this.TARGET_DIFFICULTY = TARGET_DIFFICULTY;
  }

  //pushes block to chain
  addBlock(block) {
    //add previous hash
    if (this.blocks.length) {
      block.previousHash = block.hash(this.blocks[this.blocks.legnth - 1]);
    }

    //push new block (congrats)
    this.blocks.push(block);

    //add to json
    console.log("Before file sync", this.TARGET_DIFFICULTY);
    // write JSON string to a file
    fs.writeFileSync("blockchain.json", JSON.stringify(this.blocks), (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });
    console.log("After file sync", this.TARGET_DIFFICULTY);
  }

  //how many blocks inside the blockchain
  blockHeight() {
    return this.blocks.length;
  }

  calculateDifficulty(blockTimestamp) {
    //push timestamp into array to check
    this.timestampArr.push(blockTimestamp);

    let times = [];

    //when there are enough items to check the average for (this.blockCheckInterval) then begin check
    if (this.timestampArr.length === this.blockCheckInterval) {
      console.log("Adjusting difficulty:");

      //get the time between blocks
      for (let i = 0; i < this.blockCheckInterval - 1; i++) {
        times.push(this.timestampArr[i + 1] - this.timestampArr[i]);
      }
      //get the average time
      const sum = times.reduce((a, b) => a + b, 0);
      const averageTime = sum / times.length || 0;

      const lowTarget = this.targetTime - this.tolerance;
      const highTarget = this.targetTime + this.tolerance;

      //Adjust difficutly based on average time to target time with a tolerance of half a second
      if (averageTime > highTarget) {
        //if its more that target difficulty, decrese it by 1 leading 0
        console.log(
          "Average time between blocks in miliseconds is",
          averageTime,
          "Decresing difficulty"
        );
        this.difficultyModifier--;
      } else if (averageTime < lowTarget) {
        //if its less that target difficulty, increse it by 1 leading 0
        console.log(
          "Average time between blocks in miliseconds is",
          averageTime,
          "Increasing difficulty"
        );
        this.difficultyModifier++;
      } else {
        console.log(
          "Average time between blocks in miliseconds is",
          averageTime,
          "This is within the target range, no change."
        );
      }

      console.log(
        "Current difficulty",
        this.difficultyModifier,
        "leading zeros"
      );
      //reset the difficulty
      this.TARGET_DIFFICULTY = BigInt(
        "0x" +
          "0".repeat(this.difficultyModifier) +
          "F".repeat(64 - this.difficultyModifier)
      );

      //then reset the array ready for next block
      this.timestampArr = [];
    }
  }
}

module.exports = Blockchain;
