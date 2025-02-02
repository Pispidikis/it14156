import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Paper, Grid } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const Header = () => {
    const [account, setAccount] = useState("");
    const [owner, setOwner] = useState("");
    const [contractBalance, setContractBalance] = useState("0");
    const [fees, setFees] = useState("0");
    const [userBalance, setUserBalance] = useState("0"); // 🔄 ΝΕΟ: Balance χρήστη στο Metamask

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);

                const contractOwner = await contract.methods.owner().call();
                setOwner(contractOwner);


                const contractAddress = contract.options.address;
                const contractBal = await web3.eth.getBalance(contractAddress);
                setContractBalance(web3.utils.fromWei(contractBal, "ether"));


                const collectedFees = await contract.methods.feesCollected().call();
                setFees(web3.utils.fromWei(collectedFees, "ether"));


                const userBal = await web3.eth.getBalance(accounts[0]);
                setUserBalance(web3.utils.fromWei(userBal, "ether"));

            } catch (error) {
                console.error("Error fetching header data:", error);
            }
        };

        fetchData();


        const eventListener = contract.events.allEvents({}, async (error, event) => {
            if (error) {
                console.error("Error listening to contract events:", error);
                return;
            }
            console.log("Event detected in Header:", event);


            fetchData();
        });

        return () => {
            eventListener.unsubscribe();
        };

    }, []);

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                Crowdfunding DApp
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Current Address"
                        variant="outlined"
                        fullWidth
                        value={account}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Owner's Address"
                        variant="outlined"
                        fullWidth
                        value={owner}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Contract Balance"
                        variant="outlined"
                        fullWidth
                        value={`${contractBalance} ETH`}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Collected fees"
                        variant="outlined"
                        fullWidth
                        value={`${fees} ETH`}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Your Wallet Balance"
                        variant="outlined"
                        fullWidth
                        value={`${userBalance} ETH`}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Header;
