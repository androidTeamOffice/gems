
import Grid from "@mui/material/Grid";

import { useState, useEffect } from "react";
// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";

import Card from "@mui/material/Card";

// Argon Dashboard 2 PRO MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import Footer from "examples/Footer";


// Argon Dashboard 2 PRO MUI base styles
import typography from "assets/theme/base/typography";

import axios from "axios";
// import Wizard from "layouts/pages/user_doc_upload";

import Header from "../../dashboards/user/components/Header";
import Button from '@mui/material/Button';


const bgImage = "";
//
// Request interceptor to add JWT token to Authorization header (if present)
const baseUrl = process.env.REACT_APP_BASE_URL; // Assuming variable name is REACT_APP_BASE_URL
const authAxios = axios.create({
  baseURL: baseUrl,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("pdf_excel_hash");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

function Verifier() {
  const { size } = typography;
  
  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({
          functions: { rgba, linearGradient },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.6),
            rgba(gradients.info.state, 0.6)
          )}, url(${bgImage})`,
        backgroundPositionY: "50%",
      }}
    >
      <Header />
      <ArgonBox mt={1} mb={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card>
              <ArgonBox p={2}>
                              <ArgonBox mb={2}>
                                  
                              </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                  </Grid>
                </ArgonBox>
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Verifier;