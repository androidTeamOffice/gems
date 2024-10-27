import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonSelect from "components/ArgonSelect";
import ArgonTypography from "components/ArgonTypography";
import ArgonAlert from "components/ArgonAlert";

// Argon Dashboard 2 PRO MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

// NewProduct page components
import Header from "./components/Header";

import ArgonInput from "components/ArgonInput";
import FormField from "./components/FormField";
import * as Yup from "yup";
// Images
const bgImage = "";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

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

function EditBattery() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [locations, setLocations] = useState([]);
  const batteryData = location.state?.dbData;

  // Define initial form data state
  const [formData, setFormData] = useState({
    id: batteryData ? batteryData.id : "",
    batteryname: batteryData ? batteryData.name : "",
    capacity: batteryData ? batteryData.capacity : "",
    locationId: batteryData
      ? {
          value: batteryData.loc_id,
          label: batteryData.loc_name,
        }
      : {
          value: "",
          label: "",
        },
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClear = (event) => {
    setFormData({
      id:"",
      batteryname: "",
      capacity: "",
      locationId: "",
    });
  };
  const schema = Yup.object().shape({
    batteryname: Yup.string().required("Battery name is required"),
    capacity: Yup.string().required("Battery capacity is required"),
    locationId: Yup.object().shape({
      value: Yup.string().required("Location is required"),
    }),
  });

  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
  
    // Check if batteryData is available
    if (!batteryData) {
      console.error("No battery data available.");
      Swal.fire("Error", "No battery data available. Please try again later.", "error");
      return;
    }
  
    try {
      // Validate form data using Yup schema
      await schema.validate(formData, { abortEarly: false });
  
      // Check if there are changes in the form data
      const hasChanges = Object.keys(formData).some((key) => {
        // Ensure batteryData[key] is defined before comparing
        return formData[key] !== (batteryData[key] !== undefined ? batteryData[key] : null);
      });
  
      if (hasChanges) {
        response = await authAxios.post("/api/update_battery", formData);
        console.log("Response: " + response.data);
        console.log("Battery updated successfully:", response.data);
        Swal.fire("Updated!", "Battery updated successfully.", "success");
        handleClear();
        navigate("/admin/batteries/batteries-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire("Info", "No changes detected. Battery not updated.", "info");
      }
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
              "Battery already exists. Please check and try again.",
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
              "Error: Unknown",
              "An unknown error occurred. Please try again later.",
              "error"
            );
        }
      }
  
      // Handle Yup validation errors
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }
      setErrors(validationErrors);
    }
  };
  
  const handleChangeSelectLocation = (event) => {
    setFormData({
      ...formData,
      locationId: event,
    });
  };
  //  Handling Location from DB
  const fetchLocations = async () => {
    try {
      const response = await authAxios.get("/api/locations_list");
      setLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const options = locations.map((location) => ({
    value: location.id,
    label: location.name,
  }));
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

      <ArgonBox mt={1} mb={20}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <ArgonBox p={2}>
                <ArgonBox mb={2}>
                  <ArgonTypography variant="h5">Battery</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Battery Name"
                        name="batteryname"
                        value={formData.batteryname}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.batteryname}
                      />
                      {errors.batteryname && (
                        <ErrorMessage message={errors.batteryname} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Battery Capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.capacity}
                      />
                      {errors.capacity && (
                        <ErrorMessage message={errors.capacity} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ArgonBox mb={1}>
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            Location
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Location"
                          id="locationId"
                          name="locationId"
                          value={formData.locationId}
                          onChange={handleChangeSelectLocation}
                          fullWidth
                          options={options}
                          error={!!errors.locationId}
                          onInputChange={(event) => {
                            setErrors({ ...errors, status: undefined });
                          }}
                        />
                        {errors.status && (
                          <ErrorMessage message="Please select a Status for the user." />
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox>
                  <ArgonBox mt={3} display="flex">
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      size="medium"
                      onClick={handleSubmit}
                    >
                      Update Battery
                    </ArgonButton>
                    <ArgonButton
                      variant="gradient"
                      color="info"
                      size="medium"
                      style={{ marginLeft: "10px" }}
                      onClick={handleClear}
                    >
                      Clear
                    </ArgonButton>
                  </ArgonBox>
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
export default EditBattery;