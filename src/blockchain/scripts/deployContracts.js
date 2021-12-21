const hre = require('hardhat')

async function main() {
  const Purrer = await hre.ethers.getContractFactory('Purrer')
  const Loot = await hre.ethers.getContractFactory('Loot')
  const LootFactory = await hre.ethers.getContractFactory('LootFactory')
  const PurrCoin = await hre.ethers.getContractFactory('PurrCoin')
  const PurrNFT = await hre.ethers.getContractFactory('PurrNFT')
  const PurrerFactory = await hre.ethers.getContractFactory('PurrerFactory')

  const purrer = await Purrer.deploy()
  await purrer.deployed()
  console.log(`Purrer deployed to: ${purrer.address}`)

  const loot = await Loot.deploy()
  await loot.deployed()
  console.log(`Loot deployed to: ${loot.address}`)

  const lootFactory = await LootFactory.deploy(loot.address)
  await lootFactory.deployed()
  console.log(`LootFactory deployed to: ${lootFactory.address}`)

  const purrCoin = await PurrCoin.deploy(lootFactory.address)
  await purrCoin.deployed()
  console.log(`PurrCoin deployed to: ${purrCoin.address}`)

  const purrNFT = await PurrNFT.deploy(purrCoin.address)
  await purrNFT.deployed()
  console.log(`PurrNFT deployed to: ${purrNFT.address}`)

  const purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address, purrNFT.address, lootFactory.address)
  await purrerFactory.deployed()
  console.log(`PurrerFactory deployed to: ${purrerFactory.address}`)

  await lootFactory.setPurrerFactory(purrerFactory.address)
  await purrCoin.setPurrerFactory(purrerFactory.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  