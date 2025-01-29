import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const LiveCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const campaignCount = await contract.methods.campaignCount().call();
                const fetchedCampaigns = [];

                for (let i = 1; i <= campaignCount; i++) {
                    const campaign = await contract.methods.campaigns(i).call();
                    if (campaign.active) {
                        fetchedCampaigns.push({
                            id: i,
                            title: campaign.title,
                            creator: campaign.creator,
                            costPerShare: web3.utils.fromWei(campaign.costPerShare, "ether"),
                            totalShares: campaign.totalShares,
                            soldShares: campaign.soldShares,
                        });
                    }
                }

                setCampaigns(fetchedCampaigns);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
            setLoading(false);
        };

        fetchCampaigns();
    }, []);

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6">Live campaigns</Typography>
            {loading ? (
                <CircularProgress sx={{ marginTop: "20px" }} />
            ) : campaigns.length === 0 ? (
                <Typography variant="body1" sx={{ marginTop: "10px" }}>
                    No active campaigns.
                </Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Entrepreneur</b></TableCell>
                                <TableCell><b>Title</b></TableCell>
                                <TableCell><b>Price / Backers / Pledges left / Your Pledges</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>{campaign.creator}</TableCell>
                                    <TableCell>{campaign.title}</TableCell>
                                    <TableCell>{campaign.costPerShare} | {campaign.totalShares} | {campaign.totalShares - campaign.soldShares} | 0</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="success">Pledge</Button>
                                        <Button variant="contained" color="error" sx={{ marginLeft: "10px" }}>Cancel</Button>
                                        <Button variant="contained" disabled sx={{ marginLeft: "10px" }}>Fulfill</Button>
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

export default LiveCampaigns;
