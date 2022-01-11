const { expect } = require('chai')
const { async } = require('regenerator-runtime')

describe('PurrCoin', () => {
  let signers, purrCoin
  let mockPurrer, mockLootFactory, mockPurrerFactory, mockLoot, mockMarket

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockPurrerFactory = await ethers.getContractFactory('MockPurrerFactory')
    const MockPurrer = await ethers.getContractFactory('MockPurrer')
    const MockLootFactory = await ethers.getContractFactory('MockLootFactory')
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const MockLoot = await ethers.getContractFactory('MockLoot')
    const MockMarket = await ethers.getContractFactory('MockMarket')
    
    mockPurrerFactory = await MockPurrerFactory.deploy()
    mockPurrer = await MockPurrer.deploy()
    mockLootFactory = await MockLootFactory.deploy()
    mockLoot = await MockLoot.deploy()
    mockMarket = await MockMarket.deploy()
    purrCoin = await PurrCoin.deploy(mockLootFactory.address)

    await purrCoin.setPurrerFactory(mockPurrerFactory.address)
    await purrCoin.setMarket(mockMarket.address)
    await mockMarket.setPurrCoinAddress(purrCoin.address)
  })

  describe('Permissions', () => {
    it('Should add a new minter', async () => {
      await purrCoin.addMinter(signers[0].address)
    })

    it('Should add a new reciever', async () => {
      await purrCoin.addReciever(signers[0].address)
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

    it('Should track the total PurrCoin recieved', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)

      expect(await purrCoin.totalRecievedBy(signers[0].address)).to.equal(0)
      
      await purrCoin.connect(signers[1]).transfer(signers[0].address, 1)
      
      expect(await purrCoin.totalRecievedBy(signers[0].address)).to.equal(1)
    })

    it("Should return the Purrer's maxMintAllowance", async () => {
      await purrCoin.addMinter(signers[0].address)

      expect(await purrCoin.maxMintAllowanceOf(signers[0].address)).to.equal(1)
    })

    it('Should not mint if sender is Market', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)

      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal(1)
      
      await purrCoin.approve(mockMarket.address, 1)
      expect(mockMarket.transferPurrCoin(signers[0].address, signers[1].address, 1)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
      
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal(1)
    })
  })
  
  describe('Loot', () => {
    it('When Balance and Mint allowance both hit zero, should mint loot_0', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)
      await mockPurrerFactory.setPurrer(signers[0].address)
      await purrCoin.transfer(signers[1].address, 1)
      
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('0')
      expect(await mockLootFactory.minted()).to.equal(true)
    })
    
    it('When totalRecievedBy hits 5, should mint loot_1', async () => {
      await mockPurrerFactory.setPurrer(signers[0].address)
      
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)
      await purrCoin.addMinter(signers[2].address)
      await purrCoin.addMinter(signers[3].address)
      await purrCoin.addMinter(signers[4].address)
      await purrCoin.addMinter(signers[5].address)

      await purrCoin.connect(signers[1]).transfer(signers[0].address, 1)
      await purrCoin.connect(signers[2]).transfer(signers[0].address, 1)
      await purrCoin.connect(signers[3]).transfer(signers[0].address, 1)
      await purrCoin.connect(signers[4]).transfer(signers[0].address, 1)
      await purrCoin.connect(signers[5]).transfer(signers[0].address, 1)

      expect(await purrCoin.totalRecievedBy(signers[0].address)).to.equal(5)
      expect(await mockLootFactory.minted()).to.equal(true)
    })
  
    it('Should not mint loot to non Purrers', async () => {
      await purrCoin.addMinter(signers[0].address)
      await purrCoin.addMinter(signers[1].address)
      await purrCoin.transfer(signers[1].address, 1)
  
      expect(await purrCoin.balanceOf(signers[0].address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(signers[0].address)).to.equal('0')
      expect(await mockLootFactory.minted()).to.equal(false)
    })

    it('Should run Loot logic', async () => {
      await purrCoin.addMinter(mockPurrer.address)

      expect(await purrCoin.balanceOf(mockPurrer.address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(mockPurrer.address)).to.equal('1')

      await purrCoin.runLootLogic(mockPurrer.address, mockLoot.address)

      expect(await purrCoin.balanceOf(mockPurrer.address)).to.equal('0')
      expect(await purrCoin.mintAllowanceOf(mockPurrer.address)).to.equal('5')
    })
  })
})