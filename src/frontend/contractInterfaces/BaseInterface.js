import { ethers } from 'ethers'
import 'regenerator-runtime/runtime'

export default class BaseInterface {
  contractAddress;
  contractABI;

  constructor(contractAddress, contractABI) {
    this.contractAddress = contractAddress
    this.contractABI = contractABI
  }

  ethCheck() { return typeof window.ethereum !== 'undefined' }

  async getContract(signed) {
    if(signed) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer)
      return contract
    } else {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider)
      return contract
    }
  }
}