const { expect } = require('chai')

describe('PurrCoin', () => {
  let signers, purrCoin

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    purrCoin = await PurrCoin.deploy()
  })

  describe('Permissions', () => {
    it('Should add a new minter', async () => {
      await purrCoin.addMinter(signers[0].address)
    })
  })

  describe('Ititial Balances', () => {
    it('Minters should have a starting balance of zero', async () => {
      await purrCoin.addMinter(signers[0].address)
      
      const balance = await purrCoin.balanceOf(signers[0].address)

      expect(balance).to.equal('0')
    })

    it('Minters should have a starting mint allowance', async () => {
      await purrCoin.addMinter(signers[0].address)

      const mintAllowance = await purrCoin.mintAllowanceOf(signers[0].address)
      expect(mintAllowance).to.equal('1')
    })
  })

  describe('Transfers', () => {
    it('When transfer amount <= allowance, Should mint amount to reciever', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('1')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[1].address)).to.equal('1')

      await purrCoin.transfer(signers[1].address, 1)

      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('1')
      expect(await purrCoin.mintAllowanceOf(signers[1].address)).to.equal('1')
    })

    it('When transfer amount > allowance, Should mint full allowance and transfer from balance', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)
      await purrCoin.transfer(signers[1].address, 1)
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('1')
      expect(await purrCoin.mintAllowanceOf(signers[1].address)).to.equal('1')

      await purrCoin.connect(signers[1]).transfer(signers[0].address, 2)

      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('2')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[1].address)).to.equal('0')
    })

    it('When transfer amount > allowance + balance, Should revert', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('1')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[1].address)).to.equal('1')

      expect(purrCoin.transfer(signers[1].address, 2)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })
  })
})




/* 
describe('PurrCoin', () => {
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
 */