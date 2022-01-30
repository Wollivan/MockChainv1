const jayson = require("jayson");
const { PORT } = require("../config");

//crete a client
const client = jayson.client.http({
  port: PORT,
});

module.exports = client;
