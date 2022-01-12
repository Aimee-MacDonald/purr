require("@nomiclabs/hardhat-waffle")
require('dotenv').config()

const INFURA_URL = process.env.INFURA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

module.exports = {
  solidity: "0.8.4",
  paths: {
    sources: './src/blockchain/contracts',
    cache: './src/blockchain/cache',
    artifacts: './src/frontend/artifacts',
    tests: './tests/blockchain/integration'
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
}