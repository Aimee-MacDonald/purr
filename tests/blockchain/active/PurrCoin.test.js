const { expect } = require('chai')

describe('PurrCoin', () => {
  let signers, purrCoin

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const PurrCoin = await ethers.getContractFactory('TIPurrCoin')
    purrCoin = await PurrCoin.deploy()
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
    it('When transfer amount > allowance + balance, Should revert', async () => {
      const allowance = await purrCoin.mintAllowanceOf(signers[0].address)
      const balance = await purrCoin.balanceOf(signers[0].address)
      const transferAmount = '100000000000000000000'

      expect(transferAmount > allowance + balance)

      await expect(purrCoin.transfer(signers[1].address, transferAmount)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })

    it('When transfer amount <= allowance, Should mint amount to reciever', async () => {
      const allowance = await purrCoin.mintAllowanceOf(signers[0].address)
      const balance = await purrCoin.balanceOf(signers[0].address)
      const transferAmount = '10000000000000000000'

      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('30000000000000000000')
      expect(transferAmount <= allowance)

      await purrCoin.transfer(signers[1].address, transferAmount)

      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('20000000000000000000')
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal(balance)
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('10000000000000000000')
    })

    it('When transfer amount > allowance, Should mint full allowance and transfer from balance', async () => {
      const allowance = await purrCoin.mintAllowanceOf(signers[0].address)
      const balance = await purrCoin.balanceOf(signers[0].address)
      const transferAmount = '40000000000000000000'
      
      expect(allowance).to.equal('30000000000000000000')
      expect(balance).to.equal('50000000000000000000')
      expect(transferAmount > allowance)
      expect(transferAmount <= allowance + balance)
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('0')

      await purrCoin.transfer(signers[1].address, transferAmount)

      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('40000000000000000000')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('40000000000000000000')
    })
  })
})