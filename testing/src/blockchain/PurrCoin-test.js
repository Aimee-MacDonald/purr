const { expect } = require("chai")

describe("PurrCoin", () => {
  let Token, token, owner, addr1, addr2

  beforeEach(async () => {
    Token = await ethers.getContractFactory('PurrCoin')
    token = await Token.deploy();
    [owner, addr1, addr2, _] = await ethers.getSigners()
  })

  describe('Transactions', () => {
    it('When transfer amount > allowance + balance, Should revert', async () => {
      const allowance = await token.mintAllowanceOf(owner.address)
      const balance = await token.balanceOf(owner.address)
      const transferAmount = '100000000000000000000'

      expect(transferAmount > allowance + balance)

      await expect(token.transfer(addr1.address, transferAmount)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })

    it('When transfer amount <= allowance, Should mint amount to reciever', async () => {
      const allowance = await token.mintAllowanceOf(owner.address)
      const balance = await token.balanceOf(owner.address)
      const transferAmount = '10000000000000000000'

      expect(await token.balanceOf(addr1.address)).to.equal('0')
      expect(await token.mintAllowanceOf(owner.address)).to.equal('30000000000000000000')
      expect(transferAmount <= allowance)

      await token.transfer(addr1.address, transferAmount)

      expect(await token.mintAllowanceOf(owner.address)).to.equal('20000000000000000000')
      expect(await token.balanceOf(owner.address)).to.equal(balance)
      expect(await token.balanceOf(addr1.address)).to.equal('10000000000000000000')
    })

    it('When transfer amount > allowance, Should mint full allowance and transfer from balance', async () => {
      const allowance = await token.mintAllowanceOf(owner.address)
      const balance = await token.balanceOf(owner.address)
      const transferAmount = '40000000000000000000'
      
      expect(allowance).to.equal('30000000000000000000')
      expect(balance).to.equal('50000000000000000000')
      expect(transferAmount > allowance)
      expect(transferAmount <= allowance + balance)
      expect(await token.balanceOf(addr1.address)).to.equal('0')

      await token.transfer(addr1.address, transferAmount)

      expect(await token.mintAllowanceOf(owner.address)).to.equal('0')
      expect(await token.balanceOf(owner.address)).to.equal('40000000000000000000')
      expect(await token.balanceOf(addr1.address)).to.equal('40000000000000000000')
    })



    // First check if alowance available
    // If transfer amount < alowance
      // Subtract the allowance from transfer amount
      // Mint transfer amount to reciever

    // If transfer > alowance
      // if transfer amount < allowance + balance
        // reduce allowance to zero
        // Mint allowance to reciever
        // Transfer the remaining Transfer amount from balance

      // If transfer amount > allowance + balance
        // Revert


    /* it('Should transfer tokens between accounts', async () => {
      await token.transfer(addr1.address, 50);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(await token.balanceOf(addr1.address)).to.equal('50');

      await token.connect(addr1).transfer(addr2.address, 25);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(await token.balanceOf(addr2.address)).to.equal('25');
    });

    it(`Should fail if sender doesn't have enough tokens`, async () => {
      await expect(token.connect(addr1).transfer(addr2.address, 50)).to.be.revertedWith('Not enough tokens');
      expect(await token.balanceOf(addr2.address)).to.equal('0');
    }); */
  });
})