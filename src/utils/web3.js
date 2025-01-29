import Web3 from "web3";

let web3;

// Ελέγχουμε αν το Metamask είναι εγκατεστημένο
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
        // Ζητάμε άδεια από τον χρήστη να συνδεθεί με το Metamask
        window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
        console.error("User denied account access");
    }
} else {
    console.error("Metamask not found. Please install it.");
}

export default web3;
