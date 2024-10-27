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

function EditCourseCompletion() {
  const [errors, setErrors] = useState({});
  const [course_id, setCourses] = useState([]);
  const [army_no, setArmyNo] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const courseCompletionData = location.state?.dbData || "";

  // Define initial form data state
  const [formData, setFormData] = useState({
    id: courseCompletionData.id || "",
    course_serial: courseCompletionData.course_serial,
    course_from: new Date(courseCompletionData.course_from),
    course_to: new Date(courseCompletionData.course_to),
    institution: courseCompletionData.institution,

    remarks: courseCompletionData.remarks,
    grade: courseCompletionData.grade,
    army_no: {
      value: courseCompletionData.army_no,
      label: courseCompletionData.army_no,
    },
    course_status: {
      label:
        courseCompletionData.course_status === "Completed"
          ? "Completed"
          : courseCompletionData.course_status === "InProgess"
          ? "InProgress"
          : courseCompletionData.course_status === "Cancled"
          ? "Cancled"
          : "Dropped",
    },
    course_id: {
      value: courseCompletionData.course_id,
      label: courseCompletionData.course_name,
    },
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClear = (event) => {
    setFormData({
      army_no: "",
      course_id: "",
      course_serial: "",
      course_from: new Date(),
      course_to: new Date(),
      institution: "",
      course_status: "",
      remarks: "",
      grade: "",
    });
  };
  const schema = Yup.object().shape({
    course_serial: Yup.string().required("Course Ser is required"),
    institution: Yup.string().required("Course To is required"),
    army_no: Yup.object().shape({
      value: Yup.string().required("Army No is required"),
    }),
    course_status: Yup.object().shape({
      value: Yup.string().required("Course Status is required"),
    }),
    course_id: Yup.object().shape({
      value: Yup.string().required("Course is required"),
    }),
  });

  const handleChangeSelectCourse = (event) => {
    setFormData({
      ...formData,
      course_id: event,
    });
  };

  const handleChangeSelectArmyNo = (event) => {
    setFormData({
      ...formData,
      army_no: event,
    });
  };
  const handleChangeSelectCourseStatus = (event) => {
    setFormData({
      ...formData,
      course_status: event,
    });
  };
  const fetchLUVsData = async () => {
    try {
      const courseresponse = await authAxios.get("/api/courses_list");
      const armynoresponse = await authAxios.get("/api/bio_data_list");
      setArmyNo(armynoresponse.data.bioData);
      setCourses(courseresponse.data.courses);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  useEffect(() => {
    fetchLUVsData();
  }, []);

  const armynooptions = army_no.map((armyno) => ({
    value: armyno.Army_No,
    label: armyno.Army_No,
  }));

  const courseoptions = course_id.map((course) => ({
    value: course.id,
    label: course.name,
  }));

  const handleDateChange = (dateString, field) => {
    console.log("Date" + dateString);
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      // Handle invalid date
      console.error("Invalid date:", dateString);
      return;
    }
    // Adjust the date to account for time zone offset
    const offset = date.getTimezoneOffset(); // Get the time zone offset in minutes
    date.setMinutes(date.getMinutes() - offset); // Subtract the offset from the date

    const formattedDate = date.toISOString().split("T")[0];
    console.log("Formatted Date" + formattedDate);
    setFormData({
      ...formData,
      [field]: formattedDate,
    });
  };

  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      await schema.validate(formData, { abortEarly: false });
      const hasChanges = Object.values(formData).some(
        (value, index) =>
          value !== courseCompletionData[Object.keys(formData)[index]]
      );
      if (hasChanges) {
        response = await authAxios.post(
          "/api/update_course_completion",
          formData
        );
        console.log("Response: " + response.status);
        console.log("Course Completion updated successfully:", response.data);
        Swal.fire(
          "Updated!",
          "Course Completion updated successfully.",
          "success"
        );
        handleClear();
        navigate("/admin/coursecompletion/coursecompletion-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire(
          "Info",
          "No changes detected. Course Completion not updated.",
          "info"
        );
      }
    } catch (error) {
      Swal.fire("Error: ", error.message, "error");

      if (error.response) {
        // If there's a response
        const { status, data } = error.response;

        switch (status) {
          case 400: // Bad request
            console.error("Bad request:", data);
            Swal.fire(
              "Error: " + status,
              "Course Completion already exists. Please check and try again.",
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
                  <ArgonTypography variant="h5">
                    Course Completion
                  </ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
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
                          id="army_no"
                          name="army_no"
                          value={formData.army_no}
                          onChange={handleChangeSelectArmyNo}
                          fullWidth
                          options={armynooptions}
                          error={!!errors.army_no}
                          onInputChange={(event) => {
                            setErrors({ ...errors, army_no: undefined });
                          }}
                        />
                        {errors.army_no && (
                          <ErrorMessage message="Please select ArmyNo." />
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
                            Course
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Course"
                          id="course_id"
                          name="course_id"
                          value={formData.course_id} // Access value from state
                          onChange={handleChangeSelectCourse}
                          fullWidth
                          error={!!errors.course_id}
                          options={courseoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, course_id: undefined });
                          }}
                        />
                        {errors.course_id && (
                          <ErrorMessage message="Please select Course." />
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Course Serial"
                        name="course_serial"
                        value={formData.course_serial}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.course_serial}
                      />
                      {errors.course_serial && (
                        <ErrorMessage message={errors.course_serial} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                      >
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          mt={1}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                          >
                            Course From
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.course_from}
                          name="course_from"
                          onChange={(date) =>
                            handleDateChange(date, "course_from")
                          }
                        />
                        {errors.course_from && (
                          <ErrorMessage message={errors.course_from} />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                      >
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          mt={1}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                          >
                            Course To
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.course_to}
                          name="course_to"
                          onChange={(date) =>
                            handleDateChange(date, "course_to")
                          }
                        />
                        {errors.course_to && (
                          <ErrorMessage message={errors.course_to} />
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.institution}
                      />
                      {errors.institution && (
                        <ErrorMessage message={errors.institution} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.remarks}
                      />
                      {errors.remarks && (
                        <ErrorMessage message={errors.remarks} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
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
                            Course Status
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Course Status"
                          id="course_status"
                          name="course_status"
                          value={formData.course_status} // Access value from state
                          onChange={handleChangeSelectCourseStatus}
                          fullWidth
                          error={!!errors.course_status}
                          options={[
                            { value: "Completed", label: "Completed" },
                            { value: "InProgess", label: "InProgess" },
                            {
                              value: "Result Awaited",
                              label: "Result Awaited",
                            },
                            { value: "Cancled", label: "Cancled" },
                            { value: "Dropped", label: "Dropped" },
                          ]}
                          onInputChange={(event) => {
                            setErrors({
                              ...errors,
                              course_status: undefined,
                            });
                          }}
                        />
                        {errors.course_status && (
                          <ErrorMessage message="Please select Course Status." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {formData.course_status.value === "Completed" && (
                        <>
                          <FormField
                            label="Grade"
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.grade}
                          />
                          {errors.grade && (
                            <ErrorMessage message={errors.grade} />
                          )}
                        </>
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox>
                  <ArgonBox mt={3} mb={3} display="flex">
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      size="medium"
                      onClick={handleSubmit}
                    >
                      Update Course Completion
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
export default EditCourseCompletion;
