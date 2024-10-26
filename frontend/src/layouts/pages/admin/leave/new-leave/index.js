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
import Info from "./components/Info";
import ArgonInput from "components/ArgonInput";
import FormField from "./components/FormField";
import * as Yup from "yup";
// Images
const bgImage = "";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
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

function NewLeave() {
  const [errors, setErrors] = useState({});
  const [leave_type_id, setLeaveType] = useState([]);
  const [army_no, setArmyNo] = useState([]);
  const [employee_id, setEmployeeId] = useState([]);

  const navigate = useNavigate();
  // Define initial form data state
  const [formData, setFormData] = useState({
    army_no: "",
    employee_id: "",
    leave_type_id: "",
    start_date: new Date(),
    end_date: new Date(),
    loc_id: "",
    duty_id: "", 
    emp_id: "",  
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
      loc_id: "",
    });
  };
  const schema = Yup.object().shape({
    // army_no: Yup.object().shape({
    //   value: Yup.string().required("Army No is required"),
    // }),
    employee_id: Yup.object().shape({
      value: Yup.string().required("Employee No is required"),
    }),
    leave_type_id: Yup.object().shape({
      value: Yup.string().required("Course is required"),
    }),
  });

  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      // Validate form data using Yup schema
      await schema.validate(formData, { abortEarly: false });

      response = await authAxios.post("/api/add_leave", formData);
      console.log("Response " + response.status);
      console.log("Leave created successfully:", response.data);

      Swal.fire({
        title: "Added!",
        text: "Leave Added successfully.",
        icon: "success",
        html: `<p>Do you want to update the schedule for this person?</p></br/>
          <button id="auto-btn" 
            style="
              background: linear-gradient(310deg, #2152ff, #21d4fd);
              color: white;
              border: none;
              border-radius: 0.375rem;
              padding: 0.8rem 1.2rem;
              font-size: 0.875rem;
              margin-left: 10px;
              cursor: pointer;
            ">
            Automatically
          </button>
          <button id="manual-btn" 
            style="
              background: linear-gradient(310deg, #2152ff, #21d4fd);
              color: white;
              border: none;
              border-radius: 0.375rem;
              padding: 0.8rem 1.2rem;
              font-size: 0.875rem;
              margin-left: 10px;
              cursor: pointer;
            ">
            Manually
          </button>
        `,
        showConfirmButton: false, // Hides the default "OK" button
      });

      // Event listeners for Argon buttons
      document.getElementById("auto-btn").addEventListener("click", () => {
        handleAutomaticUpdate();
        console.log("Automatically button clicked");
        navigate("/admin/schedule/schedule-list");
        window.location.reload();

      });

      document.getElementById("manual-btn").addEventListener("click", () => {
        console.log("Manually button clicked");
        highlightLeaveRows();
        navigate("/admin/schedule/schedule-list");

      });
      navigate("/admin/leave/leave-list");

      // Optionally clear form data
      handleClear();
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
              "Error: Unknown",
              "An unknown error occurred. Please try again later.",
              "error"
            );
            console.log(formData);
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


  const handleAutomaticUpdate = async () => {
    try {
      const {emp_id } = formData;
  
      if (!emp_id) {
        Swal.fire({
          title: "Error",
          text: "duty_id and emp_id are required to reschedule.",
          icon: "error",
        });
        return;
      }
      const response = await authAxios.post("/api/re_schedule", { emp_id });
      console.log("Test")
      if (response.status === 200) {
        Swal.fire({
          title: "Updated!",
          text: "The schedule has been updated automatically.",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update the schedule. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error while re-scheduling:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the schedule. Please try again later.",
        icon: "error",
      });
    }
  };
  

  


  const highlightRowByDate = (date) => {
    const formattedDate = formatDate(date); // Ensure this matches the table date format
    console.log("Attempting to highlight row for date:", formattedDate);
  
    const rows = document.querySelectorAll('table tbody tr'); // Adjust selector as needed
    let rowFound = false;
  
    rows.forEach(row => {
      const cell = row.querySelector('td.date'); // Adjust cell selector to match your table
      if (cell && cell.textContent.trim() === formattedDate) {
        // Apply inline styles for highlighting
        row.style.backgroundColor = '#f8d7da'; // Light red background color
        row.style.border = '1px solid #f5c6cb'; // Light red border
        row.style.color = '#721c24'; // Dark red text color for better contrast
        row.style.fontWeight = 'bold'; // Bold text for emphasis
        rowFound = true;
      }
    });
  
    if (!rowFound) {
      console.warn("No row found for date:", formattedDate);
    }
  };


  
  const formatDate = (date) => {
    return date; 
  };




  const highlightLeaveRows = async () => {
    const { emp_id } = formData;
    try {
      const response = await authAxios.post('/api/manual_schedule', { emp_id });
  
      if (response.data && response.data.highlightRows) {
        const { highlightRows } = response.data;
  
        highlightRows.flat().forEach(date => {
          console.log("Row Data:", date); // Log the date directly
          if (isValidDate(date)) {
            highlightRowByDate(date);
          } else {
            Swal.fire({
              title: "Error",
              text: `Invalid date in row data: ${date}`,
              icon: "error",
            });
          }
        });
  
        // Show success alert if no errors occurred
        Swal.fire({
          title: "Success!",
          text: "The leave rows have been highlighted.",
          icon: "success",
        });
  
      } else {
        Swal.fire({
          title: "Error",
          text: "Unexpected API response structure.",
          icon: "error",
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: "API Error",
          text: `API responded with an error: ${error.response.status} - ${error.response.data}`,
          icon: "error",
        });
      } else if (error.request) {
        Swal.fire({
          title: "Network Error",
          text: "No response received from API.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: `Error setting up API request: ${error.message}`,
          icon: "error",
        });
      }
    }
  };
  
  

  
  // Simple date validation function
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    return regex.test(dateString);
  };
  


  const handleChangeSelectLeave = (event) => {
    setFormData({
      ...formData,
      leave_type_id: event,
    });
  };

  const handleChangeSelectEmployee = (event) => {
    const selectedEmployee = employee_id.find(
      (employee) => employee.id === event.value
    );
    if (selectedEmployee) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        employee_id: event,
        loc_id: selectedEmployee.loc_id,
        emp_id: selectedEmployee.id, 
        duty_id: selectedEmployee.duty_id || "", // Ensure duty_id is set
      }));
    }
  };

  

  const handleChangeSelectArmyNo = (event) => {
    setFormData({
      ...formData,
      army_no: event,
    });
  };

  //  Handling LUVs  from DB
  const fetchLUVsData = async () => {
    try {
      const leavetypeeresponse = await authAxios.get("/api/leavetypes_list");
      const armynoresponse = await authAxios.get("/api/bio_data_list");
      const employeeidresponse = await authAxios.get("/api/employees");

      setArmyNo(armynoresponse.data.bioData);
      setLeaveType(leavetypeeresponse.data.leavetypes);
      setEmployeeId(employeeidresponse.data.employees);
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
                          label="Leave Type"
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

                <ArgonBox>
                  <ArgonBox mt={3} mb={3} display="flex">
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      size="medium"
                      onClick={handleSubmit}
                    >
                      Create Leave
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
export default NewLeave;
