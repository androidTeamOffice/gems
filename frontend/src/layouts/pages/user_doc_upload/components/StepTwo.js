// components/StepTwo.js
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
} from '@mui/material';
import TextFieldPair from '../../../../components/TextFieldPair';

const StepTwo = () => (
  <Box padding={3} borderRadius={8} bgcolor="#f8f9fa">
    <Typography variant="h5" gutterBottom>
      Other Details
    </Typography>

    <Button variant="contained" component="label" style={{ marginBottom: '18px' }} sx={{ color: 'white' }} >
      Upload Profile Picture
      <input type="file" hidden />
    </Button>

    <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom={2}>
      <FormControl component="fieldset" style={{ flex: 1, marginRight: '16px' }}>
        <FormLabel component="legend">Disability/Reasonable Adjustment</FormLabel>
        <RadioGroup row aria-label="Disability/Reasonable Adjustment" name="Disability/Reasonable Adjustment">
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        style={{ flex: 1 }}
        InputProps={{
          sx: {
            '&::placeholder': {
              fontSize: '0.8rem', // Adjust placeholder font size
            },
          },
        }}
        InputLabelProps={{
          sx: {
            fontSize: '0.9rem', // Adjust label font size
          },
        }}
      />
    </Box>

    <TextFieldPair label1="Vehicle Model" label2="Vehicle Make" />
    <TextFieldPair label1="Vehicle Type" label2="Vehicle Registration No" />

    <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom={2}></Box>
    <FormControl component="fieldset" margin="normal">
      <FormLabel component="legend">Card Duration</FormLabel>
      <RadioGroup row aria-label="Card Duration" name="Card Duration">
        <FormControlLabel value="1 Year" control={<Radio />} label="1 Year" />
        <FormControlLabel value="2 Year" control={<Radio />} label="2 Year" />
      </RadioGroup>
    </FormControl>
  </Box >
);

export default StepTwo;
