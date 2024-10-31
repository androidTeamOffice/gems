import React from 'react';
import { Box, Typography, Button, TextField, MenuItem, Paper, Container } from '@mui/material';

function AppointmentForm() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Form Fields */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        {/* Left Section */}
        <Box flex={1} mr={2}>
          <Typography variant="body1" mb={1}>Preferred Appointment Day:</Typography>
          <TextField
            type="date"
            defaultValue="2024-10-31"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        {/* Right Section */}
        <Box flex={1} ml={2}>
          <Typography variant="body1" mb={1}>Time Slot Available:</Typography>
          <TextField
            select
            defaultValue=""
            fullWidth
            variant="outlined"
            disabled
          >
            <MenuItem value="">Select time slot</MenuItem>
            {/* Populate with actual options if available */}
          </TextField>
        </Box>
      </Box>

      {/* Appointment Allotted Text */}
      <Typography variant="body2" color="textSecondary" align="center" mb={4}>
        Appointment Allotted: From null hours on 31-10-2024
      </Typography>

      {/* Next Button */}
      <Box textAlign="right">
        <Button variant="contained" color="success">
          Next
        </Button>
      </Box>
    </Container>
  );
}

export default AppointmentForm;
