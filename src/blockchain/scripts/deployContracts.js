const hre = require('hardhat')

async function main() {
  const PurrCoin = await hre.ethers.getContractFactory('PurrCoin')
  const LootFactory = await hre.ethers.getContractFactory('LootFactory')
  const PurrerImplementation = await hre.ethers.getContractFactory('Purrer')
  const PurrNFT = await hre.ethers.getContractFactory('PurrNFT')
  const Market = await hre.ethers.getContractFactory('Market')
  const PurrerFactory = await hre.ethers.getContractFactory('PurrerFactory')
  const ResetPurrCoin = await hre.ethers.getContractFactory('ResetPurrCoin')
  const IncreaseMintAllowance = await hre.ethers.getContractFactory('IncreaseMintAllowance')

  const lootFactory = await LootFactory.deploy()
  await lootFactory.deployed()
  console.log(`LootFactory deployed to: ${lootFactory.address}`)

  const purrCoin = await PurrCoin.deploy(lootFactory.address)
  await purrCoin.deployed()
  console.log(`PurrCoin deployed to: ${purrCoin.address}`)

  const purrerImplementation = await PurrerImplementation.deploy()
  await purrerImplementation.deployed()
  console.log(`PurrerImplementation deployed to: ${purrerImplementation.address}`)

  const purrNFT = await PurrNFT.deploy(purrCoin.address)
  await purrNFT.deployed()
  console.log(`PurrNFT deployed to: ${purrNFT.address}`)
  
  const market = await Market.deploy(lootFactory.address, purrCoin.address)
  await market.deployed()
  console.log(`Market deployed to: ${market.address}`)

  const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address, market.address)
  await purrerFactory.deployed()
  console.log(`PurrerFactory deployed to: ${purrerFactory.address}`)

  const resetPurrCoin = await ResetPurrCoin.deploy()
  await resetPurrCoin.deployed()
  console.log(`ResetPurrCoin deployed to: ${resetPurrCoin.address}`)

  const increaseMintAllowance = await IncreaseMintAllowance.deploy()
  await increaseMintAllowance.deployed()
  console.log(`IncreaseMintAllowance deployed to: ${increaseMintAllowance.address}`)

  await purrCoin.setPurrerFactory(purrerFactory.address)
  await purrCoin.setMarket(market.address)
  await lootFactory.setPurrerFactory(purrerFactory.address)

  await lootFactory.addLootType('RESET_PURRCOIN', resetPurrCoin.address)
  await lootFactory.addLootType('INCREASE_MINT_ALLOWANCE', increaseMintAllowance.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  