// components/StepOne.js
import React from 'react';
import { TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const StepOne = () => (
  <div>
    <h2>Personal Info</h2>
    <TextField label="Applicant Name" fullWidth margin="normal" />
    <TextField label="CNIC" fullWidth margin="normal" />
    <TextField label="Mobile No" fullWidth margin="normal" />
    {/* Additional fields as required */}
    <FormControl component="fieldset" margin="normal">
      <RadioGroup row aria-label="gender" name="gender">
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
  </div>
);

export default StepOne;
