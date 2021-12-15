const { expect } = require('chai')

describe('PurrNFT', () => {
  let signers, purrNFT, mockPurrCoin

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockPurrCoin = await ethers.getContractFactory('MockPurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')

    mockPurrCoin = await MockPurrCoin.deploy()
    purrNFT = await PurrNFT.deploy(mockPurrCoin.address)
  })

  describe('Minting', () => {
    it('Can be minted', async () => {
      expect(await purrNFT.balanceOf(signers[1].address)).to.equal(0)
  
      await purrNFT.mint(signers[1].address, 'Message', 1)
  
      expect(await purrNFT.balanceOf(signers[1].address)).to.equal(1)
    })

    it('Should store minting data about the transaction', async () => {
      const message = 'Message'
      const value = '1'

      await purrNFT.mint(signers[1].address, message, value)
      const mintData = await purrNFT.getMintData(0)

      expect(mintData.from).to.equal(signers[0].address)
      expect(mintData.to).to.equal(signers[1].address)
      expect(mintData.timeStamp.toString()).to.not.equal('')
      expect(mintData.message).to.equal(message)
      expect(mintData.value).to.equal(value)
    })

    it('Should return a URI for external metadata', async () => {
      await purrNFT.mint(signers[1].address, 'Message', 1)

      const tokenURI = await purrNFT.tokenURI(0)
      
      expect(tokenURI).to.equal('https://whispurr.herokuapp.com/purrNFTData')
    })

    it('Should wrap PurrCoin', async () => {
      const value = 1
      
      await purrNFT.mint(signers[1].address, 'Message', value)

      expect(await mockPurrCoin.transferred()).to.equal(true)
    })
  })

  describe('Redemption', () => {
    it('Should be redeemed by owner', async () => {
      await purrNFT.mint(signers[0].address, 'Message', 1)
      expect(await purrNFT.balanceOf(signers[0].address)).to.equal(1)

      await purrNFT.redeem(0)
    })

    it('Should not be redeemed by non owner', async () => {
      await purrNFT.mint(signers[1].address, 'Message', 1)
      expect(await purrNFT.balanceOf(signers[1].address)).to.equal(1)

      expect(purrNFT.redeem(0)).to.be.revertedWith('PurrNFT: Only owner can redeem')
    })

    it('Should only be redeemed once', async () => {
      await purrNFT.mint(signers[0].address, 'Message', 1)
      expect(await purrNFT.balanceOf(signers[0].address)).to.equal(1)

      await purrNFT.redeem(0)
      
      expect(purrNFT.redeem(0)).to.be.revertedWith('PurrNFT: Token already redeemed')
    })
    
    /* 
    it("Should credit the owner's PurrCoin balance", () => {
      expect(mockPurrCoin)
    })
    */
  })
})






/* 
const { expect } = require("chai")

describe("PurrNFT", () => {
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
 */