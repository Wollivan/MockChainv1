const jayson = require("jayson");
const { PORT } = require("./config");
const { startMining, stopMining } = require("./mine");
const { utxos } = require("./db");

//create a server
const server = jayson.server({
  //   add: function (args, callback) {
  //     callback(null, args[0] + args[1]);
  //   },
  startMining: function (_, callback) {
    callback(null, "Started mining");
    startMining(); //actually start mining
  },

  stopMining: function (_, callback) {
    stopMining(); //actually stop mining
    callback(null, "Stopped mining");
  },

  getBalance: function ([address], callback) {
    //get all utxos that haven't been spent, and are owned by our miner
    const ourUTXOs = utxos.filter((x) => {
      return x.owner === address && !x.spent;
    });
    const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
    callback(null, sum);
  },
});

server.http().listen(PORT);
