const { expect } = require('chai')
const { MockProvider } = require('ethereum-waffle')
const { ContractFactory } = require('ethers')

const PurrCoin = require('../../../src/frontend/artifacts/src/blockchain/contracts/PurrCoin.sol/PurrCoin.json')

describe('PurrCoin', () => {
  const setup = async () => {
    const wallets = new MockProvider().getWallets()
    const contractFactory = new ContractFactory(PurrCoin.abi, PurrCoin.bytecode, wallets[0])
    const purrCoin = await contractFactory.deploy()

    return { wallets, purrCoin }
  }

  describe('Permissions', () => {
    it('Should add a new minter', async () => {
      const { wallets, purrCoin } = await setup()

      await purrCoin.addMinter(wallets[0].address)
    })
  })

  describe('Ititial Balances', () => {
    it('Minters should enjoy a balance and minting allowance', async () => {
      const { wallets, purrCoin } = await setup()
      await purrCoin.addMinter(wallets[0].address)
      
      const balance = await purrCoin.balanceOf(wallets[0].address)
      const mintAllowance = await purrCoin.mintAllowanceOf(wallets[0].address)

      expect(balance).to.equal('0')
      expect(mintAllowance).to.equal('1')
    })
  })

  describe('Transfers', () => {
    it('When transfer amount <= allowance, Should mint amount to reciever', async () => {
      const { wallets, purrCoin } = await setup()
      await purrCoin.addMinter(wallets[0].address)
      await purrCoin.addMinter(wallets[1].address)
      expect(await purrCoin.balanceOf(wallets[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(wallets[0].address)).to.equal('1')
      expect(await purrCoin.balanceOf(wallets[1].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(wallets[1].address)).to.equal('1')

      await purrCoin.transfer(wallets[1].address, 1)

      expect(await purrCoin.balanceOf(wallets[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(wallets[0].address)).to.equal('0')
      expect(await purrCoin.balanceOf(wallets[1].address)).to.equal('1')
      expect(await purrCoin.mintAllowanceOf(wallets[1].address)).to.equal('1')
    })

    it('When transfer amount > allowance, Should mint full allowance and transfer from balance', async () => {
      const { wallets, purrCoin } = await setup()
      await purrCoin.addMinter(wallets[0].address)
      await purrCoin.addMinter(wallets[1].address)
      await purrCoin.transfer(wallets[1].address, 1)
      expect(await purrCoin.balanceOf(wallets[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(wallets[0].address)).to.equal('0')
      expect(await purrCoin.balanceOf(wallets[1].address)).to.equal('1')
      expect(await purrCoin.mintAllowanceOf(wallets[1].address)).to.equal('1')

      await purrCoin.connect(wallets[1]).transfer(wallets[0].address, 2)
    })

    it('When transfer amount > allowance + balance, Should revert', async () => {
      const { wallets, purrCoin } = await setup()
      await purrCoin.addMinter(wallets[0].address)
      await purrCoin.addMinter(wallets[1].address)
      expect(await purrCoin.balanceOf(wallets[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(wallets[0].address)).to.equal('1')
      expect(await purrCoin.balanceOf(wallets[1].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(wallets[1].address)).to.equal('1')

      expect(purrCoin.transfer(wallets[1].address, 2)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
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