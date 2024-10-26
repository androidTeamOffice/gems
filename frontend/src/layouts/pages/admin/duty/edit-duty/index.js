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

function EditDuty() {
  const [errors, setErrors] = useState({});
  // const [rank_id, setRankId] = useState([]);
  const [appt_id, setApptId] = useState([]);
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const location = useLocation();
  const dutyData = location.state?.dbData;

  // Define initial form data state
  const [formData, setFormData] = useState({
    id: dutyData.id,
    dutyname: dutyData.name,
    description: dutyData.description,
    cadreSpecific: {
      value: dutyData.cadre_specific,
      label: dutyData.cadre_specific === 0 ? "No" : "Yes",
    },
    locationId: {
      value: dutyData.location_id,
      label: dutyData.location_name,
    },
    // rank_id: {
    //   value: dutyData.rank_id,
    //   label: dutyData.rank_name,
    // },
    appt_id: {
      value: dutyData.appt_id,
      label: dutyData.appt_name,
    },
    duration: dutyData.duration,
    emp_req: dutyData.emp_req,
    occurance_in_day: dutyData.occurance_in_day,
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClear = (event) => {
    setFormData({
      dutyname: "",
      description: "",
      cadreSpecific: "",
      locationId: "",
      // rank_id: "",
      appt_id: "",
      duration: "",
      emp_req: "",
      occurance_in_day: "",
    });
  };
  const schema = Yup.object().shape({
    dutyname: Yup.string().required("Duty name is required"),
    description: Yup.string().required("Duty description is required"),
    cadreSpecific: Yup.object()
      .shape({
        value: Yup.string().required("TraitSpecific is required"),
      })
      .required("TraitSpecific is Required"),
    locationId: Yup.object().shape({
      value: Yup.string().required("Location is required"),
    }),
  });

  const handleChangeSelectCadreSpecific = (event) => {
    setFormData({
      ...formData,
      cadreSpecific: event,
    });
  };
  const handleChangeSelectLocation = (event) => {
    setFormData({
      ...formData,
      locationId: event,
    });
  };
  // const handleChangeSelectRankId = (event) => {
  //   setFormData({
  //     ...formData,
  //     rank_id: event,
  //   });
  // };
  const handleChangeSelectApptId = (event) => {
    setFormData({
      ...formData,
      appt_id: event,
    });
  };

  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      await schema.validate(formData, { abortEarly: false });
      const hasChanges = Object.values(formData).some(
        (value, index) => value !== dutyData[Object.keys(formData)[index]]
      );
      if (hasChanges) {
        response = await authAxios.post("/api/update_duty", formData);
        console.log("Response: " + response.status);
        console.log("Duty updated successfully:", response.data);
        Swal.fire("Updated!", "Duty updated successfully.", "success");
        handleClear();
        navigate("/admin/duty/duty-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire("Info", "No changes detected. Duty not updated.", "info");
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
              "Duty already exists. Please check and try again.",
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
  //  Handling Location from DB

  const fetchLocations = async () => {
    try {
      const response = await authAxios.get("/api/locations_list");
      // const rankResponse = await authAxios.get("/api/ranks_list");
      const apptResponse = await authAxios.get("/api/duty_appts_list");
      setApptId(apptResponse.data.duty_appts);
      setLocations(response.data.locations);
      // setRankId(rankResponse.data.ranks);
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

  // const optionsRank = rank_id.map((rank) => ({
  //   value: rank.id,
  //   label: rank.name,
  // }));
  const optionsAppts = appt_id.map((appt) => ({
    value: appt.id,
    label: appt.name,
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
                  <ArgonTypography variant="h5">Duty</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Duty Name"
                        name="dutyname"
                        value={formData.dutyname}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.dutyname}
                      />
                      {errors.dutyname && (
                        <ErrorMessage message={errors.dutyname} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Duty Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.description}
                      />
                      {errors.description && (
                        <ErrorMessage message={errors.description} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ArgonBox mb={3}>
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
                            Cadre Specific
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Trait Specific"
                          id="cadrespecific"
                          name="cadrespecific"
                          value={formData.cadreSpecific} // Access value from state
                          onChange={handleChangeSelectCadreSpecific}
                          fullWidth
                          error={!!errors.cadreSpecific}
                          defaultValue={{ value: 0, label: "No" }}
                          options={[
                            { value: 0, label: "No" },
                            { value: 1, label: "Yes" },
                          ]}
                          onInputChange={(event) => {
                            setErrors({ ...errors, cadreSpecific: undefined });
                          }}
                        />
                        {errors.cadreSpecific && (
                          <ErrorMessage message="Please select trait specific." />
                        )}
                      </ArgonBox>
                    </Grid>
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
                          id="location"
                          name="location"
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
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    {/* <Grid item xs={12} sm={6}>
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
                            Rank
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Ranks"
                          id="rank_id"
                          name="rank_id"
                          value={formData.rank_id}
                          onChange={handleChangeSelectRankId}
                          fullWidth
                          options={optionsRank}
                          error={!!errors.rank_id}
                          onInputChange={(event) => {
                            setErrors({ ...errors, rank_id: undefined });
                          }}
                        />
                        {errors.rank_id && (
                          <ErrorMessage message="Please select a Rank for the user." />
                        )}
                      </ArgonBox>
                    </Grid> */}
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
                            Appt
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Appt"
                          id="appt_id"
                          name="appt_id"
                          value={formData.appt_id}
                          onChange={handleChangeSelectApptId}
                          fullWidth
                          options={optionsAppts}
                          error={!!errors.appt_id}
                          onInputChange={(event) => {
                            setErrors({ ...errors, appt_id: undefined });
                          }}
                        />
                        {errors.appt_id && (
                          <ErrorMessage message="Please select a Appt for the duty." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Duration"
                        name="duration"
                        type="number"
                        value={formData.duration}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.duration}
                      />
                      {errors.duration && (
                        <ErrorMessage message={errors.duration} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Employees Required"
                        name="emp_req"
                        type="number"
                        value={formData.emp_req}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.emp_req}
                      />
                      {errors.emp_req && (
                        <ErrorMessage message={errors.emp_req} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Occurance in Day"
                        name="occurance_in_day"
                        type="number"
                        value={formData.occurance_in_day}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.occurance_in_day}
                      />
                      {errors.occurance_in_day && (
                        <ErrorMessage message={errors.occurance_in_day} />
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
                      Update Duty
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

export default EditDuty;
