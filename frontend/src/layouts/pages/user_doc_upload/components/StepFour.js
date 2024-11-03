import React from 'react';
import { Box, Typography, TextField, Container } from '@mui/material';
import ArgonSelect from "components/ArgonSelect"; // Adjust the import path if necessary

function AppointmentForm() {
  // Define an onChange handler for ArgonSelect
  const handleSelectChange = (value) => {
    console.log("Selected time slot:", value);
  };

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
          <ArgonSelect
            placeholder="Select time slot"
            defaultValue=""
            fullWidth
            variant="outlined"
            onChange={handleSelectChange} // Pass the handler here
            options={[
              { label: "Select time slot", value: "" },
              { label: "8:00 AM - 8:30 AM", value: "8:00 AM - 8:30 AM" },
              { label: "8:30 AM - 9:00 AM", value: "8:30 AM - 9:00 AM" },
              { label: "9:00 AM - 9:30 AM", value: "9:00 AM - 9:30 AM" }
            ]}
          />
        </Box>
      </Box>

      {/* Appointment Allotted Text */}
      <Typography variant="body2" color="textSecondary" align="center" mb={4}>
        Appointment Allotted: From null hours on 31-10-2024
      </Typography>
    </Container>
  );
}

export default AppointmentForm;
