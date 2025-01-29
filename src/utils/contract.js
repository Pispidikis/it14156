import web3 from "./web3";

// Αντικατέστησε με τη δική σου διεύθυνση του συμβολαίου από το Remix
const contractAddress = "0x3e1D2b97fF403eD0772606953679A48001F8F9Ae";

// Αντικατέστησε με το ABI που αντέγραψες από το Remix
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            }
        ],
        "name": "buyShare",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            }
        ],
        "name": "cancelCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            }
        ],
        "name": "completeCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "costPerShare",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalShares",
                "type": "uint256"
            }
        ],
        "name": "createCampaign",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "withdrawFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "campaignCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "campaigns",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "costPerShare",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalShares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "soldShares",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "feesCollected",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

export default contract;
