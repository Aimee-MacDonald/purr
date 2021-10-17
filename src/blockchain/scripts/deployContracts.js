const hre = require('hardhat')

async function main() {
  const PurrCoin = await hre.ethers.getContractFactory('PurrCoin')
  const PurrNFT = await hre.ethers.getContractFactory('PurrNFT')

  const purrCoin = await PurrCoin.deploy()
  const purrNFT = await PurrNFT.deploy()

  await purrCoin.deployed()
  await purrNFT.deployed()

  await purrNFT.setCoinContract(purrCoin.address)

  console.log(`PurrCoin deployed to: ${purrCoin.address}`)
  console.log(`PurrNFT deployed to: ${purrNFT.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  