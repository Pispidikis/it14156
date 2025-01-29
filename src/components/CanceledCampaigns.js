import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from "@mui/material";
import web3 from "../utils/web3";
import contract from "../utils/contract";

const CanceledCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCanceledCampaigns = async () => {
            try {
                const campaignCount = await contract.methods.campaignCount().call();
                const fetchedCampaigns = [];

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

    return (
        <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6">Canceled campaigns</Typography>
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
                                <TableCell><Button variant="contained" disabled>Claim</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default CanceledCampaigns;
