// components/StepThree.js
import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import ArgonButton from "components/ArgonButton";
const RequiredLabel = ({ text }) => (
  <span>
    {text} <span style={{ color: 'red' }}>*</span>
  </span>
);

const StepThree = ({formData,setFormData, err ,urlData,FCNIC,BCNIC,Vehicle_Documents,Police_Verification_Document}) => {// Update the form data when input changes
  const handleInputChange = (e,field) => {
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
      Documents
    </Typography>

    <Box marginBottom={2}>
      <ArgonButton
        variant="contained"
        component="label"
        color="primary"
            size="medium"
        style={{ marginBottom: '10px' }}
      >
        <RequiredLabel text="Upload Front Side of CNIC "  />
        <input
          type="file"
          hidden
          name="FCNIC"
          onChange={(e) => FCNIC(e,'FCNIC')}
        />
      </ArgonButton>
      <Typography sx={{fontSize:'10px'}}>{urlData.FCNIC}</Typography>
      {err.FCNIC && <ErrorMessage message={err.FCNIC} />}
    </Box>

    <Box marginBottom={2}>
    <ArgonButton
        variant="contained"
        component="label"
        color="primary"
            size="medium"
        style={{ marginBottom: '10px' }}
      >
        <RequiredLabel text="Upload Back Side of CNIC" />
        <input
          type="file"
          hidden
          name="BCNIC"
          onChange={(e) => BCNIC(e,'BCNIC')}
        />
      </ArgonButton>
      <Typography sx={{fontSize:'10px'}}>{urlData.BCNIC}</Typography>
      {err.BCNIC && <ErrorMessage message={err.BCNIC} />}
    </Box>

    <Box marginBottom={2}>
    <ArgonButton
        variant="contained"
        component="label"
        color="primary"
            size="medium"
        style={{ marginBottom: '10px' }}
      >
        <RequiredLabel text="Upload Vehicle Documents" />
        <input
          type="file"
          hidden
          name="Vehicle_Documents"
          onChange={(e) => Vehicle_Documents(e,'Vehicle_Documents')}
        />
      </ArgonButton>
      <Typography sx={{fontSize:'10px'}}>{urlData.Vehicle_Documents}</Typography>
      {err.Vehicle_Documents && <ErrorMessage message={err.Vehicle_Documents} />}
    </Box>

    <Box marginBottom={2}>
    <ArgonButton
        variant="contained"
        component="label"
        color="primary"
            size="medium"
        style={{ marginBottom: '10px' }}
      >
        <RequiredLabel text="Upload Police Verification Scanned Copy" />
        <input
          type="file"
          hidden
          name="Police_Verification_Document"
          onChange={(e) => Police_Verification_Document(e,'Police_Verification_Document')}
        />
      </ArgonButton>
      <Typography sx={{fontSize:'10px'}}>{urlData.Police_Verification_Document}</Typography>
      {err.Police_Verification_Document && <ErrorMessage message={err.Police_Verification_Document} />}
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

export default StepThree;
