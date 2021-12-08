const { expect } = require("chai")

describe("PurrNFT", () => {
  let signers, purrNFT, purrCoin
  let clonedPurrer, clonedPurrerAddress, clonedPurrer2, clonedPurrerAddress2

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrCoin = await ethers.getContractFactory('TIPurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    const Purrer = await ethers.getContractFactory('Purrer')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const Loot = await ethers.getContractFactory('PCLResetBalances')
    
    const purrer = await Purrer.deploy()
    purrCoin = await PurrCoin.deploy()
    purrNFT = await PurrNFT.deploy(purrCoin.address)
    const loot = await Loot.deploy()
    const purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address, purrNFT.address, loot.address)

    await purrerFactory.join()
    await purrerFactory.connect(signers[1]).join()
    
    clonedPurrerAddress = await purrerFactory.purrerAddress(signers[0].address)
    clonedPurrerAddress2 = await purrerFactory.purrerAddress(signers[1].address)

    clonedPurrer = await Purrer.attach(clonedPurrerAddress)
    clonedPurrer2 = await Purrer.attach(clonedPurrerAddress2)
  })

  describe('Minting', () => {
    it('Can be minted by a purrer', async () => {
      let senderAllowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      let recieverBalance = await purrNFT.balanceOf(clonedPurrerAddress2)

      expect(senderAllowance).to.equal('1000000000000000000')
      expect(recieverBalance).to.equal(0)

      await clonedPurrer.purr(clonedPurrerAddress2, 'Message', '1000000000000000000')

      senderAllowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      recieverBalance = await purrNFT.balanceOf(clonedPurrerAddress2)

      expect(senderAllowance).to.equal(0)
      expect(recieverBalance).to.equal(1)
    })

    it('Can not be minted by a non Purrer', async () => {
      let senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      let recieverBalance = await purrNFT.balanceOf(clonedPurrerAddress)

      expect(senderAllowance).to.equal('30000000000000000000')
      expect(recieverBalance).to.equal(0)

      await purrCoin.approve(purrNFT.address, '10000000000000000000')
      expect(purrNFT.mint(clonedPurrerAddress, "Message", '10000000000000000000')).to.be.revertedWith('PurrNFT: Only Purrers')

      senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      recieverBalance = await purrNFT.balanceOf(clonedPurrerAddress)

      expect(senderAllowance).to.equal('30000000000000000000')
      expect(recieverBalance).to.equal(0)
    })

    it('Can not be minted to a non Purrer', async () => {
      let senderAllowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      let recieverBalance = await purrNFT.balanceOf(signers[0].address)

      expect(senderAllowance).to.equal('1000000000000000000')
      expect(recieverBalance).to.equal(0)

      expect(clonedPurrer.purr(signers[0].address, 'Message', '1000000000000000000')).to.be.revertedWith('PurrNFT: Only Purrers')

      senderAllowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      recieverBalance = await purrNFT.balanceOf(signers[0].address)

      expect(senderAllowance).to.equal('1000000000000000000')
      expect(recieverBalance).to.equal(0)
    })

    it('When minted, Should store metadata about the transaction', async () => {
      const message = 'Message'
      const value = '1000000000000000000'

      const senderAllowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      const recieverBalance = await purrNFT.balanceOf(clonedPurrerAddress2)

      expect(senderAllowance).to.equal('1000000000000000000')
      expect(recieverBalance).to.equal(0)

      await clonedPurrer.purr(clonedPurrerAddress2, message, value)

      const mintData = await purrNFT.getMintData(0)

      expect(mintData.from).to.equal(clonedPurrerAddress)
      expect(mintData.to).to.equal(clonedPurrerAddress2)
      expect(mintData.timeStamp.toString()).to.not.equal('')
      expect(mintData.message).to.equal(message)
      expect(mintData.value).to.equal(value)
    })

    it('Should return a URI for external metadata', async () => {
      const message = 'Message'
      const value = '1000000000000000000'

      const senderAllowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      const recieverBalance = await purrNFT.balanceOf(clonedPurrerAddress2)

      expect(senderAllowance).to.equal('1000000000000000000')
      expect(recieverBalance).to.equal(0)

      await clonedPurrer.purr(clonedPurrerAddress2, message, value)

      expect(await purrNFT.tokenURI(0)).to.equal('https://whispurr.herokuapp.com/purrNFTData')
    })

    it('When minting, Should wrap $PURR', async () => {
      const senderAllowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      const recieverBalance = await purrNFT.balanceOf(clonedPurrerAddress2)

      expect(senderAllowance).to.equal('1000000000000000000')
      expect(recieverBalance).to.equal(0)

      const value = '1000000000000000000'
      await clonedPurrer.purr(clonedPurrerAddress2, 'Message', value)

      expect(await purrNFT.balanceOf(clonedPurrerAddress2)).to.equal(1)
      expect(await purrCoin.mintAllowanceOf(clonedPurrerAddress)).to.equal(0)
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(value)
    })
  })

  describe('Redemption', () => {
    it('Wrapped tokens can be redeemed by owner', async () => {
      expect(await purrCoin.mintAllowanceOf(clonedPurrerAddress)).to.equal('1000000000000000000')
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(0)

      const value = '1000000000000000000'
      await clonedPurrer.purr(clonedPurrerAddress2, 'Message', value)

      expect(await purrNFT.balanceOf(clonedPurrerAddress2)).to.equal(1)
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(value)

      expect(clonedPurrer.redeemPurr(0)).to.be.revertedWith('PurrNFT: This Token does not Belong to you')
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(value)
      expect(await purrCoin.balanceOf(clonedPurrerAddress)).to.equal(0)
      expect(await purrCoin.balanceOf(clonedPurrerAddress2)).to.equal(0)

      await clonedPurrer2.connect(signers[1]).redeemPurr(0)
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(0)
      expect(await purrCoin.balanceOf(clonedPurrerAddress2)).to.equal(value)

      expect(clonedPurrer2.connect(signers[1]).redeemPurr(0)).to.be.revertedWith('PurrNFT: Tokens Already Redeemed')
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal(0)
      expect(await purrCoin.balanceOf(clonedPurrerAddress2)).to.equal(value)
    })
  })
})