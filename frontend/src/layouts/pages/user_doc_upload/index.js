
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
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import AppointmentForm from './components/StepFour';
import DocumentSubmission from './components/StepFive';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

const steps = ['Personal Info', 'Other Details', 'Documents', 'Appoitment Details', 'Print'];

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

function UserInfo() {
  const { size } = typography;
  const [counters, setCounters] = useState({
    onLeave: 0,
    onDuty: 0,
    onRest: 0,
    onCourse: 0,
  });

  const [switcher, setSwitcher] = useState(
    false
  );

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {

    setActiveStep((prevActiveStep) => prevActiveStep + 1);


  };

  const handleBack = () => {

    setActiveStep((prevActiveStep) => prevActiveStep - 1);


  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      case 3:
        return <AppointmentForm />;
      case 4:
        return <DocumentSubmission />;
      default:
        return <div>Not Found</div>;
    }
  };


  useEffect(() => {
    fetchCounters();
  }, []);
  const fetchCounters = async () => {
    try {
      const response = await authAxios.get("/api/dashboard_counters");
      setCounters(response.data);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };
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
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <div>{renderStepContent(activeStep)}</div>
                  <div style={{ marginTop: '20px' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={activeStep === steps.length - 1}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
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

export default UserInfo;