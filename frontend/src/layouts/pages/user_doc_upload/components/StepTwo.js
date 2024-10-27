// components/StepTwo.js
import React from 'react';
import { TextField, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

const StepTwo = () => (
  <div>
    <h2>Other Details</h2>
    <FormControl component="fieldset" margin="normal">
      <RadioGroup row aria-label="disability" name="disability">
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
    <TextField label="Description" fullWidth margin="normal" />
    <TextField label="Vehicle Model" fullWidth margin="normal" />
    <TextField label="Vehicle Make" fullWidth margin="normal" />
    {/* Additional fields as required */}
  </div>
);

export default StepTwo;
