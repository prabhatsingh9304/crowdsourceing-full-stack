import { ethers } from "./ethers-5.1.esm.min.js"
import { ABI, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const currentBalance = document.getElementById("currentBalance")

connectButton.onclick = connect //calling connect function
fundButton.onclick = fund //calling fund function
balanceButton.onclick = getBalance //calling getBalance function
withdrawButton.onclick = withdraw //calling withdraw function

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        document.getElementById("connectButton").innerHTML = "Connected!!"
    } else {
        document.getElementById("connectButton").innerHTML =
            "Metamask not installed"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    //provider:- Connection to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //signer:- Wallet
    //return address of account currently connected to metamask
    const signer = provider.getSigner()

    //ABI and Address of contract

    const contract = new ethers.Contract(contractAddress, ABI, signer)
    try {
        const transcationResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
        //Wait till the transaction complete
        await listenForTransactionMine(transcationResponse, provider)
        console.log("Done!")
    } catch (error) {
        console.log(error)
    }
}

function listenForTransactionMine(transcationResponse, provider) {
    console.log(`Mining ${transcationResponse.hash}`)
    //listen for this transcation to finish
    //() => {} anonymous function
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    return new Promise((resolve, reject) => {
        provider.once(transcationResponse.hash, (transcationReceipt) => {
            console.log(
                `Completed with ${transcationReceipt.confirmation} confirmations`
            )
        })
        resolve()
    })
}

async function getBalance() {
    if (window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        //https://docs.ethers.org/v4/api-utils.html
        document.getElementById(
            "currentBalance"
        ).innerHTML = `Current Balance: ${ethers.utils.formatEther(balance)}`
    }
}

async function withdraw() {
    const ethAmount = document.getElementById("ethAmount").value
    //provider:- Connection to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //signer:- Wallet
    //return address of account currently connected to metamask
    const signer = provider.getSigner()

    //ABI and Address of contract

    const contract = new ethers.Contract(contractAddress, ABI, signer)
    try {
        const transcationResponse = await contract.withdraw()
        //Wait till the transaction complete
        await listenForTransactionMine(transcationResponse, provider)
        console.log("Done!")
    } catch (error) {
        console.log(error)
    }
}
