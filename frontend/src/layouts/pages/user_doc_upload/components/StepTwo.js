// components/StepTwo.js
import React from 'react';
import { TextField, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Button } from '@mui/material';
import TextFieldPair from '../../../../components/TextFieldPair';

const StepTwo = () => (
  <div>
    <h2>Other Details</h2>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}></div>
    <Button variant="outlined" component="label" style={{ marginBottom: '18px' }}>
  Upload Profile Picture
  <input type="file" hidden />
</Button>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
  <FormControl component="fieldset" style={{ flex: 1, marginRight: '16px' }}>
    <FormLabel component="legend">Disability/Reasonable Adjustment</FormLabel>
    <RadioGroup row aria-label="Disability/Reasonable Adjustment" name="Disability/Reasonable Adjustment">
      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
      <FormControlLabel value="No" control={<Radio />} label="No" />
    </RadioGroup>
  </FormControl>
  <TextField label="Description" fullWidth margin="normal" style={{ flex: 1 }} />
</div>

    <TextFieldPair label1="Vehicle Model" label2="Vehicle Make" />
    <TextFieldPair label1="Vehicle Type" label2="Vehicle Registration No: Typography" />
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}></div>
    <FormControl component="fieldset">
    <FormLabel component="legend">Card Duration</FormLabel>
    <RadioGroup row aria-label="Card Duration" name="Card Duration">
      <FormControlLabel value="1 Year" control={<Radio />} label="1 Year" />
      <FormControlLabel value="2 Year" control={<Radio />} label="2 Year" />
    </RadioGroup>
  </FormControl>
  </div>
);

export default StepTwo;
