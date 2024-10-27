import React from 'react';
import { Container, Box, Typography, Button, Stepper, Step, StepLabel, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#f8f9fa',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'white',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    width: '80%',
    maxWidth: '1200px',
  },
  stepper: {
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: '#d4e157',
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#5e72e4',
    color: 'white',
  },
  footer: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
}));

const steps = ['Personal Info', 'Other Details', 'Documents', 'Appt Details', 'Print'];

const DocumentSubmission = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(4);

  return (
    <Container className={classes.container}>
      <Box className={classes.box}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h6" gutterBottom>
          Print
        </Typography>

        <Paper className={classes.paper}>
          <Typography variant="body2" paragraph>
            The information provided by you must be correct in all aspects. Failing to provide correct information
            will lead to permanent ban from garrison premises and other legal action.
          </Typography>
          <Typography variant="body2" paragraph>
            It is further requested that form may be downloaded and hardcopy to be brought along on assigned date & time.
          </Typography>

          <Typography variant="h6" gutterBottom>
            APPLICATION FORM MUST BE SUBMITTED WITH FOLLOWING DOCUMENTS
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>ALL Cat less Residents & Non Residents</strong><br />
            1. CNIC / FRC copy.<br />
            2. Passport size picture.<br />
            3. Copy of vehicle's documents registered in the name of applicant. In case the vehicle is not yet
            registered in the name of applicant, the transfer letter may be attached.<br />
            4. Father / Mother CNIC & FRC copy (For Student Only).<br />
            5. Authority letter from School (For Student only).
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>Residents & Non Residents (Apart from Above)</strong><br />
            1. Copy of house/ shop/ ownership/ utility bills.<br />
            2. Copy of rent agreement (if tenant)/ utility bills.<br />
            3. Registered company certificate or official authority letter for services / Provisioning civilians category.
          </Typography>

          <Typography variant="body2" color="error" paragraph>
            <strong>Please Note:</strong><br />
            1. Validity of Card is Subject to final security Clearance by security agencies.<br />
            2. In case CNIC of card holder gets blocked (due to any reason), Card holder must info on Gar Facilition
            contact number 0336-5785839, else Gar entry pass will be blocked permanently.<br />
            3. Applicants are required to reach GEP CN Physically on specified date & time for biometric verification,
            on side pic and other procedure.<br />
            4. Please add here to allotted timings strictly in order to avoid inconvenience.
          </Typography>
        </Paper>

        <Button variant="contained" className={classes.button}>
          Preview
        </Button>

        <Typography variant="body2" className={classes.footer}>
          Copyright © 2024 GEMS. Powered By Inotech Solutions
        </Typography>
      </Box>
    </Container>
  );
};

export default DocumentSubmission;