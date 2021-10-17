import React, { useState, useEffect } from 'react'
import PurrCoinInterface from '../contractInterfaces/PurrCoinInterface'
import PurrNFTInterface from '../contractInterfaces/PurrNFTInterface'

const PurrInteraction = () => {
  const purrCoin = new PurrCoinInterface()
  const purrNFT = new PurrNFTInterface()

  const [ balance, setBalance ] = useState(0)
  const [ mintAllowance, setMintAllowance ] = useState(0)
  const [ nftBalance, setNFTBalance ] = useState(10)
  const [ nftValues, setNFTValues ] = useState([])

  useEffect(() => {
    purrCoin.balanceOfCaller()
      .then(newBalance => setBalance(newBalance))
      .catch(error => console.log(error))

    purrCoin.mintAllowanceOfCaller()
      .then(newAllowance => setMintAllowance(newAllowance))
      .catch(error => console.log(error))

    purrNFT.balanceOfCaller()
      .then(newNFTBalance => setNFTBalance(newNFTBalance))
      .catch(error => console.log(error))

    purrNFT.getAllMintData()
      .then(newMintData => setNFTValues(newMintData))
      .catch(error => console.log(error))
  }, [])

  const mintNFT = e => {
    e.preventDefault()

    const nftValue = `${e.target.value.value}000000000000000000`

    purrCoin.approve(purrNFT.address(), nftValue)
      .then(result => purrNFT.mint(e.target.address.value, e.target.message.value, nftValue))
  }

  const redeemToken = tokenID => {
    purrNFT.redeem(tokenID)
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }

  return (
    <div>
      <div>
        <p>{`Balance: ${balance}`}</p>
        <p>{`Allowance: ${mintAllowance}`}</p>
        <p>{`NFTs: ${nftBalance}`}</p>
        {nftValues.map(nft => (
          <div key={nft.timeStamp * 1}>
            <p>{`From: ${nft.from}`}</p>
            <p>{`Message: ${nft.message}`}</p>
            <p>{`Value: ${nft.value / 10 ** 18}`}</p>
            <p>{`Redeemed: ${nft.isRedeemed}`}</p>
            <button onClick={() => redeemToken(nft._id)}>Redeem</button>
          </div>
        ))}
      </div>

      <form onSubmit={mintNFT}>
        <input
          id='address'
          placeholder='Address'
          required
        />

        <input
          id='message'
          placeholder='Message'
          required
        />

        <input
          id='value'
          placeholder='Value'
          required
        />

        <button type='submit'>Mint</button>
      </form>
    </div>
  )
}

export default PurrInteraction