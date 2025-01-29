import React, { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Alert, Grid, Paper } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const BuyShares = () => {
    const [campaignId, setCampaignId] = useState("");
    const [shares, setShares] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const buyShares = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const accounts = await web3.eth.getAccounts();

            // Ανάκτηση στοιχείων καμπάνιας
            const campaign = await contract.methods.campaigns(campaignId).call();
            const costPerShareWei = campaign.costPerShare;

            // Υπολογισμός συνολικού κόστους σε Wei
            const totalCostWei = web3.utils.toBN(costPerShareWei).mul(web3.utils.toBN(shares));

            // Αγορά μετοχών
            await contract.methods.buyShare(campaignId).send({
                from: accounts[0],
                value: totalCostWei.toString(),
            });

            setMessage("✅ Η αγορά ολοκληρώθηκε επιτυχώς!");
        } catch (error) {
            setMessage("❌ Σφάλμα κατά την αγορά μετοχών.");
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <Box sx={{padding: "10px 0", textAlign: "center"  }}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
                <Typography variant="h5" gutterBottom>
                    Αγορά Μετοχών
                </Typography>
                <form onSubmit={buyShares}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="ID Καμπάνιας"
                                variant="outlined"
                                fullWidth
                                value={campaignId}
                                onChange={(e) => setCampaignId(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Ποσότητα Μετοχών"
                                variant="outlined"
                                fullWidth
                                type="number"
                                value={shares}
                                onChange={(e) => setShares(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                sx={{ padding: "10px" }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Αγορά Μετοχών"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {message && (
                    <Alert
                        severity={message.startsWith("✅") ? "success" : "error"}
                        sx={{ marginTop: "20px" }}
                    >
                        {message}
                    </Alert>
                )}
            </Paper>
        </Box>
    );
};

export default BuyShares;
