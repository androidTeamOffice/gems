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
import { TimePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Plugin for UTC functions
import timezone from "dayjs/plugin/timezone"; // Plugin for timezone support

dayjs.extend(utc); // Extend dayjs with UTC plugin
dayjs.extend(timezone); // Extend dayjs with timezone plugin

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

function EditSchedule() {
  const [errors, setErrors] = useState({});
  const [duty_id, setDutyId] = useState([]);
  //const [army_no, setArmyNo] = useState([]);
  const [employee_id, setEmployeeId] = useState([]);
  const navigate = useNavigate();
  const [start_time, setStartTime] = useState(null);
  const [end_time, setEndTime] = useState(null);

  const location = useLocation();
  const scheduleData = location.state?.dbData || {};

  const [formData, setFormData] = useState({
    id: scheduleData.id || "", 
    date: scheduleData.date || "",
    end_date: scheduleData.end_date || "",
    start_time: "",
    end_time: "",
    employee_id: {
      value: scheduleData.employee_id || "", 
      label:
        scheduleData.army_no && scheduleData.rank_name && scheduleData.cadre_name && scheduleData.employee_name
          ? `${scheduleData.army_no} ${scheduleData.rank_name} - ${scheduleData.cadre_name} ${scheduleData.employee_name}`
          : "Select Employee", 
    },
    duty_id: {
      value: scheduleData.duty_id || "", 
      label: scheduleData.duty_name || "Select Duty Location", 
    },
  });

  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClear = (event) => {
    setFormData({
      // army_no: "",
      employee_id: "",
      duty_id: "",
      date: "",
      end_date: "",
      start_time: "",
      end_time: "",
    });
  };
  const schema = Yup.object().shape({
    // army_no: Yup.object().shape({
    //   value: Yup.string().required("Army No is required"),
    // }),
    employee_id: Yup.object().shape({
      value: Yup.string().required("Employee No is required"),
    }),
    duty_id: Yup.object().shape({
      value: Yup.string().required("Duty is required"),
    }),
  });

  const handleChangeSelectSchedule = (event) => {
    setFormData({
      ...formData,
      duty_id: event,
    });
  };

  const handleChangeSelectEmployee = (event) => {
    setFormData({
      ...formData,
      employee_id: event,
    });
  };

  // const handleChangeSelectArmyNo = (event) => {
  //   setFormData({
  //     ...formData,
  //     army_no: event,
  //   });
  // };
  const fetchLUVsData = async () => {
    try {
      const dutyresponse = await authAxios.get("/api/dutys_list");
      //const armynoresponse = await authAxios.get("/api/bio_data_list");
      const employeeidresponse = await authAxios.get("/api/employees");

      //setArmyNo(armynoresponse.data.bioData);
      setDutyId(dutyresponse.data.dutys);
      setEmployeeId(employeeidresponse.data.employees);
    } catch (error) {
      console.error("Error fetching Data:", error);
    }
  };

  useEffect(() => {
    fetchLUVsData();
  }, []);

  // const armynooptions = army_no.map((armyno) => ({
  //   value: armyno.Army_No,
  //   label: armyno.Army_No,
  // }));

  const dutyoptions = duty_id.map((duty) => ({
    value: duty.id,
    label: duty.name,
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
  const handleTimeChange = (time, field) => {
    const timezone = "Asia/Karachi";
    const formattedTime = dayjs(time).tz(timezone).format();
    console.log("ISO Time with Timezone: " + formattedTime);
    setFormData({ ...formData, [field]: formattedTime });
  };
  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      await schema.validate(formData, { abortEarly: false });
      const hasChanges = Object.values(formData).some(
        (value, index) => value !== scheduleData[Object.keys(formData)[index]]
      );
      if (hasChanges) {
        response = await authAxios.post("/api/update_schedule", formData);
        console.log("Response: " + response.status);
        console.log("Schedule updated successfully:", response.data);
        Swal.fire("Updated!", "Schedule updated successfully.", "success");
        handleClear();
        navigate("/admin/schedule/schedule-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire("Info", "No changes detected. Schedule not updated.", "info");
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
              "Schedule already exists. Please check and try again.",
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
                  <ArgonTypography variant="h5">Schedule</ArgonTypography>
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
                          label="Employee"
                          id="duty_id"
                          name="duty_id"
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
                            Duty Location
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Duty Location"
                          id="duty_id"
                          name="duty_id"
                          value={formData.duty_id} // Access value from state
                          onChange={handleChangeSelectSchedule}
                          fullWidth
                          error={!!errors.duty_id}
                          options={dutyoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, duty_id: undefined });
                          }}
                        />
                        {errors.duty_id && (
                          <ErrorMessage message="Please select Duty Location." />
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
                            Date
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.date}
                          onChange={(date) => handleDateChange(date, "date")}
                        />
                        {errors.date && <ErrorMessage message={errors.date} />}
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
                            Start Time
                          </ArgonTypography>
                        </ArgonBox>
                        <TimePicker
                          label="Start time"
                          value={start_time}
                          onChange={(time) => {
                            setStartTime(time);
                            handleTimeChange(time, "start_time");
                          }}
                        />
                        {errors.start_time && (
                          <ErrorMessage message={errors.start_time} />
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
                            End Time
                          </ArgonTypography>
                        </ArgonBox>
                        <TimePicker
                          label="End time"
                          value={end_time}
                          onChange={(time) => {
                            setEndTime(time);
                            handleTimeChange(time, "end_time");
                          }}
                        />
                        {errors.end_time && (
                          <ErrorMessage message={errors.end_time} />
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
                      Update Schedule
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
export default EditSchedule;
