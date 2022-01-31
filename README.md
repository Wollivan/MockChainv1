This project uses the structure from one of the lectures on creating a blockchain, with a few added features, including:

- Automatic difficutly change based on settings you can set on the Blockchain class
  - Target time between mining block
  - Tolerance in milliseconds
  - How many blocks to check between
- Writing chain to JSON

## Instructions for use

`npm i`

### Open 2 terminals

In Terminal 1, navigate to root folder
In Terminal 2, navigate to /scripts folder

In Termainal 1:
`nodemon index`

In Termincal 2 use the following commands to start and stop the mining process:
`node startMining`
`node stopMining`

Check Terminal 1 for updates on the blocks bering mined, as well as the difficulty changing for the hash. Play around with the parameters in /models/Blockchain.js to see the difficlty changing at work.
