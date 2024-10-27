// components/StepThree.js
import React from 'react';
import { TextField, Button } from '@mui/material';

const StepThree = () => (
  <div>
    <h2>Documents</h2>
    <Button variant="outlined" component="label">
      Upload Front Side of CNIC
      <input type="file" hidden />
    </Button>
    <Button variant="outlined" component="label" style={{ marginTop: '10px' }}>
      Upload Back Side of CNIC
      <input type="file" hidden />
    </Button>
    <Button variant="outlined" component="label" style={{ marginTop: '10px' }}>
      Upload Police Verification
      <input type="file" hidden />
    </Button>
  </div>
);

export default StepThree;
