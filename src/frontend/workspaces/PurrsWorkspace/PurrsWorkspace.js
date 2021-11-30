import React, { useState, useEffect, useContext } from 'react'

import './PurrsWorkspace.sass'

import PurrNFTInterface from '../../contractInterfaces/PurrNFTInterface'
import PurrCoinInterface from '../../contractInterfaces/PurrCoinInterface'
import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'
import PurrerInterface from '../../contractInterfaces/PurrerInterface'

import { ModalContext } from '../../contexts/Modal'

const PurrsWorkspace = () => {
  const [ purrNFTs, setPurrNFTs ] = useState([])
  const [ allowance, setAllowance ] = useState(0)
  const [ balance, setBalance ] = useState(0)
  const [ purrerAddress, setPurrerAddress ] = useState('')
  const [ purrerImage, setPurrerImage ] = useState('')
  const { setNotification } = useContext(ModalContext)

  const purrNFT = new PurrNFTInterface()
  const purrCoin = new PurrCoinInterface()
  const purrerFactory = new PurrerFactoryInterface()

  useEffect(() => {
    purrerFactory.purrerAddress()
      .then(result => setPurrerAddress(result))
      .catch(error => console.log(error))
  }, [])

  useEffect(() => {
    refreshPurrer()
  }, [purrerAddress])

  const refreshPurrer = () => {
    if(purrerAddress !== '') {
      purrerFactory.getImageLink(purrerAddress)
        .then(result => setPurrerImage(result))
        .catch(error => setNotification("Error: Couldn't find the purrer image"))

      purrNFT.getAllMintData(purrerAddress)
        .then(result => setPurrNFTs(result))
        .catch(error => console.log(error))

      purrCoin.balanceOf(purrerAddress)
        .then(result => setBalance(result))
        .catch(error => console.log(error))

      purrCoin.mintAllowanceOf(purrerAddress)
        .then(result => setAllowance(result))
        .catch(error => console.log(error))
    }
  }

  const mintPurrNFT = e => {
    e.preventDefault()

    const nftValue = `${e.target.value.value}000000000000000000`
    const purrer = new PurrerInterface(purrerAddress)

    purrer.purr(e.target.address.value, e.target.message.value, nftValue)
      .then(result => {
        setNotification('Minting Purr MicroNFT')
        result.wait()
          .then(res => {
            e.target.address.value = ''
            e.target.message.value = ''
            e.target.value.value = ''
            setNotification('MicroNFT Minted')
            checkBalances()
          })
          .catch(error => setNotification('Something bad happened'))
      })
      .catch(error => setNotification('Something bad happened'))
  }

  const redeemPurrNFT = tokenID => {
    const purrer = new PurrerInterface(purrerAddress)

    purrer.redeemPurr(tokenID)
      .then(result => {
        setNotification('Redeeming PURR')
        result.wait()
        .then(() => {
          setNotification('Purr Redeemed')
          refreshPurrer()
        })
        .catch(error => setNotification('Something bad happened'))
      })
      .catch(error => setNotification('Something bad happened'))
  }

  return (
    <div id='PurrsWorkspace'>
      <div id='Purrer'>
        <img src={purrerImage}/>
        <p>{purrerAddress}</p>
      </div>
      
      <div id='balances'>
        <h1>{`Allowance: ${allowance}`}</h1>
        <h1>{`Balance: ${balance}`}</h1>
      </div>
      
      <form id='nftMinting' onSubmit={mintPurrNFT}>
        <label htmlFor='address'>Address</label>
        <input
          id='address'
          placeholder='address'
          required
        />

        <label htmlFor='message'>Message</label>
        <input
          id='message'
          placeholder='message'
          required
        />

        <label htmlFor='value'>Value</label>
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
            <img src={nft.tokenURI}/>
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