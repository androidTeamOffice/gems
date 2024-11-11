import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserLandingPage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', paddingTop: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="div" gutterBottom>
          GEMS
        </Typography>
        <Button variant="contained" color="error">
          Download Police Form
        </Button>
      </Box>
      
      <Box display="flex" justifyContent="center" mt={5} gap={5}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          bgcolor="#C0C0C0"
          color="white"
          borderRadius="8px"
          width="200px"
          height="150px"
        >

          <Typography variant="h6" component="div" fontSize="1.1rem" textAlign="center" style={{ color: 'black'}}>
            Application Status
          </Typography>
        </Box>
        
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          bgcolor="white"
          color="black"
          border="1px solid #ccc"
          borderRadius="8px"
          width="200px"
          height="150px"
          onClick={() => {
            navigate('/users/info/');
            console.log("clicked");
          }}
        >
          <Typography variant="h6" component="div" fontSize="1.1rem" textAlign="center">
            New Application
          </Typography>
        </Box>
      </Box>
      

      <Box mt={5} p={2} bgcolor="#f1f1f1" borderRadius="8px">
  <Typography variant="h6" gutterBottom>
    NOTE
  </Typography>
  <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
    The information provided by you must be correct in all aspects. Failing to provide correct information will lead to permanent ban from garrison premises and other legal action.
  </Typography>
  <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
    It is further requested that the form may be downloaded and a hardcopy brought along on the assigned date & time.
  </Typography>
  <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
    <strong>APPLICATION FORM MUST BE SUBMITTED WITH THE FOLLOWING DOCUMENTS</strong>
  </Typography>
  <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
    <strong>ALL Cat less Residents & Non Residents</strong>
    <ul style={{ paddingLeft: '1.2em' }}>
      <li>CNIC / FRC copy.</li>
      <li>Passport size picture.</li>
      <li>Copy of vehicle's documents registered in the applicant's name. If not registered in the applicant's name, include the transfer letter.</li>
      <li>Father / Mother CNIC & FRC copy (For Student Only).</li>
      <li>Authority letter from School (For Student only).</li>
    </ul>
  </Typography>
  <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
    <strong>Residents & Non Residents (Apart from Above)</strong>
    <ul style={{ paddingLeft: '1.2em' }}>
      <li>Copy of house/shop ownership/utility bills.</li>
      <li>Copy of rent agreement (if tenant)/utility bills.</li>
      <li>Necessary Legal Actions. </li>
    </ul>
  </Typography>
  <Typography variant="body2" paragraph style={{ color: 'red', fontSize: '0.9rem', lineHeight: '1.5' }}>
    <strong>Please Note:</strong>
    <ul style={{ paddingLeft: '1.2em' }}>
      <li>Validity of Card is subject to final security clearance by security agencies.</li>
      <li>If the CNIC of the card holder gets blocked (for any reason), the card holder must inform on Gar Facilitation contact number 0336-5785839, or the Gar entry pass will be blocked permanently.</li>
      <li>Applicants are required to reach GEP CN physically on the specified date & time for biometric verification, onsite picture, and other procedures.</li>
      <li>Please adhere to the allotted timings strictly to avoid inconvenience.</li>
    </ul>
  </Typography>
</Box>

    </Container>
  );
};

export default UserLandingPage;