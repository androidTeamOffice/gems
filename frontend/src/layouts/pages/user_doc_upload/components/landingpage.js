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
      <Box mt={5}>
        <Typography variant="body1" component="div" gutterBottom>
          Always wear a seatbelt for your protection. Stop at red lights and obey traffic signals. Obey speed limits to ensure everyone's safety.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" mt={5} gap={5}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={3}
          bgcolor="#5A5C69"
          color="white"
          borderRadius="8px"
          width="200px"
          height="150px"
        >
          <Typography variant="h6" component="div">
            Application Status
          </Typography>
          <Typography variant="body2" component="div" textAlign="center">
            Track the progress of your application quickly and easily. Details to view latest updates.
          </Typography>
        </Box>
     
       
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={3}
          bgcolor="white"
          color="black"
          border="1px solid #ccc"
          borderRadius="8px"
          width="200px"
          height="150px"

          onClick={() => {

            navigate('/users/info/')
            console.log("clicked")
          }}
        >

    
          <Typography variant="h6" component="div">
            New Application
          </Typography>
          <Typography variant="body2" component="div" textAlign="center">
            Start a new application effortlessly. Fill out the form to begin and submit your details for review.
          </Typography>
        </Box>
      <input type="file" hidden />

      </Box>
      <Box mt={5} textAlign="center">
        <Typography variant="body2" component="div">
          Copyright © 2024 GEMS
        </Typography>
        <Typography variant="body2" component="div">
          Powered by Inotech Solutions
        </Typography>
      </Box>
    </Container>
  );
};
export default UserLandingPage;