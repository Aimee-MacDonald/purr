const { expect } = require('chai')

describe('PurrNFT', () => {
  let signers, purrCoin, purrNFT

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    purrCoin = await PurrCoin.deploy()

    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    purrNFT = await PurrNFT.deploy(purrCoin.address)

    await purrCoin.addMinter(signers[0].address)
    await purrCoin.addMinter(signers[1].address)
  })

  describe('Minting', () => {
    it('Should mint a PurrNFT', async () => {
      expect(await purrNFT.balanceOf(signers[1].address)).to.equal(0)
  
      await purrCoin.approve(purrNFT.address, 1)
      await purrNFT.mint(signers[1].address, 'Message', 1)
  
      expect(await purrNFT.balanceOf(signers[1].address)).to.equal(1)
    })

    it('Should wrap PurrCoin', async () => {
      let senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      let purrNFTBalance = await purrCoin.balanceOf(purrNFT.address)
      expect(senderAllowance).to.equal(1)
      expect(purrNFTBalance).to.equal(0)

      await purrCoin.approve(purrNFT.address, 1)
      await purrNFT.mint(signers[1].address, 'Message', 1)

      senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      purrNFTBalance = await purrCoin.balanceOf(purrNFT.address)
      expect(senderAllowance).to.equal(0)
      expect(purrNFTBalance).to.equal(1)
    })
  })

  describe('Redemption', () => {
    it('Should transfer PurrCoin from PurrNFT to reciever', async () => {
      await purrCoin.approve(purrNFT.address, 1)
      await purrNFT.mint(signers[1].address, 'Message', 1)

      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(1)
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal(0)

      await purrNFT.connect(signers[1]).redeem(0)

      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(0)
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal(1)
    })

    it('Should update internal metadata redeemed status', async () => {
      await purrCoin.approve(purrNFT.address, 1)
      await purrNFT.mint(signers[1].address, 'Message', 1)
      
      let mintData = await purrNFT.getMintData(0)
      expect(mintData.isRedeemed).to.equal(false)

      await purrNFT.connect(signers[1]).redeem(0)

      mintData = await purrNFT.getMintData(0)
      expect(mintData.isRedeemed).to.equal(true)
    })
  })
})