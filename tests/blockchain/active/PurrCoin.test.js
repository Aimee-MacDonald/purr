const { expect } = require('chai')

describe('PurrCoin', () => {
  let signers, purrCoin, purrNFT, purrer, purrerFactory
  let clonedPurrer, clonedPurrerAddress, clonedPurrer2, clonedPurrerAddress2

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrCoin = await ethers.getContractFactory('TIPurrCoin')
    purrCoin = await PurrCoin.deploy()

    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    purrNFT = await PurrNFT.deploy(purrCoin.address)

    const Purrer = await ethers.getContractFactory('Purrer')
    purrer = await Purrer.deploy()

    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address, purrNFT.address)

    clonedPurrer = await purrerFactory.join()
    clonedPurrerAddress = await purrerFactory.purrerAddress(signers[0].address)

    clonedPurrer2 = await purrerFactory.connect(signers[1]).join()
    clonedPurrerAddress2 = await purrerFactory.purrerAddress(signers[0].address)
  })

  describe('Mint allowance', () => {
    it('Should have a balance in the test account', async () => {
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('50000000000000000000')
    })

    it('Should return the mint allowance of the specified address', async () => {
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('30000000000000000000')
    })
  })

  describe('transactions', () => {
    it('Can be sent to purrers and NFT contract', async () => {
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('50000000000000000000')
      
      await purrCoin.transfer(clonedPurrerAddress, '10000000000000000000')
      await purrCoin.transfer(purrNFT.address, '10000000000000000000')
      
      expect(await purrCoin.balanceOf(clonedPurrerAddress)).to.equal('10000000000000000000')
      expect(await purrCoin.balanceOf(purrNFT.address)).to.equal('10000000000000000000')
    })

    it('Can not be sent to any other contracts or non-purrers', async () => {
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('50000000000000000000')

      expect(purrCoin.transfer(purrer.address, '10000000000000000000')).to.be.revertedWith('purrCoin: This address cannot recieve PURR')
      expect(purrCoin.transfer(signers[4].address, '10000000000000000000')).to.be.revertedWith('purrCoin: This address cannot recieve PURR')
    })

    it('When transfer amount > allowance + balance, Should revert', async () => {
      const allowance = await purrCoin.mintAllowanceOf(clonedPurrerAddress)
      const balance = await purrCoin.balanceOf(clonedPurrerAddress)
      const transferAmount = '100000000000000000000'

      expect(purrCoin.transfer(clonedPurrerAddress2, transferAmount)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })

    it('When transfer amount <= allowance, Should mint amount to reciever', async () => {
      let senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      let recieverBalance = await purrCoin.balanceOf(clonedPurrerAddress2)
      const transferAmount = '30000000000000000000'

      expect(senderAllowance).to.equal('30000000000000000000')
      expect(recieverBalance).to.equal(0)

      await purrCoin.transfer(clonedPurrerAddress2, transferAmount)

      senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      recieverBalance = await purrCoin.balanceOf(clonedPurrerAddress2)

      expect(senderAllowance).to.equal(0)
      expect(recieverBalance).to.equal('30000000000000000000')
    })

    it('When transfer amount > allowance, Should mint full allowance and transfer from balance', async () => {
      let senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      let senderBalance = await purrCoin.balanceOf(signers[0].address)
      const transferAmount = '40000000000000000000'

      expect(senderAllowance).to.equal('30000000000000000000')
      expect(senderBalance).to.equal('50000000000000000000')

      await purrCoin.transfer(clonedPurrerAddress, transferAmount)

      senderAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      senderBalance = await purrCoin.balanceOf(signers[0].address)
      const recieverBalance = await purrCoin.balanceOf(clonedPurrerAddress)

      expect(senderAllowance).to.equal(0)
      expect(senderBalance).to.equal('40000000000000000000')
      expect(recieverBalance).to.equal('40000000000000000000')
    })
  })

  describe('Restrictions', () => {
    it('Only PurrerFactory can add new minters', () => {
      expect(purrCoin.addMinter(signers[3].address)).to.be.revertedWith('PurrCoin: No Access')
    })

    it('Only PurrerFactory can add recievers', () => {
      expect(purrCoin.addReciever(signers[3].address)).to.be.revertedWith('PurrCoin: No Access')
    })
  })
})