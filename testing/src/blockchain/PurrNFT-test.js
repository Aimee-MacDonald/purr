const { expect } = require("chai")

describe("PurrNFT", () => {
  let Token, token, owner, addr1, addr2

  beforeEach(async () => {
    Token = await ethers.getContractFactory('PurrNFT')
    token = await Token.deploy();
    [owner, addr1, addr2, _] = await ethers.getSigners()
  })

  describe('Minting', () => {
    it('When minting, Should send a new unique NFT to reciever', async ()=> {
      expect(await token.balanceOf(addr1.address)).to.equal(0)
      expect(await token.balanceOf(addr2.address)).to.equal(0)

      await token.mint(addr1.address, "Prrrr")
      await token.mint(addr2.address, "Prrrr")

      expect(await token.balanceOf(addr1.address)).to.equal(1)
      expect(await token.balanceOf(addr2.address)).to.equal(1)
    })

    it('When minted, Should store metadata about the transaction', async ()=> {
      await token.mint(addr1.address, "Prrrr")

      const mintData = await token.getMintData(0)

      expect(mintData.from).to.equal(owner.address)
      expect(mintData.to).to.equal(addr1.address)
      expect(mintData.timeStamp.toString()).to.not.equal('')
      expect(mintData.message).to.equal("Prrrr")
    })
  })
})