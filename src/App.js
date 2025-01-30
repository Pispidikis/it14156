import React from "react";
import { Container, CssBaseline, AppBar, Toolbar, Typography } from "@mui/material";
import "./App.css";
import Header from "./components/Header";
import NewCampaign from "./components/NewCampaign";
import LiveCampaigns from "./components/LiveCampaigns";
import FulfilledCampaigns from "./components/FulfilledCampaigns";
import CanceledCampaigns from "./components/CanceledCampaigns";
import AdminPanel from "./components/AdminPanel";

import BuyShares from "./components/BuyShares";
import CompleteCampaign from "./components/CompleteCampaign";
import CancelCampaign from "./components/CancelCampaign";
import ClaimRefund from "./components/ClaimRefund";
const App = () => {
  return (
      <div>
        <CssBaseline />
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Crowdfunding DApp
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ marginTop: "30px" }}>
            <Header />
            <NewCampaign />
            <LiveCampaigns />
            <FulfilledCampaigns />
            <CanceledCampaigns />
            <AdminPanel />
        </Container>
      </div>
  );
};

export default App;
