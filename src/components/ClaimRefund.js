import React, { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const ClaimRefund = () => {
    const [campaignId, setCampaignId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const claimRefund = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const accounts = await web3.eth.getAccounts();

            // Κλήση της μεθόδου claimRefund από το συμβόλαιο
            await contract.methods.claimRefund(campaignId).send({
                from: accounts[0],
            });

            setMessage("✅ Η επιστροφή χρημάτων ολοκληρώθηκε επιτυχώς!");
        } catch (error) {
            setMessage("❌ Σφάλμα κατά την επιστροφή χρημάτων.");
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <Box sx={{ padding: "10px 0", textAlign: "center" }}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
                <Typography variant="h5" gutterBottom>
                    Επιστροφή Χρημάτων
                </Typography>
                <form onSubmit={claimRefund}>
                    <TextField
                        label="ID Καμπάνιας"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={campaignId}
                        onChange={(e) => setCampaignId(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ marginTop: "10px" }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Διεκδίκηση Επιστροφής"}
                    </Button>
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

export default ClaimRefund;
