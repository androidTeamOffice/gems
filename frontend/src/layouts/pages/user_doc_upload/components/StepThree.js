// components/StepThree.js
import React from 'react';
import { TextField, Button } from '@mui/material';

const StepThree = () => (
  <div>
    <h2>Documents</h2>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}></div>
    <div>
  <Button variant="outlined" component="label" style={{ marginBottom: '10px' }}>
    Upload Front Side of CNIC
    <input type="file" hidden />
  </Button>
</div>
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}></div>
  <Button variant="outlined" component="label" style={{ marginBottom: '10px' }}>
    Upload Back Side of CNIC
    <input type="file" hidden />
  </Button>
</div>
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}></div>
  <Button variant="outlined" component="label" style={{ marginBottom: '10px' }}>
    Upload Police Verification
    <input type="file" hidden />
  </Button>
</div>
  </div>
);

export default StepThree;
