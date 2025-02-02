import Web3 from "web3";

let web3;


if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {

        window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
        console.error("User denied account access");
    }
} else {
    console.error("Metamask not found. Please install it.");
}

export default web3;
