const hre = require('hardhat')

async function deployPurrCoin() {
  const PurrCoin = await hre.ethers.getContractFactory('PurrCoin')
  const purrCoin = await PurrCoin.deploy()

  await purrCoin.deployed()

  console.log(`PurrCoin deployed to: ${purrCoin.address}`)
}

async function main() {
  await deployPurrCoin()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });