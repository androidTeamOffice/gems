import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL for the API
const api = axios.create({ baseURL: baseUrl });
import { useUserRole } from "../../../../context/UserRoleContext"; 
const UserLandingPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("New");
  const { id } = useUserRole(); 
  useEffect(() => {
  
    handleStatus();
  
}, [id]);
  const handleDownload = () => {
    // Link to the PoliceVerificationForm.pdf file in the public folder
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/PoliceVerificationForm.jpg`;
    link.download = 'PoliceVerificationForm.jpg';
    link.click();
  };
  const handleStatus = async () => {
    const payload = { id: id };
console.log("Payload:", payload);
    try {
      const response = await api.post("/api/checkFormStatus", payload);
      setStatus(response.data.message || "New"); // Update the status based on the response
    } catch (error) {
      console.error("Error fetching form status:", error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', paddingTop: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="div" gutterBottom>
          GEMS
        </Typography>
        <Button variant="contained" color="error" onClick={handleDownload}>
          Download Police Form
        </Button>
      </Box>
      
     <Typography
  variant="h6"
  sx={{
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'block',
    animation: 'scrollText 10s linear infinite',
    fontWeight: 'bold',
    color: 'red',
    mt: 2,
    animation: "scrollText 10s linear infinite",

    "@keyframes scrollText": {
      "0%": { transform: "translateX(100%)" },
      "100%": { transform: "translateX(-100%)" },
    },
  }}
>
  انتباہ: جن افراد کے پاس مکمل دستاویزات نہیں ہوں گی، ان کے خلاف قانونی چارہ جوئی کی جائے گی۔ 
  <br />
  Warning: Those who do not have complete documents will face legal action.
</Typography>

      
      <Box display="flex" justifyContent="center" mt={5} gap={5}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          bgcolor={ status === "New"
            ? "#C0C0C0" // Gray
            : status === "Verified"
            ? "#2cfc03" // Green
            : status === "Rejected"
            ? "#fc0303" // Red
            : "#C0C0C0"}
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
      <Box display="flex" justifyContent="flex-start" alignItems="center" gap={2} mt={2}>
  <Box display="flex" alignItems="center" ml={40}> {/* Added margin-left */}
    <Box width="10px" height="10px" bgcolor="#C0C0C0" borderRadius="50%" mr={0.5} />
    <Typography variant="caption">Pending</Typography>
  </Box>
  <Box display="flex" alignItems="center">
    <Box width="10px" height="10px" bgcolor="#2cfc03" borderRadius="50%" mr={0.5} />
    <Typography variant="caption">Verified</Typography>
  </Box>
  <Box display="flex" alignItems="center">
    <Box width="10px" height="10px" bgcolor="#fc0303" borderRadius="50%" mr={0.5} />
    <Typography variant="caption">Rejected</Typography>
  </Box>
</Box>



      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mt={5} gap={5}>
  {/* Left Side: Note Portion */}
  <Box flex="1" p={2} bgcolor="#f1f1f1" borderRadius="8px">
    <Typography variant="h6" gutterBottom>
      NOTE
    </Typography>
    <Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>Necessary Documents for Obtaining Cantt Pass</strong>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>Compulsory documents for all categories:-</strong>
  <ul style={{ paddingLeft: '1.2em' }}>
    <li>Completely filled GEP form attested by the concerned police station.</li>
    <li>Original Identity Card or Copy of Form ‘B’.</li>
    <li>One passport size photograph.</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>Additional Documents for Cantt Residents:-</strong>
  <ul style={{ paddingLeft: '1.2em' }}>
    <li>In case of residence in a private house, 1x Copy of GLR attested by MEO and 1x Copy of electricity and gas bill.</li>
    <li>In case of residence in a government house, 1x Copy of attested allotment letter of the concerned institution and 1x Copy of electricity and gas bills.</li>
    <li>
      In case of a tenant in a civil house, a copy of the identity card of the landlord and attested copy of the rent agreement, 
      along with a copy of the electricity and gas bill.
    </li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>Additional Documents for Students:-</strong>
  <ul style={{ paddingLeft: '1.2em' }}>
    <li>Parent’s ID card copy and authorization letter issued by the concerned educational institution.</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>Additional Documents for Employees:-</strong>
  <ul style={{ paddingLeft: '1.2em' }}>
    <li>Certificate or official authority letter of the concerned company.</li>
    <li>If there is a shop, its affidavit (ID card of shop owner and attested allotment of shop).</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>Additional Documents for Hanna Urak:-</strong>
  <ul style={{ paddingLeft: '1.2em' }}>
    <li>Attested form from Mashraan/Malik for Hanna Urak Cantt Pass.</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>Additional Documents for Laborers:-</strong>
  <ul style={{ paddingLeft: '1.2em' }}>
    <li>Attested copy of agreement letter and copy of security fee slip for labor Cantt Pass.</li>
  </ul>
</Typography>

  </Box>

  {/* Right Side: Urdu Text */}
  <Box flex="1" p={2} bgcolor="#f9f9f9" borderRadius="8px" textAlign="right" dir="rtl">
  <Typography variant="h6" gutterBottom>
  نوٹ
</Typography>
<Typography variant="h6" gutterBottom>
  کینٹ پاس کے حصول کے لئے ضروری دستاویزات
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5', marginTop: '1em'}}>
  <strong>تمام کیٹگری کے لئے لازمی دستاویزات (All Cat)</strong>
  <ul style={{ paddingRight: '1.2em', listStyleType: 'disc' }}>
    <li>متعلقہ پولیس تھانے سے تصدیق شدہ مکمل GEP فارم۔</li>
    <li>اصل شناختی کارڈ یا فارم’ب‘ کی کاپی۔</li>
    <li>ایک عدد پاسپورٹ سائز تصویر۔</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>کینٹ کے رہائشی افراد کے لئے اضافی دستاویزات(Resident)</strong>
  <ul style={{ paddingRight: '1.2em', listStyleType: 'disc' }}>
    <li>ذاتی گھر میں رہائش کی صورت میں جی ایل آر کی MEO سے تصدیق شدہ کاپی، بجلی اور گیس کے بل کی کاپی۔</li>
    <li>سرکاری گھرمیں رہائش کی صورت میں متعلقہ ادارے کے الاٹمنٹ لیٹر کی تصدیق شدہ کاپی، بجلی اور گیس کے بل کی کاپی۔</li>
    <li>
      سول گھر میں کرایہ دار کی صورت میں مالک مکان کی شناختی کارڈ کی کاپی اور کرایے کے معاہدے کی تصدیق شدہ کاپی،
      بجلی اور گیس کے بل کی کاپی (مالک مکان کے الاٹمنٹ لیٹر کی کاپی)۔
    </li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>طالب علم کے لئے اضافی دستاویزات (Student)</strong>
  <ul style={{ paddingRight: '1.2em', listStyleType: 'disc' }}>
    <li>والدین کی شناختی کارڈ کاپی اور متعلقہ تعلیمی ادارے سے جاری شدہ اتھارٹی لیٹر۔</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>ملازمین کے لئے اضافی دستاویزات (Employee)</strong>
  <ul style={{ paddingRight: '1.2em', listStyleType: 'disc' }}>
    <li>متعلقہ کمپنی کا سرٹیفکیٹ یا آفیشل اتھارٹی لیٹر۔</li>
    <li>اگر کوئی دکان ہے تو اس کا لیٹر پیڈ اور حلف نامہ (دکان مالک کا شناختی کارڈ اور دکان کی تصدیق شدہ الاٹمنٹ)۔</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>ہنہ اوڑک کے لئے اضافی دستاویزات (Hanna Orak)</strong>
  <ul style={{ paddingRight: '1.2em', listStyleType: 'disc' }}>
    <li>ہنہ اوڑک کینٹ پاس کے لئے ملک/ مشران سے تصدیق شدہ فارم۔</li>
  </ul>
</Typography>
<Typography variant="body2" paragraph style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
  <strong>مزدور کے لئے اضافی دستاویزات (Labour)</strong>
  <ul style={{ paddingRight: '1.2em', listStyleType: 'disc' }}>
    <li>مزدور کینٹ پاس کے لئے اگریمنٹ لیٹر کی تصدیق شدہ کاپی اور سیکورٹی فیس کی سلپ کی کاپی۔</li>
  </ul>
</Typography>


  </Box>
</Box>

    </Container>
  );
};

export default UserLandingPage;
