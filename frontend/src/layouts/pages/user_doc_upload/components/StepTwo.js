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

const RequiredLabel = ({ text }) => (
  <span>
    {text} <span style={{ color: 'red' }}>*</span>
  </span>
);

const StepTwo = ({ formData,setFormData, err ,Profile_Picture, urlData  }) => {// Update the form data when input changes
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    console.log(formData);
  };
  
return (
  <Box padding={3} borderRadius={8} bgcolor="#f8f9fa">
  <Typography variant="h5" gutterBottom>
    Other Details
  </Typography>

  <Button variant="contained" component="label" style={{ marginBottom: '25px', marginTop: '15px' }} sx={{ color: 'white' }}>
    Upload Profile Picture 
    <input type="file" hidden label="" onChange={(e) => Profile_Picture(e, 'Profile_Picture')} />
  </Button>
  <Typography sx={{fontSize:'10px'}}>{urlData.Profile_Picture}</Typography>

  {/* Disability and Description */}
  {/* Disability and Description */}
<Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom={2}>
  <FormControl component="fieldset" style={{ width: '200px', marginRight: '16px' }}>
    <FormLabel component="legend" style={{ fontSize: '1.1rem' }}>
      <RequiredLabel text="Disability" />
    </FormLabel>
    <RadioGroup
      row
      aria-label="Disability"
      name="Disability"
      value={formData.Disability}
      onChange={(e) => handleInputChange(e, 'Disability')}
    >
      <FormControlLabel
        value="Yes"
        control={<Radio />}
        label="Yes"
        style={{ marginLeft: '8px', marginRight: '24px' }}
      />
      <FormControlLabel value="No" control={<Radio />} label="No" />
    </RadioGroup>
    {err.disability && <ErrorMessage message={err.disability} />}
  </FormControl>

  {/* Conditionally show the Description field */}
  {formData.Disability === 'Yes' && (
    <Box flexGrow={1}>
      <FormLabel component="legend" style={{ fontSize: '1.1rem' }}>
        Description
      </FormLabel>
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        name="Description"
        value={formData.Description}
        onChange={(e) => handleInputChange(e, 'Description')}
        InputProps={{
          sx: {
            '&::placeholder': {
              fontSize: '0.8rem',
            },
          },
        }}
        InputLabelProps={{
          sx: {
            fontSize: '0.9rem',
          },
        }}
      />
    </Box>
  )}
</Box>


  {/* Category */}
  <FormControl component="fieldset" margin="normal">
    <FormLabel component="legend" style={{ fontSize: '1.1rem' }}>
      <RequiredLabel text="Category" />
    </FormLabel>
    <RadioGroup
      row
      aria-label="category"
      name="category"
      value={formData.category}
      onChange={(e) => handleInputChange(e, 'category')}
    >
      <FormControlLabel
        value="Resident"
        control={<Radio />}
        label="Resident"
        style={{ marginLeft: '8px', marginRight: '24px' }}
      />
      <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
      <FormControlLabel value="Visitor" control={<Radio />} label="Visitor" />
      <FormControlLabel value="Hanna Orak" control={<Radio />} label="Hanna Orak" />
      <FormControlLabel value="Student" control={<Radio />} label="Student" />
      <FormControlLabel value="Labour" control={<Radio />} label="Labour" />
    </RadioGroup>
    {err.Category && <ErrorMessage message={err.Category} />}
  </FormControl>

    <TextFieldPair
      label1={"Vehicle Model"}
      label2={"Vehicle Make"}
      formDataValue1={formData.Vehicle_Model}
      formDataValue2={formData.Vehicle_Make}
      onChange1={(e) => handleInputChange(e, 'Vehicle_Model')}
      onChange2={(e) => handleInputChange(e, 'Vehicle_Make')}
    />
    {err.Vehicle_Model && <ErrorMessage message={err.Vehicle_Model} />}

    <TextFieldPair
      label1={"Vehicle Registration No" }
      label2={"Vehicle Type" }
      formDataValue1={formData.Vehicle_Registration_No}
      formDataValue2={formData.Vehicle_Type}
      onChange1={(e) => handleInputChange(e, 'Vehicle_Registration_No')}
      onChange2={(e) => handleInputChange(e, 'Vehicle_Type')}
    />
    {err.Vehicle_Registration_No && <ErrorMessage message={err.Vehicle_Registration_No} />}

    <Box display="flex" flexDirection="column" gap={2}>
    {/* <Button variant="contained" component="label" style={{ marginBottom: '18px', marginTop: '18px' }} sx={{ color: 'white' }}>
    Upload Previous Card picture 
    <input type="file" hidden label="" onChange={(e) => Previous_Card_Picture(e, 'Previous_Card_Picture')} />
  </Button>
  <Typography sx={{fontSize:'10px'}}>{urlData.Previous_Card_Picture}</Typography> */}
    <FormControl component="fieldset" margin="normal" style={{ marginTop: '1px' }}>
      <FormLabel component="legend" style={{ fontSize: '1.1rem' }}>
        <RequiredLabel text="Card Duration" />
      </FormLabel>
      <RadioGroup
        row
        aria-label="Card Duration"
        name="cardDuration"
        value={formData.Card_Duration}
        onChange={(e) => handleInputChange(e, 'Card_Duration')}
      >
        <FormControlLabel
          value="1 Year"
          control={<Radio />}
          label="1 Year"
          style={{ marginLeft: '8px', marginRight: '24px' }}
        />
        <FormControlLabel value="2 Year" control={<Radio />} label="2 Year" />
      </RadioGroup>
      {err.cardDuration && <ErrorMessage message={err.cardDuration} />}
    </FormControl>
    </Box>
    </Box>
);
}

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

export default StepTwo;
