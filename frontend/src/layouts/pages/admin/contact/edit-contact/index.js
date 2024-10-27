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

function EditContact() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [armyNo, setArmyNo] = useState([]);
  const location = useLocation();
  const contactData = location.state?.dbData || {}; 

// Define initial form data state
const [formData, setFormData] = useState({
  armyNo: {
    value: contactData.soldier_id || "",

    label:
      (contactData.soldier_id ? contactData.soldier_id + " " : "") + // Concatenate only if soldier_id is defined
      (contactData.rank_name ? contactData.rank_name + " - " : "") + // Concatenate only if rank_name is defined
      (contactData.cadre_name ? contactData.cadre_name + " " : "") + // Concatenate only if cadre_name is defined
      (contactData.name || ""), 
  },
  village: contactData.Vill || "",
  PO: contactData.P_O || "", 
  Teh: contactData.Teh || "", 
  Dist: contactData.Dist || "", //
  contactNo: contactData.Contact_No || "",
});

  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClear = (event) => {
    setFormData({
      armyNo: "",
      village: "",
      PO: "",
      Teh: "",
      Dist: "",
      contactNo: "",
    });
  };
  const schema = Yup.object().shape({
    village: Yup.string().required("Village name is required"),
    PO: Yup.string().required("Post Office is required"),
    Teh: Yup.string().required("Tehsil is required"),
    Dist: Yup.string().required("District is required"),
    contactNo: Yup.string().required("Contact No is required"),
    armyNo: Yup.object().shape({
      value: Yup.string().required("Army No is required"),
    }),
  });

  const handleChangeSelectArmyNo = (event) => {
    setFormData({
      ...formData,
      armyNo: event,
    });
  };
  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      await schema.validate(formData, { abortEarly: false });
      const hasChanges = Object.values(formData).some(
        (value, index) => value !== contactData[Object.keys(formData)[index]]
      );
      if (hasChanges) {
        response = await authAxios.post(
          "/api/update_contact_address",
          formData
        );
        console.log("Response: " + response.status);
        console.log("Contact updated successfully:", response.data);
        Swal.fire("Updated!", "Contact updated successfully.", "success");
        handleClear();
        navigate("/admin/contact/contact-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire("Info", "No changes detected. Contact not updated.", "info");
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
              "Contact already exists. Please check and try again.",
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
    }
  };
  //  Handling Location from DB
  const fetchArmyNo = async () => {
    try {
      const response = await authAxios.get("/api/bio_data_list");
      setArmyNo(response.data.bioData);
    } catch (error) {
      console.error("Error fetching armyNo:", error);
    }
  };

  useEffect(() => {
    fetchArmyNo();
  }, []);

  const options = armyNo.map((armyno) => ({
    value: armyno.Army_No,
    label:
      armyno.Army_No +
      " " +
      armyno.rank +
      " - " +
      armyno.Trade +
      " " +
      armyno.Name,
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
                  <ArgonTypography variant="h5">
                    Contact Addresses
                  </ArgonTypography>
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
                            Army No
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Army No"
                          id="armyNo"
                          name="armyNo"
                          value={formData.armyNo}
                          onChange={handleChangeSelectArmyNo}
                          fullWidth
                          options={options}
                          error={!!errors.armyNo}
                          onInputChange={(event) => {
                            setErrors({ ...errors, armyNo: undefined });
                          }}
                        />
                        {errors.armyNo && (
                          <ErrorMessage message="Please select ArmyNo." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Village"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.village}
                      />
                      {errors.village && (
                        <ErrorMessage message={errors.village} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Post Office"
                        name="PO"
                        value={formData.PO}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.PO}
                      />
                      {errors.PO && <ErrorMessage message={errors.PO} />}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Tehsil"
                        name="Teh"
                        value={formData.Teh}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.Teh}
                      />
                      {errors.Teh && <ErrorMessage message={errors.Teh} />}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="District"
                        name="Dist"
                        value={formData.Dist}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.Dist}
                      />
                      {errors.Dist && <ErrorMessage message={errors.Dist} />}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="contactNo"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.contactNo}
                      />
                      {errors.contactNo && (
                        <ErrorMessage message={errors.contactNo} />
                      )}
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
                      Update Contact Address
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
export default EditContact;
