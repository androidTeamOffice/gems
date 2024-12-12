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

const RequiredLabel = ({ text }) => (
  <span>
    {text} <span style={{ color: 'red' }}>*</span>
  </span>
);

const StepOne = ({ formData, setFormData, err }) => {
  // Update the form data when input changes
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    console.log(formData);
  };

  return (
    <Box padding={3} borderRadius={8} bgcolor="#f8f9fa">
      <Typography variant="h5" gutterBottom>
        Personal Info
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* Applicant Name and CNIC */}
          <TextFieldPair
            label1={<RequiredLabel text="Applicant Name" />}
            label2={<RequiredLabel text="CNIC" />}
            formDaaValue1={formData.name}
            formDaaValue2={formData.cnic}
            onChange1={(e) => handleInputChange('name', e.target.value)}
            onChange2={(e) => handleInputChange('cnic', e.target.value)}
          />
          {err.name && <ErrorMessage message={err.name} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Mobile No and Home Phone No */}
          <TextFieldPair
            label1={<RequiredLabel text="Mobile No" />}
            label2="Home Phone No"
            formDaaValue1={formData.Mobile_no}
            formDaaValue2={formData.Home_phone_no}
            onChange1={(e) => handleInputChange('Mobile_no', e.target.value)}
            onChange2={(e) => handleInputChange('Home_phone_no', e.target.value)}
          />
          {err.Mobile_no && <ErrorMessage message={err.Mobile_no} />}
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-evenly" alignItems="flex-start" marginBottom={2} marginTop={2}>
        <FormControl component="fieldset">  
          <FormLabel component="legend" style={{ fontSize: '1.1rem' }}>
            <RequiredLabel text="Applicant" />
          </FormLabel>
          <RadioGroup
            row
            aria-label="Applicant"
            name="Applicant"
            value={formData.Applicant}
            onChange={(e) => handleInputChange('Applicant', e.target.value)}
          >
            <FormControlLabel value="New" control={<Radio />} label="New" style={{ marginRight: '24px' }} />
            <FormControlLabel value="For Renewal" control={<Radio />} label="For Renewal" />
          </RadioGroup>
          {err.Applicant && <ErrorMessage message={err.Applicant} />}
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ fontSize: '1.1rem' }}>
            <RequiredLabel text="Gender" />
          </FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" style={{ marginRight: '24px' }} />
            <FormControlLabel value="female" control={<Radio />} label="Female" style={{ marginRight: '24px' }} />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
          {err.gender && <ErrorMessage message={err.gender} />}
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* Occupation and Father_Husband_Name */}
          <TextFieldPair
            label1={<RequiredLabel text="Occupation" />}
            label2={<RequiredLabel text="Father_Husband_Name" />}
            formDaaValue1={formData.occupation}
            formDaaValue2={formData.Father_Husband_Name}
            onChange1={(e) => handleInputChange('occupation', e.target.value)}
            onChange2={(e) => handleInputChange('Father_Husband_Name', e.target.value)}
          />
          {err.occupation && <ErrorMessage message={err.occupation} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Guardian Contact Number and Guardian CNIC */}
          <TextFieldPair
            label1={<RequiredLabel text="Guardian Contact Number" />}
            label2={<RequiredLabel text="Guardian CNIC" />}
            formDaaValue1={formData.Gaurdian_Contact}
            formDaaValue2={formData.Gaurdian_CNIC}
            onChange1={(e) => handleInputChange('Gaurdian_Contact', e.target.value)}
            onChange2={(e) => handleInputChange('Gaurdian_CNIC', e.target.value)}
          />
          {err.Gaurdian_Contact && <ErrorMessage message={err.Gaurdian_Contact} />}
        </Grid>
      </Grid>

      <Grid item xs={12}>
  {/* Present Address */}
  <TextField
    label={<RequiredLabel text="Present Address" />}
    fullWidth
    margin="normal"
    value={formData.Present_Address}
    onChange={(e) => handleInputChange('Present_Address', e.target.value)}
    placeholder="Present Address"
    InputProps={{
      style: {
        fontSize: '1rem', // Matches the font size of other fields
      },
    }}
    inputProps={{
      style: {
        height: '40px', // Matches the height of other fields
      },
    }}
    sx={{
      '& .MuiInputLabel-root': {
        fontSize: '1rem', // Adjusts label size
      },
      '& .MuiOutlinedInput-root': {
        fontSize: '1rem', // Ensures input font size matches
      },
    }}
  />
  {err.Present_Address && <ErrorMessage message={err.Present_Address} />}
</Grid>

<Grid item xs={12}>
  {/* Permanent Address */}
  <TextField
    label={<RequiredLabel text="Permanent Address" />}
    fullWidth
    margin="normal"
    value={formData.Permanent_Address}
    onChange={(e) => handleInputChange('Permanent_Address', e.target.value)}
    placeholder="Permanent Address"
    InputProps={{
      style: {
        fontSize: '1rem', // Matches the font size of other fields
      },
    }}
    inputProps={{
      style: {
        height: '40px', // Matches the height of other fields
      },
    }}
    sx={{
      '& .MuiInputLabel-root': {
        fontSize: '1rem', // Adjusts label size
      },
      '& .MuiOutlinedInput-root': {
        fontSize: '1rem', // Ensures input font size matches
      },
    }}
  />
  {err.Permanent_Address && <ErrorMessage message={err.Permanent_Address} />}
</Grid>

    </Box>
  );
};

function ErrorMessage({ message }) {
  return (
    <p
      style={{
        color: "red",
        fontSize: "0.8rem",
        margin: "0 0",
      }}
    >
      {message}
    </p>
  );
}

export default StepOne;
