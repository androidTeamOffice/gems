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
import ArgonDatePicker from "components/ArgonDatePicker";

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
import { EmojiEmotions } from "@mui/icons-material";

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

function EditCourse() {
  const [errors, setErrors] = useState({});
  const [for_cadre, setCadre] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const courseData = location.state?.dbData || {};

  // Define initial form data state
  const [formData, setFormData] = useState({
    id: courseData.id || "",

    for_cadre: {
      value: courseData.for_cadre,
      label: courseData.for_cadre_name,
    },
    coursename: courseData.name,
    details: courseData.details,
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClear = (event) => {
    setFormData({
      coursename: "",
      for_cadre: "",
      details: "",
    });
  };
  const schema = Yup.object().shape({
    coursename: Yup.string().required("Course Name is required"),
    details: Yup.string().required("Course Details is required"),
    for_cadre: Yup.object().shape({
      value: Yup.string().required("For Cadre is required"),
    }),
  });

  const handleChangeSelectTrade = (event) => {
    setFormData({
      ...formData,
      for_cadre: event,
    });
  };

  //  Handling LUVs  from DB
  const fetchLUVsData = async () => {
    try {
      const cadreresponse = await authAxios.get("/api/cadres_list");
      setCadre(cadreresponse.data.cadres);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  useEffect(() => {
    fetchLUVsData();
  }, []);

  const cadreoptions = for_cadre.map((trades) => ({
    value: trades.id,
    label: trades.name,
  }));
  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      await schema.validate(formData, { abortEarly: false });
      const hasChanges = Object.values(formData).some(
        (value, index) => value !== courseData[Object.keys(formData)[index]]
      );
      if (hasChanges) {
        response = await authAxios.post("/api/update_course", formData);
        console.log("Response: " + response.status);
        console.log("Course updated successfully:", response.data);
        Swal.fire("Updated!", "Course updated successfully.", "success");
        handleClear();
        navigate("/admin/course/courses-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire("Info", "No changes detected. Course not updated.", "info");
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
              "Course already exists. Please check and try again.",
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
                  <ArgonTypography variant="h5">Course</ArgonTypography>
                </ArgonBox>

                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Course Name"
                        name="coursename"
                        value={formData.coursename}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.coursename}
                      />
                      {errors.coursename && (
                        <ErrorMessage message={errors.coursename} />
                      )}
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
                            For Trait
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          style={{ overflowY: "auto" }}
                          label="For Cadre"
                          id="for_cadre"
                          name="for_cadre"
                          value={formData.for_cadre} // Access value from state
                          onChange={handleChangeSelectTrade}
                          fullWidth
                          error={!!errors.trade}
                          options={cadreoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, trade: undefined });
                          }}
                        />
                        {errors.trade && (
                          <ErrorMessage message="Please select Trade." />
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>

                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Course Details"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.details}
                      />
                      {errors.details && (
                        <ErrorMessage message={errors.details} />
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
                      Update Course
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
export default EditCourse;
