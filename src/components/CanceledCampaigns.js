import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const CanceledCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userAddress, setUserAddress] = useState("");

    useEffect(() => {
        const fetchCanceledCampaigns = async () => {
            try {
                const campaignCount = await contract.methods.campaignCount().call();
                const fetchedCampaigns = [];
                const accounts = await web3.eth.getAccounts();
                setUserAddress(accounts[0]);

                for (let i = 1; i <= campaignCount; i++) {
                    const campaign = await contract.methods.campaigns(i).call();
                    if (!campaign.active && !campaign.completed) {
                        fetchedCampaigns.push({
                            id: i,
                            title: campaign.title,
                            creator: campaign.creator,
                        });
                    }
                }

                setCampaigns(fetchedCampaigns);
            } catch (error) {
                console.error("Error fetching canceled campaigns:", error);
            }
            setLoading(false);
        };

        fetchCanceledCampaigns();
    }, []);

    const handleClaim = async (campaignId, userInvestment) => {
        try {
            if (userInvestment <= 0) {
                alert("❌ You have no investment to claim in this campaign!");
                return;
            }

            await contract.methods.claimRefund(campaignId).send({
                from: userAddress,
                gas: 300000,
            });

            console.log(`✅ Refund claimed for campaign ${campaignId}`);

            // Μετά το Claim, ξαναφορτώνουμε τις ακυρωμένες καμπάνιες
            const updatedCampaigns = campaigns.map(c => {
                if (c.id === campaignId) {
                    return { ...c, userInvestment: 0 }; // Μηδενίζουμε την επένδυση
                }
                return c;
            });

            setCampaigns(updatedCampaigns);
        } catch (error) {
            console.error("Error claiming refund:", error);
        }
    };



    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6">Canceled campaigns</Typography>
            {loading ? (
                <CircularProgress sx={{ marginTop: "20px" }} />
            ) : campaigns.length === 0 ? (
                <Typography variant="body1" sx={{ marginTop: "10px" }}>No canceled campaigns.</Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Entrepreneur</b></TableCell>
                                <TableCell><b>Title</b></TableCell>
                                <TableCell><b>Claim</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>{campaign.creator}</TableCell>
                                    <TableCell>{campaign.title}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={campaign.userInvestment <= 0}
                                            onClick={() => handleClaim(campaign.id, campaign.userInvestment)}
                                        >
                                            Claim ({campaign.userInvestment} ETH)
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default CanceledCampaigns;
