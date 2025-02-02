import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Box } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const LiveCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userAddress, setUserAddress] = useState("");

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                setUserAddress(accounts[0]);

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


        contract.events.CampaignFulfilled({}, async () => {
            console.log("Event detected: CampaignFulfilled");
            fetchCampaigns();
        });

    }, []);

    const handlePledge = async (campaignId, costPerShare) => {
        try {
            await contract.methods.buyShare(campaignId).send({
                from: userAddress,
                value: web3.utils.toWei(costPerShare, "ether"),
                gas: 300000,
            });
            console.log(`Pledged to campaign ${campaignId}`);
        } catch (error) {
            console.error("Error pledging:", error);
        }
    };

    const handleCancel = async (campaignId, creator) => {
        try {
            if (userAddress.toLowerCase() !== creator.toLowerCase()) {
                alert("You are not the creator of this campaign!");
                return;
            }

            await contract.methods.cancelCampaign(campaignId).send({ from: userAddress, gas: 300000 });
            console.log(`Campaign ${campaignId} canceled.`);
        } catch (error) {
            console.error("Error canceling campaign:", error);
        }
    };

    const handleFulfill = async (campaignId, creator) => {
        try {
            if (userAddress.toLowerCase() !== creator.toLowerCase()) {
                alert("You are not the creator of this campaign!");
                return;
            }

            await contract.methods.completeCampaign(campaignId).send({ from: userAddress, gas: 300000 });
            console.log(`Campaign ${campaignId} fulfilled successfully!`);
        } catch (error) {
            console.error("Error fulfilling campaign:", error);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px", margin: "auto" }}>
            <Typography variant="h6">Live campaigns</Typography>
            {loading ? (
                <CircularProgress sx={{ marginTop: "20px" }} />
            ) : campaigns.length === 0 ? (
                <Typography variant="body1" sx={{ marginTop: "10px" }}>No active campaigns.</Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Entrepreneur</b></TableCell>
                                <TableCell><b>Title</b></TableCell>
                                <TableCell><b>Price / Backers / Pledges left</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>{campaign.creator}</TableCell>
                                    <TableCell>{campaign.title}</TableCell>
                                    <TableCell>{campaign.costPerShare} | {campaign.totalShares} | {campaign.totalShares - campaign.soldShares}</TableCell>
                                    <TableCell>
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <Button variant="contained" color="success" onClick={() => handlePledge(campaign.id, campaign.costPerShare)}>Pledge</Button>
                                            {userAddress.toLowerCase() === campaign.creator.toLowerCase() && (
                                                <Button variant="contained" color="error" onClick={() => handleCancel(campaign.id, campaign.creator)}>Cancel</Button>
                                            )}
                                            {userAddress.toLowerCase() === campaign.creator.toLowerCase() && campaign.totalShares === campaign.soldShares && (
                                                <Button variant="contained" color="primary" onClick={() => handleFulfill(campaign.id, campaign.creator)}>Fulfill</Button>
                                            )}
                                        </Box>
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
