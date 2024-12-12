
import Grid from "@mui/material/Grid";

import { useState, useEffect } from "react";
// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import Card from "@mui/material/Card";

// Argon Dashboard 2 PRO MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import Footer from "examples/Footer";


// Argon Dashboard 2 PRO MUI base styles
import typography from "assets/theme/base/typography";

import axios from "axios";
// import Wizard from "layouts/pages/user_doc_upload";
import { useUserRole } from "../../../context/UserRoleContext"; 
import Header from "../../dashboards/user/components/Header";
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import AppointmentForm from './components/StepFour';
import DocumentSubmission from './components/StepFive';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Swal from "sweetalert2";
import Button from '@mui/material/Button';
import * as Yup from "yup";
import CircularProgress from "@mui/material/CircularProgress"; // MUI Spinner


const steps = ['Personal Info', 'Other Details', 'Documents', 'Appoitment Details', 'Print'];

const bgImage = "";
//
// Request interceptor to add JWT token to Authorization header (if present)
const baseUrl = process.env.REACT_APP_BASE_URL; // Assuming variable name is REACT_APP_BASE_URL
const authAxios = axios.create({
  baseURL: baseUrl,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("pdf_excel_hash");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

function UserInfo() {
  const { size } = typography;
  const [counters, setCounters] = useState({
    onLeave: 0,
    onDuty: 0,
    onRest: 0,
    onCourse: 0,
  });

  const [switcher, setSwitcher] = useState(
    false
  );

 

 
  const { id } = useUserRole(); 
 


    useEffect(() => {
    
      setFormData((prevFormData) => ({
        ...prevFormData,
        userid: id, // Dynamically set the field key
      }));
     
    
  }, [id]);


  const [loading, setLoading] = useState(
    false
  );
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {
    try {
      let missingFields = [];
      switch (activeStep) {
        case 0:
          // Check if required fields are filled
          const requiredFieldsStep0 = [
            "name",
            "cnic",
            "occupation",
            "Applicant",
            "Mobile_no",
            "Home_phone_no",
            "Father_Husband_Name",
            "Gaurdian_Contact",
            "Gaurdian_CNIC",
            "Present_Address",
            "Permanent_Address",
          ];
  
          missingFields = requiredFieldsStep0.filter(
            (field) => !formData[field] || formData[field].trim() === ""
          );
  
          if (missingFields.length > 0) {
            // Show a dialog or alert for missing fields
            alert(`The following fields are required: ${missingFields.join(", ")}`);
            return; // Stop here if validation fails
          }
  
          // If validation passes, move to the next step
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          break;
  
        case 1:
          // Check if required fields are filled
          const requiredFieldsStep1 = [
            "Profile_Picture",
            "Disability",
            "category",
            "Card_Duration",
            
          ];
  
          missingFields = requiredFieldsStep1.filter(
            (field) => !formData[field] || formData[field].trim() === ""
          );
  
          if (missingFields.length > 0) {
            // Show a dialog or alert for missing fields
            alert(`The following fields are required: ${missingFields.join(", ")}`);
            return; // Stop here if validation fails
          }
  
          // If validation passes, move to the next step
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          break;

        case 2:
          // Check if required fields are filled
          const requiredFieldsStep2 = [
            "FCNIC",
            "BCNIC",
            "Vehicle_Documents",
            "Police_Verification_Document",
            
          ];
  
          missingFields = requiredFieldsStep2.filter(
            (field) => !formData[field] || formData[field].trim() === ""
          );
  
          if (missingFields.length > 0) {
            // Show a dialog or alert for missing fields
            alert(`The following fields are required: ${missingFields.join(", ")}`);
            return; // Stop here if validation fails
          }
  
          // If validation passes, move to the next step
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          break;

          case 3:
             // Check if required fields are filled
          const requiredFieldsStep3 = [
            "Appointment_Day",
            "Appointment_Time",
            
          ];
  
          missingFields = requiredFieldsStep3.filter(
            (field) => !formData[field] || formData[field].trim() === ""
          );
  
          if (missingFields.length > 0) {
            // Show a dialog or alert for missing fields
            alert(`The following fields are required: ${missingFields.join(", ")}`);
            return; // Stop here if validation fails
          }
  
          // If validation passes, move to the next step
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          break;


        case 4:
          // Proceed to the next step for other cases
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          break;
  
        default:
          console.error("Unhandled step:", activeStep);
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };
  
  const [errors, setErrors] = useState({});
  const [urlData, setUrlData] = useState({
    FCNIC: "",
    Profile_Picture: "", // for file input
    Previous_Card_Picture: "",
    BCNIC: "",
    Vehicle_Documents: "", // for file input
    Police_Verification_Document: "", // for file input
  
  });
// Define initial form data state
const [formData, setFormData] = useState({
  name: "",
  userid: "",
  cnic: "",
  occupation: "",
  category: "",
  Applicant: "",
  status: "",
  remarks: "",
  Card_Duration: "",
  Vehicle_Registration_No: "",
  Mobile_no: "",
  Home_phone_no: "",
  FCNIC: "",
  Father_Husband_Name: "",
  Gaurdian_Contact: "",
  Gaurdian_CNIC: "",
  Gaurdian_Occupation: "",
  Present_Address: "",
  Permanent_Address: "",
  Profile_Picture: null, // for file input
  Disability: "",
  Description: "",
  Vehicle_Make: "",
  Vehicle_Model: "",
  Vehicle_Type: "",
  Previous_Card_Picture: "",
  BCNIC: "",
  Vehicle_Documents: null, // for file input
  Police_Verification_Document: null, // for file input
  Appointment_Day: "",
  Appointment_Time: "",
});

// Handle form field changes
const handleChange = (event) => {
  setFormData({ ...formData, [event.target.name]: event.target.value });
};
const handleClear = (event) => {
  setFormData({
    name: "",
  cnic: "",
  occupation: "",
  category: "",
  type: "",
  status: "",
  remarks: "",
  Card_Duration: "",
  Vehicle_Registration_No: "",
  Mobile_no: "",
  Home_phone_no: "",
  FCNIC: "",
  Father_Husband_Name: "",
  Gaurdian_Contact: "",
  Gaurdian_CNIC: "",
  Gaurdian_Occupation: "",
  Caste: "",
  Province: "",
  Nationality: "",
  Present_Address: "",
  Permanent_Address: "",
  Profile_Picture: null, // for file input
  Disability: "",
  Description: "",
  Vehicle_Make: "",
  Vehicle_Model: "",
  Vehicle_Type: "",
  BCNIC: "",
  Vehicle_Documents: null, // for file input
  Police_Verification_Document: null, // for file input
  Appointment_Day: "",
  Appointment_Time: "",
  });
};
/*

For the references only:
name, cnic, occupation, category, type, status, remarks, Card_Duration, Vehicle_Registration_No, Mobile_no, Home_phone_no,
     FCNIC, Father_Husband_Name, Gaurdian_Contact,Gaurdian_CNIC, Gaurdian_Occupation, Caste, Province, Nationality, Present_Address,
      Permanent_Address, Profile_Picture, Disability, Description, Vehicle_Make, Vehicle_Model, Vehicle_Type, BCNIC, Vehicle_Documents,
       Police_Verification_Document, Appointment_Day, Appointment_Time



*/

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  cnic: Yup.string()
    .matches(/^[0-9]{13}$/, "CNIC must be 13 digits")
    .required("CNIC is required"),
  occupation: Yup.string().required("Occupation is required"),
  category: Yup.string().required("Category is required"),
  type: Yup.string().required("Type is required"),
  status: Yup.string().required("Status is required"),
  remarks: Yup.string(),
  Card_Duration: Yup.number().required("Card Duration is required"),
  Vehicle_Registration_No: Yup.string()
    .matches(/^[A-Z0-9]+$/, "Vehicle Registration No should be alphanumeric")
    .required("Vehicle Registration No is required"),
  Mobile_no: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Mobile number should be 10-11 digits")
    .required("Mobile number is required"),
  Home_phone_no: Yup.string().matches(/^[0-9]{10,11}$/, "Home phone number should be 10-11 digits"),
  FCNIC: Yup.string()
    .matches(/^[0-9]{13}$/, "FCNIC must be 13 digits")
    .required("FCNIC is required"),
  Father_Husband_Name: Yup.string().required("Father_Husband_Name is required"),
  Gaurdian_Contact: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Guardian contact should be 10-11 digits")
    .required("Guardian Contact is required"),
  Gaurdian_CNIC: Yup.string()
    .matches(/^[0-9]{13}$/, "Guardian CNIC must be 13 digits")
    .required("Guardian CNIC is required"),
  Gaurdian_Occupation: Yup.string().required("Guardian Occupation is required"),
  Caste: Yup.string().required("Caste is required"),
  Province: Yup.string().required("Province is required"),
  Nationality: Yup.string().required("Nationality is required"),
  Present_Address: Yup.string().required("Present Address is required"),
  Permanent_Address: Yup.string().required("Permanent Address is required"),
  Profile_Picture: Yup.mixed()
    .required("Profile Picture is required")
    .test("fileType", "Unsupported file format", (value) =>
      ["image/jpeg", "image/png"].includes(value?.type)
    ),
  Disability: Yup.string(),
  Description: Yup.string().required("Description is required"),
  Vehicle_Make: Yup.string().required("Vehicle Make is required"),
  Vehicle_Model: Yup.string().required("Vehicle Model is required"),
  Vehicle_Type: Yup.string().required("Vehicle Type is required"),
  BCNIC: Yup.string()
    .matches(/^[0-9]{13}$/, "BCNIC must be 13 digits")
    .required("BCNIC is required"),
  Vehicle_Documents: Yup.mixed().required("Vehicle Documents are required"),
  Police_Verification_Document: Yup.mixed().required("Police Verification Document is required"),
  Appointment_Day: Yup.date().required("Appointment Day is required"),
  Appointment_Time: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Appointment Time must be in HH:MM format")
    .required("Appointment Time is required"),
});
const headers = {
  "Content-Type": "multipart/form-data", // Important for Multer
};
  const handleFinish = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      // Validate form data using Yup schema

      

      // // If validation passes, proceed with form submission logic
      response = await authAxios.post("/api/add_civData", formData,headers);
      console.log("Resposne " + response.status);
      console.log("User Data add successfully:", response.data);
      Swal.fire("Added!", "Appt Added successfully.", "success");
      // navigate("/admin/appts/appts-list");//TODO: change the path accordingly
      // Optionally clear form data
      setFormData({
        name: "",
  cnic: "",
  occupation: "",
  category: "",
  type: "",
  status: "",
  remarks: "",
  Card_Duration: "",
  Vehicle_Registration_No: "",
  Mobile_no: "",
  Home_phone_no: "",
  FCNIC: "",
  Father_Husband_Name: "",
  Gaurdian_Contact: "",
  Gaurdian_CNIC: "",
  Gaurdian_Occupation: "",
  Present_Address: "",
  Permanent_Address: "",
  Profile_Picture: null, // for file input
  Disability: "",
  Description: "",
  Vehicle_Make: "",
  Vehicle_Model: "",
  Vehicle_Type: "",
  Previous_Card_Picture: "",
  BCNIC: "",
  Vehicle_Documents: null, // for file input
  Police_Verification_Document: null, // for file input
  Appointment_Day: "",
  Appointment_Time: "",
      });
    } catch (error) {
      console.error("Validation error:", error);

      if (error.response) {
        // If there's a response
        const { status, data } = error.response;

        switch (status) {
          case 400: // Bad request
            console.error("Bad request:", data);
            Swal.fire(
              "Error: " + status,
              "Data already exists. Please check and try again.",
              "error"
            );

            break;
          case 401: // Unauthorized
            console.error("Unauthorized:", data);
            Swal.fire(
              "Error: " + status,
              "You are not authorized to perform this action.",
              "error"
            );

            break;
          case 404: // Not found
            console.error("Not found:", data);
            Swal.fire(
              "Error: " + status,
              "The requested resource was not found.",
              "error"
            );

            break;
          case 500: // Internal server error
            console.error("Internal server error:", data);
            Swal.fire(
              "Error: " + status,
              "An unexpected error occurred on the server. Please try again later.",
              "error"
            );
            break;
          default:
            console.error("Unknown error:", status, data);
            Swal.fire(
              "Error: Unkown",
              "An unknown error occurred. Please try again later.",
              "error"
            );
        }
      }
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }
      setErrors(validationErrors);

      // Create a new object to store errors
    }
  };


  const handleBack = () => {

    setActiveStep((prevActiveStep) => prevActiveStep - 1);


  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    // Use a closure to capture `field`
    reader.onload = (event) => {
      setLoading(true);
      const imageData = event.target.result;
      console.log("imageData");
      console.log(imageData);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: imageData, // Dynamically set the field key
      }));
  
      setLoading(false);
    };
  
    reader.readAsDataURL(file);
  };


  const Profile_Picture = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    // Use a closure to capture `field`
    reader.onload = (event) => {
      setLoading(true);
      const imageData = event.target.result;
      console.log("imageData");
      console.log(imageData);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        Profile_Picture: imageData, // Dynamically set the field key
      }));
     
  
      setLoading(false);
    };
    setUrlData((prevUrlData) => ({
      ...prevUrlData,
      Profile_Picture: e.target.value, // Dynamically set the field key
    }));
    reader.readAsDataURL(file);
  };

  const Previous_Card_Picture = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    // Use a closure to capture `field`
    reader.onload = (event) => {
      setLoading(true);
      const imageData = event.target.result;
      console.log("imageDataPrev");
      console.log(imageData);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        Previous_Card_Picture: imageData, // Dynamically set the field key
      }));
     
  
      setLoading(false);
    };
    setUrlData((prevUrlData) => ({
      ...prevUrlData,
      Previous_Card_Picture: e.target.value, // Dynamically set the field key
    }));
    reader.readAsDataURL(file);
  };
  
  const FCNIC = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    // Use a closure to capture `field`
    reader.onload = (event) => {
      setLoading(true);
      const imageData = event.target.result;
      console.log("imageData");
      console.log(imageData);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        FCNIC: imageData, // Dynamically set the field key
      }));
      setUrlData((prevUrlData) => ({
        ...prevUrlData,
        FCNIC: e.target.value, // Dynamically set the field key
      }));
      setLoading(false);
    };
  
    reader.readAsDataURL(file);
  };


  const BCNIC = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    // Use a closure to capture `field`
    reader.onload = (event) => {
      setLoading(true);
      const imageData = event.target.result;
      console.log("imageData");
      console.log(imageData);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        BCNIC: imageData, // Dynamically set the field key
      }));
      setUrlData((prevUrlData) => ({
        ...prevUrlData,
        BCNIC: e.target.value, // Dynamically set the field key
      }));
      setLoading(false);
    };
  
    reader.readAsDataURL(file);
  };


  const Vehicle_Documents = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    // Use a closure to capture `field`
    reader.onload = (event) => {
      setLoading(true);
      const imageData = event.target.result;
      console.log("imageData");
      console.log(imageData);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        Vehicle_Documents: imageData, // Dynamically set the field key
      }));
     
      setLoading(false);
    };
     setUrlData((prevUrlData) => ({
        ...prevUrlData,
        Vehicle_Documents: e.target.value, // Dynamically set the field key
      }));
  
    reader.readAsDataURL(file);
  };


  const Police_Verification_Document = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    // Use a closure to capture `field`
    reader.onload = (event) => {
      setLoading(true);
      const imageData = event.target.result;
      console.log("imageData");
      console.log(imageData);
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        Police_Verification_Document: imageData, // Dynamically set the field key
      }));
   
      setLoading(false);
    };
    setUrlData((prevUrlData) => ({
      ...prevUrlData,
      Police_Verification_Document: e.target.value, // Dynamically set the field key
    }));
    reader.readAsDataURL(file);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepOne formData={formData} err={errors} setFormData={setFormData}/>;
      case 1:
        return <StepTwo formData={formData} urlData={urlData}err={errors}  Profile_Picture={Profile_Picture} Previous_Card_Picture={Previous_Card_Picture} setFormData={setFormData} setUrlData={setUrlData}/>;
      case 2:
        return <StepThree formData={formData} urlData={urlData} FCNIC={FCNIC} BCNIC={BCNIC} Vehicle_Documents={Vehicle_Documents} Police_Verification_Document={Police_Verification_Document} err={errors} setUrlData={setUrlData} setFormData={setFormData}/>;
      case 3:
        return <AppointmentForm formData={formData} err={errors} setFormData={setFormData}/>;
      case 4:
        return <DocumentSubmission formData={formData} urlData={urlData} err={errors} setFormData={setFormData}/>;
      default:
        return <div>Not Found</div>;
    }
  };


  const fetchCounters = async () => {
    try {
      const response = await authAxios.get("/api/dashboard_counters");
      setCounters(response.data);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };
  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({
          functions: { rgba, linearGradient },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.6),
            rgba(gradients.info.state, 0.6)
          )}, url(${bgImage})`,
        backgroundPositionY: "50%",
      }}
    >
      <Header />
      <ArgonBox mt={1} mb={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card>
              <ArgonBox p={2}>
                <ArgonBox mb={2}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
             
                  <div>{renderStepContent(activeStep)}</div>
                  {loading?  <CircularProgress/>: <></>}
                 <div style={{ marginTop: '20px' }}>
  {/* Conditionally render Back button, but only show if not on Step One */}
  {activeStep > 0 && (
    <ArgonButton
    variant="outlined"
    color="warning"
    size="medium"
    onClick={handleBack}
  >
    Back
  </ArgonButton>
  )}

  {/* Conditionally render Next button for steps before Step Five */}
  {activeStep < steps.length - 1 ? (
    <ArgonButton
    variant="contained"
    color="info"
    size="medium"
    onClick={handleNext}
  >
    Next
  </ArgonButton>
  ) : (<ArgonButton
    variant="gradient"
    color="primary"
    size="medium"
    onClick={handleFinish}
  >
    Finish
  </ArgonButton>)}
</div>

                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                  </Grid>
                </ArgonBox>
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UserInfo;