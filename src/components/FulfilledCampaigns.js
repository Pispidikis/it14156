import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const FulfilledCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFulfilledCampaigns = async () => {
            try {
                const campaignCount = await contract.methods.campaignCount().call();
                const fetchedCampaigns = [];

                for (let i = 1; i <= campaignCount; i++) {
                    const campaign = await contract.methods.campaigns(i).call();
                    if (campaign.completed) {
                        fetchedCampaigns.push({
                            id: i,
                            title: campaign.title,
                            creator: campaign.creator,
                            fundsRaised: web3.utils.fromWei((campaign.totalShares * campaign.costPerShare).toString(), "ether"),
                        });
                    }
                }

                setCampaigns(fetchedCampaigns);
            } catch (error) {
                console.error("Error fetching fulfilled campaigns:", error);
            }
            setLoading(false);
        };

        fetchFulfilledCampaigns();
    }, []);

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6">Fulfilled campaigns</Typography>
            {loading ? (
                <CircularProgress sx={{ marginTop: "20px" }} />
            ) : campaigns.length === 0 ? (
                <Typography variant="body1" sx={{ marginTop: "10px" }}>
                    No fulfilled campaigns.
                </Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Entrepreneur</b></TableCell>
                                <TableCell><b>Title</b></TableCell>
                                <TableCell><b>Funds Raised (ETH)</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>{campaign.creator}</TableCell>
                                    <TableCell>{campaign.title}</TableCell>
                                    <TableCell>{campaign.fundsRaised}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default FulfilledCampaigns;
