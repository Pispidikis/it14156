import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Paper, Grid } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const Header = () => {
    const [account, setAccount] = useState("");
    const [owner, setOwner] = useState("");
    const [contractBalance, setContractBalance] = useState("0");
    const [fees, setFees] = useState("0");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);

                const contractOwner = await contract.methods.owner().call();
                setOwner(contractOwner);

                const balance = await web3.eth.getBalance(contract.options.address);
                setContractBalance(web3.utils.fromWei(balance, "ether"));

                const collectedFees = await contract.methods.feesCollected().call();
                setFees(web3.utils.fromWei(collectedFees, "ether"));
            } catch (error) {
                console.error("Error fetching header data:", error);
            }
        };

        fetchData();
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
                        label="Balance"
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
            </Grid>
        </Paper>
    );
};

export default Header;
