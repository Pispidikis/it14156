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
                    console.log(`Checking Campaign ${i}:`, campaign);

                    if (campaign.completed) {
                        fetchedCampaigns.push({
                            id: i,
                            title: campaign.title,
                            creator: campaign.creator,
                            fundsRaised: web3.utils.fromWei((campaign.totalShares * campaign.costPerShare).toString(), "ether"),
                        });
                    }
                }

                console.log("Fulfilled Campaigns:", fetchedCampaigns);
                setCampaigns(fetchedCampaigns);
            } catch (error) {
                console.error("Error fetching fulfilled campaigns:", error);
            }
            setLoading(false);
        };

        fetchFulfilledCampaigns();

        contract.events.CampaignFulfilled({}, async () => {
            console.log("Event detected: CampaignFulfilled");
            fetchFulfilledCampaigns();
        });

    }, []);

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBlock: "20px" }}>
            <Typography variant="h6">Fulfilled campaigns</Typography>
            {loading ? <CircularProgress sx={{ marginTop: "20px" }} /> : (
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
                            {campaigns.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.creator}</TableCell>
                                    <TableCell>{c.title}</TableCell>
                                    <TableCell>{c.fundsRaised}</TableCell>
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
