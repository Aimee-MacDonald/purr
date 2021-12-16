

const { expect } = require('chai')

describe('Purrer Integration', () => {
let signers, purrCoin, purrNFT, purrerFactory, clonedPurrerAddress, clonedPurrerAddress2, clonedPurrer, clonedPurrer2, loot

beforeEach(async () => {
  signers = await ethers.getSigners()

  const Purrer = await ethers.getContractFactory('Purrer')
  const PurrCoin = await ethers.getContractFactory('TIPurrCoin')
  const PurrNFT = await ethers.getContractFactory('PurrNFT')
  const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
  const Loot = await ethers.getContractFactory('PCLResetBalances')
  
  const purrer = await Purrer.deploy()
  purrCoin = await PurrCoin.deploy()
  purrNFT = await PurrNFT.deploy(purrCoin.address)
  loot = await Loot.deploy()
  purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address, purrNFT.address, loot.address)

  await purrerFactory.join()
  await purrerFactory.connect(signers[1]).join()
  
  clonedPurrerAddress = await purrerFactory.purrerAddress(signers[0].address)
/*   clonedPurrerAddress2 = await purrerFactory.purrerAddress(signers[1].address)

  clonedPurrer = await Purrer.attach(clonedPurrerAddress)
  clonedPurrer2 = await Purrer.attach(clonedPurrerAddress2) */
})



describe('Purring', () => {
  it('Should be able to mint a purrNFT to another purrer', async () => {
    expect(await purrCoin.mintAllowanceOf(clonedPurrer.address)).to.equal('1000000000000000000')
    expect(await purrCoin.mintAllowanceOf(clonedPurrer2.address)).to.equal('1000000000000000000')

    await clonedPurrer.purr(clonedPurrerAddress2, 'Message', '1000000000000000000')

    //expect(await purrCoin.mintAllowanceOf(clonedPurrer.address)).to.equal('0000000000000000000')
    //expect(await purrNFT.balanceOf(clonedPurrer2.address)).to.equal(1)
  })

/*   it('Should only be callable by the contract owner', () => {
    expect(clonedPurrer2.purr(clonedPurrerAddress, 'Message', '1000000000000000000')).to.be.revertedWith('Ownable: caller is not the owner')
  }) */
})
})