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
import moment from "moment";

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

function EditLeave() {
  const [errors, setErrors] = useState({});
  const [leave_type_id, setLeaveType] = useState([]);
  const [employee_id, setEmployeeId] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const leaveData = location.state?.dbData || {};

  const [formData, setFormData] = useState({
    id: leaveData.id || "", 
    start_date: leaveData.start_date || "",
    end_date: leaveData.end_date || "", 
    loc_id: leaveData.loc_id || "",
    employee_id: {
      value: leaveData.employee_id || "", 
      label:
        leaveData.army_no && leaveData.rank_name && leaveData.cadre_name && leaveData.employee_name
          ? `${leaveData.army_no} ${leaveData.rank_name} - ${leaveData.cadre_name} ${leaveData.employee_name}`
          : "Select Employee",
    },
    leave_type_id: {
      value: leaveData.leave_type_id || "",
      label: leaveData.leave_type_name || "Select Leave Type", 
    },
    availDate: new Date(),
  });


  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClear = (event) => {
    setFormData({
      army_no: "",
      employee_id: "",
      leave_type_id: "",
      start_date: "",
      end_date: "",
      availDate: "",
      loc_id: "",
    });
  };
  const schema = Yup.object().shape({
    employee_id: Yup.object().shape({
      value: Yup.string().required("Employee No is required"),
    }),
    leave_type_id: Yup.object().shape({
      value: Yup.string().required("Course is required"),
    }),
  });

  const handleChangeSelectLeave = (event) => {
    setFormData({
      ...formData,
      leave_type_id: event,
    });
  };

  const handleChangeSelectEmployee = (event) => {
    let selectedEmployee = "";
    selectedEmployee = employee_id.find(
      (employee) => employee.id === event.value
    );
    if (selectedEmployee) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        employee_id: event,
        loc_id: selectedEmployee.loc_id,
      }));
    }
  };
  const fetchLUVsData = async () => {
    try {
      const leavetypeeresponse = await authAxios.get("/api/leavetypes_list");
      const employeeidresponse = await authAxios.get("/api/employees");
      setLeaveType(leavetypeeresponse.data.leavetypes);
      setEmployeeId(employeeidresponse.data.employees);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  useEffect(() => {
    fetchLUVsData();
  }, []);

  const courseoptions = leave_type_id.map((leavetype) => ({
    value: leavetype.id,
    label: leavetype.name,
  }));
  const employeeoptions = employee_id.map((employee) => ({
    value: employee.id,
    label:
      employee.Army_No +
      " " +
      employee.rank_name +
      " - " +
      employee.cadre_name +
      " " +
      employee.name,
  }));
  const handleDateChange = (dateString, field) => {
    console.log("Date" + dateString);
    if (!dateString) {
      setFormData({
        ...formData,
        [field]: dateString, // Set directly without processing
      });
      return;
    }
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
        (value, index) => value !== leaveData[Object.keys(formData)[index]]
      );
      if (hasChanges) {
        response = await authAxios.post("/api/update_leave", formData);
        console.log("Response: " + response.status);
        console.log("Leave updated successfully:", response.data);
        Swal.fire("Updated!", "Leave updated successfully.", "success");
        handleClear();
        navigate("/admin/leave/leave-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire("Info", "No changes detected. Leave not updated.", "info");
      }
    } catch (error) {
      console.error("Validation error:", error.message);

      if (error.response) {
        // If there's a response
        const { status, data } = error.response;

        switch (status) {
          case 400: // Bad request
            console.error("Bad request:", data);
            Swal.fire(
              "Error: " + status,
              "Leave already exists. Please check and try again.",
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
                  <ArgonTypography variant="h5">Leave</ArgonTypography>
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
                            Employee
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Course"
                          id="leave_type_id"
                          name="leave_type_id"
                          value={formData.employee_id} // Access value from state
                          onChange={handleChangeSelectEmployee}
                          fullWidth
                          error={!!errors.employee_id}
                          options={employeeoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, employee_id: undefined });
                          }}
                        />
                        {errors.employee_id && (
                          <ErrorMessage message="Please select Employee." />
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
                            Leave Type
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Course"
                          id="leave_type_id"
                          name="leave_type_id"
                          value={formData.leave_type_id} // Access value from state
                          onChange={handleChangeSelectLeave}
                          fullWidth
                          error={!!errors.leave_type_id}
                          options={courseoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, leave_type_id: undefined });
                          }}
                        />
                        {errors.leave_type_id && (
                          <ErrorMessage message="Please select Course." />
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
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
                            Start Date
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.start_date}
                          name="start_date"
                          onChange={(date) =>
                            handleDateChange(date, "start_date")
                          }
                        />
                        {errors.start_date && (
                          <ErrorMessage message={errors.start_date} />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                            End Date
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.end_date}
                          name="end_date"
                          onChange={(date) =>
                            handleDateChange(date, "end_date")
                          }
                        />
                        {errors.end_date && (
                          <ErrorMessage message={errors.end_date} />
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
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
                            Avail Date
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.availDate}
                          name="availDate"
                          onChange={(date) =>
                            handleDateChange(date, "availDate")
                          }
                        />
                        {errors.availDate && (
                          <ErrorMessage message={errors.availDate} />
                        )}
                      </ArgonBox>
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
                      Update Leave
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
export default EditLeave;
