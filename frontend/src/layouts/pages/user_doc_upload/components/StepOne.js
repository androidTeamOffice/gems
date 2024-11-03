// components/StepOne.js
import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Typography,
  TextField,
} from '@mui/material';
import TextFieldPair from '../../../../components/TextFieldPair';

const StepOne = () => (
  <Box padding={3} borderRadius={8} bgcolor="#f8f9fa">
    <Typography variant="h5" gutterBottom>
      Personal Info
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextFieldPair label1="Applicant Name" label2="CNIC" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldPair label1="Mobile No" label2="Home Phone No (optional)" />
      </Grid>
    </Grid>

    <Box display="flex" justifyContent="space-evenly" alignItems="flex-start" marginBottom={2}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Applicant</FormLabel>
        <RadioGroup row aria-label="Applicant" name="Applicant">
          <FormControlLabel value="New" control={<Radio />} label="New" />
          <FormControlLabel value="For Renewal" control={<Radio />} label="For Renewal" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup row aria-label="gender" name="gender">
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
    </Box>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextFieldPair label1="Occupation" label2="Father/Husband Name" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldPair label1="Guardian Contact Number" label2="Guardian CNIC" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldPair label1="Province" label2="Caste" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldPair label1="Present Address" label2="Permanent Address" />
      </Grid>
    </Grid>

    {/* Converted Nationality to TextFieldPair */}
    <Grid item xs={12}>
      <TextField
        label="Nationality"
        fullWidth
        margin="normal"
        InputLabelProps={{
          sx: {
            fontSize: '0.9rem', // Adjust label font size
          },
        }}
        InputProps={{
          sx: {
            '&::placeholder': {
              fontSize: '0.8rem', // Adjust placeholder font size
            },
          },
        }}
        placeholder="Nationality"
      />
    </Grid>
  </Box>
);

export default StepOne;
