// components/StepOne.js
import React from 'react';
import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import TextFieldPair from '../../../../components/TextFieldPair';

const StepOne = () => (
  <div>
    <h2>Personal Info</h2>
    <TextFieldPair label1="Applicant Name" label2="CNIC" />
    <TextFieldPair label1="Mobile No" label2="Home Phone.no (optional)" />

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}></div>
<Box display="flex" alignItems="center" gap={28} margin="normal">
<FormControl component="fieldset">
  <FormLabel component="legend">Applicant</FormLabel>
  <RadioGroup row aria-label="Applicant" name="Applicant">
    <FormControlLabel
      value="New"
      control={<Radio />}
      label="New"
      sx={{ marginLeft: '10px' }}
    />
    <FormControlLabel
      value="For Renewal"
      control={<Radio />}
      label="For Renewal"
      sx={{ marginLeft: '20px' }} // Adds space before "For Renewal"
    />
  </RadioGroup>
</FormControl>

<FormControl component="fieldset">
  <FormLabel component="legend">Gender</FormLabel>
  <RadioGroup row aria-label="gender" name="gender">
    <FormControlLabel
      value="male"
      control={<Radio />}
      label="Male"
      sx={{ marginLeft: '10px' }} // Space before "Male"
    />
    <FormControlLabel
      value="female"
      control={<Radio />}
      label="Female"
      sx={{ marginLeft: '20px' }} // Space before "Female"
    />
    <FormControlLabel
      value="other"
      control={<Radio />}
      label="Other"
      sx={{ marginLeft: '20px' }} // Space before "Other"
    />
  </RadioGroup>
</FormControl>

</Box>


    <TextFieldPair label1="Occupation" label2="Father/Husband Name" />
    <TextFieldPair label1="Guardian Contact Number" label2="Guardian CNIC" />
    <TextFieldPair label1="Province" label2="Caste" />
    <TextFieldPair label1="Present Address" label2="Permanent Address" />
    <TextField label="Nationality" fullWidth margin="normal" />
  </div>
);

export default StepOne;
