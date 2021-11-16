const hre = require('hardhat')

async function main() {
  const PurrCoin = await hre.ethers.getContractFactory('PurrCoin')
  const PurrNFT = await hre.ethers.getContractFactory('PurrNFT')
  const Purrer = await hre.ethers.getContractFactory('Purrer')
  const PurrerFactory = await hre.ethers.getContractFactory('PurrerFactory')

  const purrCoin = await PurrCoin.deploy()
  const purrNFT = await PurrNFT.deploy()
  const purrer = await Purrer.deploy()
  
  await purrCoin.deployed()
  await purrNFT.deployed()
  await purrer.deployed()
  
  const purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address)
  await purrerFactory.deployed()

  await purrNFT.setCoinContract(purrCoin.address)

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
  