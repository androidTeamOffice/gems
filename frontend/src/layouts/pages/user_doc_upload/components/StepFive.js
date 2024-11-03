import React, { useRef } from 'react';
import { Container, Box, Button, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Dummy data to simulate form state (replace with actual state or props)
const formData = {
  stepOne: {
    applicantName: "John Doe",
    cnic: "12345-6789012-3",
    mobile: "0300-1234567",
    homePhone: "021-1234567",
    applicantType: "New",
    gender: "Male",
    occupation: "Engineer",
    fatherName: "Mr. Doe",
    guardianContact: "0300-7654321",
    guardianCnic: "98765-4321098-7",
    province: "Province Name",
    caste: "Caste Name",
    presentAddress: "123 Main St",
    permanentAddress: "456 Another St",
    nationality: "Country Name"
  },
  stepTwo: {
    disability: "No",
    vehicleModel: "Toyota Corolla",
    vehicleMake: "2020",
    vehicleType: "Sedan",
    vehicleRegistration: "ABC-123",
    cardDuration: "1 Year"
  },
  stepThree: {
    uploadedDocuments: ["CNIC Front", "CNIC Back", "Police Verification"]
  },
  stepFour: {
    appointmentDate: "2024-10-31",
    timeSlot: "8:00 AM - 8:30 AM",
    appointmentLocation: "Main Office, Building A"
  }
};

const useStyles = makeStyles({
  container: {
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: '16px',
    backgroundColor: '#5e72e4',
    color: 'white',
  },
});

const DocumentSubmission = () => {
  const classes = useStyles();
  const printRef = useRef();

  const handlePreview = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Application Preview</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { margin-top: 20px; }
            strong { font-weight: bold; }
            .print-button {
              position: fixed;
              top: 10px;
              right: 10px;
              background-color: #5e72e4;
              color: white;
              padding: 8px 16px;
              border: none;
              cursor: pointer;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <button class="print-button" onclick="window.print()">Print</button>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Container className={classes.container}>
      <Box>
        <Button className={classes.button} onClick={handlePreview}>
          Preview
        </Button>

        {/* Hidden content for previewing and printing */}
        <div style={{ display: 'none' }} ref={printRef}>
          <Paper>
            <h2>Step One: Personal Info</h2>
            <p><strong>Applicant Name:</strong> {formData.stepOne.applicantName}</p>
            <p><strong>CNIC:</strong> {formData.stepOne.cnic}</p>
            <p><strong>Mobile No:</strong> {formData.stepOne.mobile}</p>
            <p><strong>Home Phone:</strong> {formData.stepOne.homePhone}</p>
            <p><strong>Applicant Type:</strong> {formData.stepOne.applicantType}</p>
            <p><strong>Gender:</strong> {formData.stepOne.gender}</p>
            <p><strong>Occupation:</strong> {formData.stepOne.occupation}</p>
            <p><strong>Father/Husband Name:</strong> {formData.stepOne.fatherName}</p>
            <p><strong>Guardian Contact Number:</strong> {formData.stepOne.guardianContact}</p>
            <p><strong>Guardian CNIC:</strong> {formData.stepOne.guardianCnic}</p>
            <p><strong>Province:</strong> {formData.stepOne.province}</p>
            <p><strong>Caste:</strong> {formData.stepOne.caste}</p>
            <p><strong>Present Address:</strong> {formData.stepOne.presentAddress}</p>
            <p><strong>Permanent Address:</strong> {formData.stepOne.permanentAddress}</p>
            <p><strong>Nationality:</strong> {formData.stepOne.nationality}</p>

            <h2>Step Two: Other Details</h2>
            <p><strong>Disability/Reasonable Adjustment:</strong> {formData.stepTwo.disability}</p>
            <p><strong>Vehicle Model:</strong> {formData.stepTwo.vehicleModel}</p>
            <p><strong>Vehicle Make:</strong> {formData.stepTwo.vehicleMake}</p>
            <p><strong>Vehicle Type:</strong> {formData.stepTwo.vehicleType}</p>
            <p><strong>Vehicle Registration No:</strong> {formData.stepTwo.vehicleRegistration}</p>
            <p><strong>Card Duration:</strong> {formData.stepTwo.cardDuration}</p>

            <h2>Step Three: Documents</h2>
            {formData.stepThree.uploadedDocuments.map((doc, index) => (
              <p key={index}><strong>{doc}</strong> uploaded</p>
            ))}

            <h2>Step Four: Appointment Details</h2>
            <p><strong>Appointment Date:</strong> {formData.stepFour.appointmentDate}</p>
            <p><strong>Time Slot:</strong> {formData.stepFour.timeSlot}</p>
            <p><strong>Appointment Location:</strong> {formData.stepFour.appointmentLocation}</p>
          </Paper>
        </div>
      </Box>
    </Container>
  );
};

export default DocumentSubmission;
