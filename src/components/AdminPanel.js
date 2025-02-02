import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Grid, CircularProgress, Alert } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const AdminPanel = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [newOwner, setNewOwner] = useState("");
    const [banAddress, setBanAddress] = useState("");

    const handleWithdraw = async () => {
        setLoading(true);
        setMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.withdrawFees().send({ from: accounts[0] });
            setMessage("Τα fees αποσύρθηκαν επιτυχώς!");
        } catch (error) {
            setMessage("Σφάλμα κατά την απόσυρση των fees.");
            console.error(error);
        }
        setLoading(false);
    };

    const handleChangeOwner = async () => {
        setLoading(true);
        setMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.changeOwner(newOwner).send({ from: accounts[0] });
            setMessage(`Η ιδιοκτησία μεταφέρθηκε στη διεύθυνση ${newOwner}`);
        } catch (error) {
            setMessage("Σφάλμα κατά την αλλαγή ιδιοκτησίας.");
            console.error(error);
        }
        setLoading(false);
    };

    const handleBanEntrepreneur = async () => {
        setLoading(true);
        setMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.banEntrepreneur(banAddress).send({ from: accounts[0] });
            setMessage(`Ο επιχειρηματίας με διεύθυνση ${banAddress} απαγορεύτηκε.`);
        } catch (error) {
            setMessage("Σφάλμα κατά την απαγόρευση επιχειρηματία.");
            console.error(error);
        }
        setLoading(false);
    };

    const handleDestroyContract = async () => {
        setLoading(true);
        setMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.destroy().send({ from: accounts[0] });
            setMessage("Το συμβόλαιο καταστράφηκε επιτυχώς!");
        } catch (error) {
            setMessage("Σφάλμα κατά την καταστροφή του συμβολαίου.");
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6">Control Panel</Typography>
            <Grid container spacing={2}>
                {/* Withdraw */}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" fullWidth disabled={loading} onClick={handleWithdraw}>
                        {loading ? <CircularProgress size={24} /> : "Withdraw"}
                    </Button>
                </Grid>

                {/* Change Owner */}
                <Grid item xs={8}>
                    <TextField
                        label="Enter new owner's wallet address"
                        variant="outlined"
                        fullWidth
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" color="primary" fullWidth disabled={loading} onClick={handleChangeOwner}>
                        {loading ? <CircularProgress size={24} /> : "Change owner"}
                    </Button>
                </Grid>

                {/* Ban Entrepreneur */}
                <Grid item xs={8}>
                    <TextField
                        label="Enter entrepreneur's address"
                        variant="outlined"
                        fullWidth
                        value={banAddress}
                        onChange={(e) => setBanAddress(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" color="secondary" fullWidth disabled={loading} onClick={handleBanEntrepreneur}>
                        {loading ? <CircularProgress size={24} /> : "Ban entrepreneur"}
                    </Button>
                </Grid>

                {/* Destroy */}
                <Grid item xs={12}>
                    <Button variant="contained" color="error" fullWidth disabled={loading} onClick={handleDestroyContract}>
                        {loading ? <CircularProgress size={24} /> : "Destroy"}
                    </Button>
                </Grid>
            </Grid>

            {message && (
                <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ marginTop: "20px" }}>
                    {message}
                </Alert>
            )}
        </Paper>
    );
};

export default AdminPanel;
