const { expect } = require('chai')

describe('PurrCoin', () => {
  let signers, purrCoin
  let mockPurrer

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    purrCoin = await PurrCoin.deploy()

    const MockPurrer = await ethers.getContractFactory('MockPurrer')
    mockPurrer = await MockPurrer.deploy()
  })

  describe('Permissions', () => {
    it('Should add a new minter', async () => {
      await purrCoin.addMinter(signers[0].address)
    })

    it('Should add a new reciever', async () => {
      await purrCoin.addReciever(signers[0].address)
    })
    
    /* 
    it('Only PurrerFactory can add new minters', () => {
      expect(purrCoin.addMinter(signers[0].address)).to.be.revertedWith('PurrCoin: No Access')
    })
    
    it('Only PurrerFactory can add recievers', () => {
      expect(purrCoin.addReciever(signers[0].address)).to.be.revertedWith('PurrCoin: No Access')
    })
     */
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
    it('Should transfer to purrers', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(mockPurrer.address)

      await purrCoin.transfer(mockPurrer.address, 1)
      const recieverBalance = await purrCoin.balanceOf(mockPurrer.address)

      expect(await purrCoin.balanceOf(mockPurrer.address)).to.equal(1)
    })

    it('Should not transfer to non Purrers', async () => {
      await purrCoin.addMinter(signers[0].address)

      expect(purrCoin.transfer(signers[1].address, 1)).to.be.revertedWith('PurrCoin: This address cannot recieve PurrCoin')
    })

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

    it('When transfer amount > allowance and <= allowance + balance, Should mint full allowance and transfer from balance', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)
      await purrCoin.transfer(signers[1].address, 1)

      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('1')
      expect(await purrCoin.mintAllowanceOf(signers[1].address)).to.equal('1')

      await purrCoin.connect(signers[1]).transfer(signers[0].address, 2)

      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('2')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.balanceOf(signers[1].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[1].address)).to.equal('0')
    })

    it('When transfer amount > allowance + balance, Should revert', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)

      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('1')

      expect(purrCoin.transfer(signers[1].address, 2)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })
  })
})