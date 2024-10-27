import React from 'react';
import { Container, Box, Typography, Button, TextField, MenuItem, Stepper, Step, StepLabel } from '@mui/material';
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
    maxWidth: '900px',
  },
  stepper: {
    marginBottom: theme.spacing(4),
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#5e72e4',
    color: 'white',
  },
}));

const steps = ['Personal Info', 'Other Details', 'Documents', 'Appt Details', 'Print'];

const AppointmentForm = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(3);
  const [appointmentDate, setAppointmentDate] = React.useState('31-10-2024');
  const [timeSlot, setTimeSlot] = React.useState('');

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
          Appt Details
        </Typography>
        
        <TextField
          label="Preferred Appointment Day"
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="Time Slot Available"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className={classes.textField}
        >
          {/* Add available time slots here */}
          <MenuItem value="9am-10am">9am-10am</MenuItem>
          <MenuItem value="10am-11am">10am-11am</MenuItem>
          {/* ... more time slots */}
        </TextField>

        <Typography variant="body2" color="textSecondary">
          Appointment Alloted: From {timeSlot ? timeSlot : 'null'} hours on {appointmentDate}
        </Typography>

        <Button variant="contained" className={classes.button}>
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default AppointmentForm;