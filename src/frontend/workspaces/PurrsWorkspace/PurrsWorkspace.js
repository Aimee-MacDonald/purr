import React, { useState, useEffect } from 'react'

import './PurrsWorkspace.sass'

import PurrNFTInterface from '../../contractInterfaces/PurrNFTInterface'
import PurrCoinInterface from '../../contractInterfaces/PurrCoinInterface'

const PurrsWorkspace = () => {
  const [ purrNFTs, setPurrNFTs ] = useState([])
  const [ allowance, setAllowance ] = useState(0)
  const [ balance, setBalance ] = useState(0)

  const purrNFT = new PurrNFTInterface()
  const purrCoin = new PurrCoinInterface()

  useEffect(() => {
    purrNFT.getAllMintData()
      .then(result => setPurrNFTs(result))
      .catch(error => console.log(error))

    purrCoin.balanceOfCaller()
      .then(result => setBalance(result))
      .catch(error => console.log(error))

    purrCoin.mintAllowanceOfCaller()
      .then(result => setAllowance(result))
      .catch(error => console.log(error))
  }, [])

  const mintPurrNFT = e => {
    e.preventDefault()

    const nftValue = `${e.target.value.value}000000000000000000`

    purrCoin.approve(purrNFT.address(), nftValue)
      .then(result => purrNFT.mint(e.target.address.value, e.target.message.value, nftValue))
  }

  const redeemPurrNFT = tokenID => {
    purrNFT.redeem(tokenID)
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }

  return (
    <div id='PurrsWorkspace'>
      <div id='balances'>
        <h1>{`Allowance: ${allowance}`}</h1>
        <h1>{`Balance: ${balance}`}</h1>
      </div>

      <form id='nftMinting' onSubmit={mintPurrNFT}>
        <label for='address'>Address</label>
        <input
          id='address'
          placeholder='address'
          required
        />

        <label for='message'>Message</label>
        <input
          id='message'
          placeholder='message'
          required
        />

        <label for='value'>Value</label>
        <input
          id='value'
          placeholder='value'
          required
        />

        <button type='submit'>Send</button>
      </form>

      {purrNFTs.length > 0 && <div id='nftList'>
        {purrNFTs.map(nft => (
          <div key={nft._id} className='nftCard'>
            <p>{`From: ${nft.from}`}</p>
            <p>{`Value: ${nft.value}`}</p>
            <p>{`Message: ${nft.message}`}</p>
            {!nft.isRedeemed && <button onClick={() => redeemPurrNFT(nft._id)}>Redeem</button>}
          </div>
        ))}
      </div>}
    </div>
  )
}

export default PurrsWorkspace