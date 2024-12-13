import React, { useRef } from 'react';
import { Container, Box, Button, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const DocumentSubmission = ({ formData, setFormData, err, urlData }) => {
  const printRef = useRef();

  const styles = {
    page: {
      padding: 30,
      backgroundColor: "#ffffff",
      fontFamily: "Helvetica",
      fontSize: 11,
      color: "#333",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      borderBottom: "1px solid #333",
      paddingBottom: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#222",
      textTransform: "uppercase",
    },
    sectionHeader: {
      textAlign: 'center',
      marginVertical: 10,
      fontWeight: 'bold',
      fontSize: 14,
      color: "#444",
      borderBottom: "1px solid #ccc",
      paddingBottom: 5,
    },
    tableRow: {
      flexDirection: "row",
      margin: 2,
      alignItems: "center",
    },
    tableCell: {
      fontSize: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      flex: 1,
      textAlign: "left",
      margin: 2,
      backgroundColor: "#f9f9f9",
    },
    lastCell: {
      borderRightWidth: 0,
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 5,
      marginVertical: 15,
      alignSelf: "center",
      objectFit: "cover",
      borderWidth: "4px solid #808080",
    },
    boldText: {
      fontWeight: "bold",
    },
    // Print-specific styles
    printStyle: {
      "@media print": {
        '.printField': {
          fontSize: '9px',  // Reduce font size for these fields when printing
        },
      },
    },
  };

  const renderBioData = (bio, urlData) => (
    <div>
      <div style={{ display: 'block', marginBottom: 10 }}>
        <img src={bio.Profile_Picture} style={styles.image} alt="Profile" />
      </div>

      <div>
        <div style={{ display: 'block', marginBottom: 10 }} className="printField">
          <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: 2, color: "#333" }}>
            Applicant Name
          </Typography>
          <Typography variant="body2" style={{ color: "#555" }}>
            {bio.name}
          </Typography>
        </div>

        <div style={{ display: 'block', marginBottom: 10 }} className="printField">
          <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: 2, color: "#333" }}>
            CNIC
          </Typography>
          <Typography variant="body2" style={{ color: "#555" }}>
            {bio.cnic}
          </Typography>
        </div>

        <div style={{ display: 'block', marginBottom: 10 }} className="printField">
          <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: 2, color: "#333" }}>
            Mobile No
          </Typography>
          <Typography variant="body2" style={{ color: "#555" }}>
            {bio.Mobile_no}
          </Typography>
        </div>

        <div style={{ display: 'block', marginBottom: 10 }} className="printField">
          <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: 2, color: "#333" }}>
            Applicant Type
          </Typography>
          <Typography variant="body2" style={{ color: "#555" }}>
            {bio.Applicant}
          </Typography>
        </div>

        <div style={{ display: 'block', marginBottom: 10 }} className="printField">
          <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: 2, color: "#333" }}>
            Vehicle Registration No
          </Typography>
          <Typography variant="body2" style={{ color: "#555" }}>
            {bio.Vehicle_Registration_No}
          </Typography>
        </div>

        <div style={{ display: 'block', marginBottom: 10 }} className="printField">
          <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: 2, color: "#333" }}>
            Appointment Date
          </Typography>
          <Typography variant="body2" style={{ color: "#555" }}>
            {bio.Appointment_Day}
          </Typography>
        </div>

        <div style={{ display: 'block', marginBottom: 10 }} className="printField">
          <Typography variant="body2" style={{ fontWeight: "bold", marginBottom: 2, color: "#333" }}>
            Time Slot
          </Typography>
          <Typography variant="body2" style={{ color: "#555" }}>
            {bio.Appointment_Time}
          </Typography>
        </div>
      </div>
    </div>
  );

  const handlePrint = () => {
    const printContent = printRef.current;
    const newWindow = window.open();
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.write(`
      <style>
        .printField {
          font-size: 15px;  /* Make text smaller in print */
        }
      </style>
    `);
    newWindow.print();
  };

  return (
    <Container>
      {/* Print Button on Top Right */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
      </Box>

      {/* Content to Print */}
      <div ref={printRef}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h4" align="center"><strong>PERSONAL DETAILS</strong></Typography>

          {/* Personal Details */}
          {renderBioData(formData, urlData)}

          {/* Important Note Section */}
     
          <Box mt={5} p={2} bgcolor="#f1f1f1" borderRadius="8px">
  <Typography variant="h6" gutterBottom>
    NOTE
  </Typography>
  
  <Box display="flex" justifyContent="space-between">
    {/* English Section */}
    <Box width="48%">
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
    </Box>

     {/* Urdu Section */}
     <Box width="48%" textAlign="right" dir="rtl">
      <Typography variant="h6" gutterBottom>
        نوٹ
      </Typography>
      <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        آپ کی طرف سے فراہم کردہ معلومات ہر پہلو سے درست ہونی چاہئیں۔ غلط معلومات فراہم کرنے سے گیریژن کے احاطے میں مستقل پابندی اور دیگر قانونی کارروائی ہو سکتی ہے۔
      </Typography>
      <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        مزید درخواست کی جاتی ہے کہ فارم کو ڈاؤن لوڈ کیا جائے اور مقررہ تاریخ اور وقت پر اس کی ہارڈ کاپی ساتھ لائیں۔
      </Typography>
      <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        <strong>درخواست فارم درج ذیل دستاویزات کے ساتھ جمع کرانا ضروری ہے</strong>
      </Typography>
      <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        <strong>تمام رہائشی اور غیر رہائشی افراد</strong>
        <ul style={{ paddingRight: '1.2em' }}>
          <li>شناختی کارڈ / خاندانی رجسٹریشن سرٹیفکیٹ کی کاپی۔</li>
          <li>پاسپورٹ سائز تصویر۔</li>
          <li>گاڑی کے دستاویزات کی کاپی جو درخواست دہندہ کے نام پر رجسٹرڈ ہیں۔ اگر درخواست دہندہ کے نام پر رجسٹرڈ نہ ہو تو منتقلی کا خط شامل کریں۔</li>
          <li>والد / والدہ کا شناختی کارڈ اور خاندانی رجسٹریشن سرٹیفکیٹ (صرف طلباء کے لیے)۔</li>
          <li>اسکول کا اتھارٹی لیٹر (صرف طلباء کے لیے)۔</li>
        </ul>
      </Typography>
    </Box>
  </Box>
</Box>

        
        </Paper>
      </div>
    </Container>
  );
};

export default DocumentSubmission;


