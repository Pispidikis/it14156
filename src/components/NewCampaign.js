import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Grid, Alert } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const NewCampaign = () => {
    const [title, setTitle] = useState("");
    const [costPerShare, setCostPerShare] = useState("");
    const [totalShares, setTotalShares] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const createCampaign = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const accounts = await web3.eth.getAccounts();
            const costPerShareWei = web3.utils.toWei(costPerShare, "ether");

            await contract.methods.createCampaign(title, costPerShareWei, totalShares).send({
                from: accounts[0],
                value: web3.utils.toWei("0.02", "ether"),
            });

            setMessage("Η καμπάνια δημιουργήθηκε επιτυχώς!");
        } catch (error) {
            setMessage("Σφάλμα κατά τη δημιουργία της καμπάνιας.");
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px", Width: "100%", }}>
            <Typography variant="h6" gutterBottom>
                New campaign
            </Typography>
            <form onSubmit={createCampaign}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                        <Typography variant="body1"><b>Title</b></Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Typography variant="body1"><b>Pledge cost</b></Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={costPerShare}
                            onChange={(e) => setCostPerShare(e.target.value)}
                            required
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Typography variant="body1"><b>Number of pledges</b></Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={totalShares}
                            onChange={(e) => setTotalShares(e.target.value)}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: "10px" }}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {message && <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ marginTop: "10px" }}>
                {message}
            </Alert>}
        </Paper>
    );
};

export default NewCampaign;
