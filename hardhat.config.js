require("@nomiclabs/hardhat-waffle");

const INFURA_URL = 'https://ropsten.infura.io/v3/f3a1a5f7ab254f30b3665488d7a83cb2';
const PRIVATE_KEY = '';

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  paths: {
    sources: './src/blockchain/contracts',
    cache: './src/blockchain/cache',
    artifacts: './src/frontend/artifacts',
    tests: './tests/blockchain/active'
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
