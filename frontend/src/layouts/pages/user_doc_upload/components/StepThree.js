// components/StepThree.js
import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';

const StepThree = () => (
  <Box padding={3} borderRadius={8} bgcolor="#f8f9fa">
    <Typography variant="h5" gutterBottom>
      Documents
    </Typography>

    <Box marginBottom={2}>
      <Button
        variant="contained"
        component="label"
        style={{ marginBottom: '10px' }}
        sx={{ color: 'white' }} // Ensure the text color is white
      >
        Upload Front Side of CNIC
        <input type="file" hidden />
      </Button>
    </Box>

    <Box marginBottom={2}>
      <Button
        variant="contained"
        component="label"
        style={{ marginBottom: '10px' }}
        sx={{ color: 'white' }} // Ensure the text color is white
      >
        Upload Back Side of CNIC
        <input type="file" hidden />
      </Button>
    </Box>

    <Box marginBottom={2}>
      <Button
        variant="contained"
        component="label"
        style={{ marginBottom: '10px' }}
        sx={{ color: 'white' }} // Ensure the text color is white
      >
        Upload Police Verification Scanned Copy
        <input type="file" hidden />
      </Button>
    </Box>
  </Box>
);

export default StepThree;
