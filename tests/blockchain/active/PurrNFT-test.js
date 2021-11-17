const { expect } = require("chai")

describe("PurrNFT", () => {
  let PurrNFT, purrNFT, PurrCoin, purrCoin, owner, addr1, addr2

  beforeEach(async () => {
    [owner, addr1, addr2, _] = await ethers.getSigners()

    PurrCoin = await ethers.getContractFactory('PurrCoin')
    purrCoin = await PurrCoin.deploy()

    PurrNFT = await ethers.getContractFactory('PurrNFT')
    purrNFT = await PurrNFT.deploy(purrCoin.address)
  })

  describe('Minting', () => {
    it('When minting, Should send a new unique NFT to reciever', async () => {
      expect(await purrNFT.balanceOf(addr1.address)).to.equal(0)
      expect(await purrNFT.balanceOf(addr2.address)).to.equal(0)

      await purrCoin.approve(purrNFT.address, '10000000000000000000')
      await purrNFT.mint(addr1.address, "Prrrr", '10000000000000000000')

      await purrCoin.approve(purrNFT.address, '10000000000000000000')
      await purrNFT.mint(addr2.address, "Prrrr", '10000000000000000000')

      expect(await purrNFT.balanceOf(addr1.address)).to.equal(1)
      expect(await purrNFT.balanceOf(addr2.address)).to.equal(1)
    })

    it('When minted, Should store metadata about the transaction', async () => {
      const message = 'Prrrr'
      const value = '10000000000000000000'

      await purrCoin.approve(purrNFT.address, '10000000000000000000')
      await purrNFT.mint(addr1.address, message, value)

      const mintData = await purrNFT.getMintData(0)

      expect(mintData.from).to.equal(owner.address)
      expect(mintData.to).to.equal(addr1.address)
      expect(mintData.timeStamp.toString()).to.not.equal('')
      expect(mintData.message).to.equal("Prrrr")
      expect(mintData.value).to.equal(value)
    })

    it('When minting, Should wrap $PURR', async () => {
      const allowance = await purrCoin.mintAllowanceOf(owner.address)
      expect(allowance).to.equal('30000000000000000000')

      purrCoin.approve(purrNFT.address, '10000000000000000000')

      const message = 'Prrrr'
      const value = '10000000000000000000'
      await purrNFT.mint(addr1.address, message, value)

      expect(await purrNFT.balanceOf(addr1.address)).to.equal(1)
      expect(await purrCoin.mintAllowanceOf(owner.address)).to.equal('20000000000000000000')
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(value)
      expect(await purrCoin.balanceOf(owner.address)).to.equal('50000000000000000000')
    })
  })

  describe('Redemption', () => {
    it('When not the owner, Should revert', async () => {
      const message = 'Prrrr'
      const value = '10000000000000000000'

      await purrCoin.approve(purrNFT.address, value)
      await purrNFT.mint(addr1.address, message, value)

      expect(await purrNFT.balanceOf(addr1.address)).to.equal(1)
      expect(await purrCoin.balanceOf(owner.address)).to.equal('50000000000000000000')

      let mintData = await purrNFT.getMintData(0)
      expect(mintData.value).to.equal(value)
      expect(mintData.isRedeemed).to.equal(false)

      expect(purrNFT.redeem(0)).to.be.revertedWith('This Token does not Belong to you')
    })

    it('When redeemed, Should fund the owners wallet', async () => {
      const message = 'Prrrr'
      const value = '10000000000000000000'

      await purrCoin.approve(purrNFT.address, value)
      await purrNFT.mint(addr1.address, message, value)

      expect(await purrNFT.balanceOf(addr1.address)).to.equal(1)
      expect(await purrCoin.balanceOf(addr1.address)).to.equal('0')

      let mintData = await purrNFT.getMintData(0)
      expect(mintData.value).to.equal(value)
      expect(mintData.isRedeemed).to.equal(false)

      await purrNFT.connect(addr1).redeem(0)

      expect(await purrCoin.balanceOf(addr1.address)).to.equal('10000000000000000000')
      mintData = await purrNFT.getMintData(0)
      expect(mintData.isRedeemed).to.equal(true)
    })

    it('When already redeemed, Should revert', async () => {
      const message = 'Prrrr'
      const value = '10000000000000000000'

      await purrCoin.approve(purrNFT.address, value)
      await purrNFT.mint(addr1.address, message, value)

      expect(await purrNFT.balanceOf(addr1.address)).to.equal(1)
      expect(await purrCoin.balanceOf(addr1.address)).to.equal('0')

      let mintData = await purrNFT.getMintData(0)
      expect(mintData.value).to.equal(value)
      expect(mintData.isRedeemed).to.equal(false)

      await purrNFT.connect(addr1).redeem(0)
      expect(purrNFT.connect(addr1).redeem(0)).to.be.revertedWith('Tokens Already Redeemed')
    })
  })
})