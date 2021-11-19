const hre = require('hardhat')

async function main() {
  const PurrCoin = await hre.ethers.getContractFactory('PurrCoin')
  const PurrNFT = await hre.ethers.getContractFactory('PurrNFT')
  const Purrer = await hre.ethers.getContractFactory('Purrer')
  const PurrerFactory = await hre.ethers.getContractFactory('PurrerFactory')

  const purrCoin = await PurrCoin.deploy()
  await purrCoin.deployed()

  const purrNFT = await PurrNFT.deploy(purrCoin.address)
  const purrer = await Purrer.deploy()
  
  await purrNFT.deployed()
  await purrer.deployed()
  
  const purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address, purrNFT.address)
  await purrerFactory.deployed()

  console.log(`PurrCoin deployed to: ${purrCoin.address}`)
  console.log(`PurrNFT deployed to: ${purrNFT.address}`)
  console.log(`Purrer deployed to: ${purrer.address}`)
  console.log(`PurrerFactory deployed to: ${purrerFactory.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  