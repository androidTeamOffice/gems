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
  Button
} from '@mui/material';
import TextFieldPair from '../../../../components/TextFieldPair';

const RequiredLabel = ({ text }) => (
  <span>
    {text} <span style={{ color: 'red' }}>*</span>
  </span>
);

const StepOne = ({ formData, setFormData, err, Previous_Card_Picture, urlData, setUrlData}) => {
  // Update the form data when input changes
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    console.log(formData);
  };

  const handlePreviousCardPicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = `C:\\fakepath\\${file.name}`; 
      setFormData((prevData) => ({
        ...prevData,
        Previous_Card_Picture: file,
      }));
      setUrlData((prevData) => ({
        ...prevData,
        Previous_Card_Picture: fileUrl, 
      }));
    }
  };
  
  const handleApplicantChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      Applicant: value,
      Previous_Card_Picture: value === "For Renewal" ? prevData.Previous_Card_Picture : null,
    }));
    setUrlData((prevData) => ({
      ...prevData,
      Previous_Card_Picture: value === "For Renewal" ? prevData.Previous_Card_Picture : "",
    }));
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

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom={2} marginTop={2}>
      <FormControl component="fieldset" style={{ width: '200px', marginRight: '16px' }}>
        <FormLabel component="legend" style={{ fontSize: '1.1rem' }}>
          <RequiredLabel text="Applicant" />
        </FormLabel>
        <RadioGroup
  row
  aria-label="Applicant"
  name="Applicant"
  value={formData.Applicant}
  onChange={handleApplicantChange}
>
  <FormControlLabel
    value="New"
    control={<Radio />}
    label="New"
    style={{ marginRight: "24px" }}
  />
  <FormControlLabel
    value="For Renewal"
    control={<Radio />}
    label="For Renewal"
  />
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
{/* Conditionally show the Upload Button */}
{formData.Applicant === 'For Renewal' && (
        <Box flexGrow={1} display="flex" alignItems="center" justifyContent="flex-start">
          <Button
            variant="contained"
            component="label"
            style={{ marginBottom: '18px', marginTop: '18px' }}
            sx={{ color: 'white' }}
          >
            Upload Previous Card Picture
            <input
              type="file"
              hidden
              onChange={e => Previous_Card_Picture(e, 'Previous_Card_Picture')} // Call the new handler here
            />
          </Button>
        </Box>
      )}

      {/* Conditionally show the uploaded file URL */}
      {formData.Applicant === 'For Renewal' && urlData.Previous_Card_Picture && (
        <Typography sx={{ fontSize: '10px', color: 'green' }}>
          {urlData.Previous_Card_Picture}
        </Typography>
      )}
   
      <Grid item xs={12} sm={8}>
        {/* Father_Husband_Name and Guardian CNIC */}
        <TextFieldPair
          label1={<RequiredLabel text="Father/Husband/GuardianName" />}
          label2={<RequiredLabel text="Father/Husband/GuardianCNIC" />}
          formDaaValue1={formData.Father_Husband_Name}
          formDaaValue2={formData.Gaurdian_CNIC}
          onChange1={(e) => handleInputChange('Father_Husband_Name', e.target.value)}
          onChange2={(e) => handleInputChange('Gaurdian_CNIC', e.target.value)}
        />
        {err.occupation && <ErrorMessage message={err.occupation} />}
      </Grid>
      <Grid item xs={12} sm={8}>
        {/* Guardian Contact Number and Occupation */}
        <TextFieldPair
          label1={<RequiredLabel text="Father/Husband/GuardianContact" />}
          label2={<RequiredLabel text="Occupation" />}
          formDaaValue1={formData.Gaurdian_Contact}
          formDaaValue2={formData.occupation}
          onChange1={(e) => handleInputChange('Gaurdian_Contact', e.target.value)}
          onChange2={(e) => handleInputChange('occupation', e.target.value)}
        />
        {err.Gaurdian_Contact && <ErrorMessage message={err.Gaurdian_Contact} />}
      </Grid>

      <Grid item xs={12} display="flex">
        {/* Present Address */}
        <TextField
          label={<RequiredLabel text="Present Address" />}
          fullWidth
          margin="normal"
          value={formData.Present_Address}
          onChange={(e) => handleInputChange("Present_Address", e.target.value)}
          placeholder="House near zam zam plaza"
          InputProps={{
            style: {
              fontSize: "1rem",
              padding: "5px", // Padding inside the input
            },
          }}
          inputProps={{
            style: {
              height: "40px", // Ensures single line height
              width: "100%", // Ensures input field spans full width of the container
              boxSizing: "border-box", // Includes padding in width calculation
            },
          }}
          sx={{
            "& .MuiInputLabel-root": {
              fontSize: "1rem",
            },
            "& .MuiOutlinedInput-root": {
              fontSize: "1rem",
              borderRadius: "4px", // Slightly rounded corners for a clean look
              width: "100%", // Ensures the field spans full width
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
