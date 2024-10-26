import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";
import DataTable from "examples/Tables/DataTable";

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
import { Box, FormControl, Input, InputLabel, Stack } from "@mui/material";
import ArgonDropzone from "components/ArgonDropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { duration } from "moment";
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

function LeaveReport() {
  const [errors, setErrors] = useState({});
  const [btys, setBtyIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Army No, Rank and Name", accessor: "armyNo" },
      { Header: "Bty", accessor: "bty" },
      { Header: "Location", accessor: "location" },
      { Header: "District", accessor: "district" },
      { Header: "Lve Circle", accessor: "circle" },
      { Header: "Distance", accessor: "distance" },
      { Header: "Lve Gt", accessor: "leaveGt" },
      { Header: "Last Leave", accessor: "lastLeave" },
      { Header: "Duration", accessor: "duration" },
      { Header: "Total Days", accessor: "totalDays" },
      { Header: "Remarks", accessor: "remarks" },
    ],
    rows: [], // Initially empty array
  });

  const navigate = useNavigate();
  // Define initial form data state
  const [formData, setFormData] = useState({
    start_date: new Date(),
    end_date: new Date(),
    bty_id: "",
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClear = (event) => {
    setFormData({
      start_date: "",
      end_date: "",
      bty_id: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await authAxios.post("/api/search_lve_report", formData);
      console.log(response);
      const formattedData = response.data.leaveReport.flatMap((item, index) => {
        // Split leaveDetails by "), (" to separate individual leave details
        let leaveDetailsArray = [];
        if (item.leaveDetails) {
          leaveDetailsArray = item.leaveDetails.split("), (");
        }
        // Define basic details for the whole item outside the map function
        const basicDetails = {
          ser: index + 1,
          armyNo: `${item.Army_No} ${item.rankName} ${item.indlName}`,
          bty: item.btyName,
          location: item.locName,
          district: item.District,
          circle: item.LveCircle,
          distance: item.Distance,
          leaveGt: item.LveGrant,
          lastLeave: new Date(item.lastLve).toLocaleDateString(),
          duration: item.duration,
        };

        // Calculate total days for the item
        const totalDays = leaveDetailsArray.reduce((acc, leaveDetail) => {
          // Clean up parentheses and split by comma to extract details
          leaveDetail = leaveDetail.replace("(", "").replace(")", "");
          const detailParts = leaveDetail.split(",");

          // Check if detailParts has exactly 5 parts
          if (detailParts.length !== 5) {
            console.error(`Invalid format for leave detail: ${leaveDetail}`);
            return acc;
          }

          const [, , , , days] = detailParts.map((part) => part.trim());

          // Convert days to number and add to accumulator
          return acc + parseInt(days, 10);
        }, 0);

        // Return basic details along with total days
        return {
          ...basicDetails,
          totalDays: totalDays,
        };
      });

      setData(response.data.leaveReport);
      setDataTableData({
        ...dataTableData,
        rows: formattedData,
      });
      setLoading(false);
      handleClear();
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
              "Bio Data already exists. Please check and try again.",
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

  const handleChangeSelectBattery = (event) => {
    setFormData({
      ...formData,
      bty_id: event,
    });
  };

  const fetchLUVsData = async () => {
    try {
      const btysresponse = await authAxios.get("/api/batteries_list");
      setBtyIds(btysresponse.data.batterys);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  useEffect(() => {
    fetchLUVsData();
  }, []);

  const btysoptions = btys.map((bty) => ({
    value: bty.id,
    label: bty.name,
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
  const exportToExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Extracting required properties from each object in the data array
    const extractedData = data.flatMap((item, index) => {
      // Parse leave details for each item
      const leaveDetailsArray = item.leaveDetails.split(", ");

      // Calculate total days for the item
      const totalDays = leaveDetailsArray.reduce((acc, leaveDetail) => {
        // Clean up parentheses and split by comma to extract details
        leaveDetail = leaveDetail.replace("(", "").replace(")", "");
        const detailParts = leaveDetail.split(",");

        // Check if detailParts has exactly 5 parts
        if (detailParts.length !== 5) {
          console.error(`Invalid format for leave detail: ${leaveDetail}`);
          return acc;
        }

        const [, , , , days] = detailParts.map((part) => part.trim());

        // Convert days to number and add to accumulator
        return acc + parseInt(days, 10);
      }, 0);

      // Create basic details row for the first item only
      const basicDetails = {
        Ser: index + 1,
        "ArmyNo, Rank and Name": `${item.Army_No} ${item.rankName} ${item.indlName}`,
        Bty: item.btyName,
        "Current Location": item.locName,
        District: item.District,
        "Lve Circle": item.LveCircle,
        Distance: item.Distance,
        "Leave Gt": item.LveGrant,
        "Last Leave": new Date(item.lastLve).toLocaleDateString(),
        Duration: item.duration,
        TotalDays: totalDays, // Include total days for all rows
      };

      // Parse and add leave details rows
      const leaveRows = leaveDetailsArray.map((leaveDetail, leaveIndex) => {
        // Clean up parentheses and split by comma to extract details
        leaveDetail = leaveDetail.replace("(", "").replace(")", "");
        const detailParts = leaveDetail.split(",");

        // Check if detailParts has exactly 5 parts
        if (detailParts.length !== 5) {
          console.error(`Invalid format for leave detail: ${leaveDetail}`);
          return null;
        }

        const [leaveType, location, startDate, endDate, days] = detailParts.map(
          (part) => part.trim()
        );

        if (leaveIndex === 0) {
          // For the first leave detail, include basic details
          return {
            ...basicDetails,
            LeaveType: leaveType.trim(),
            Location: location.trim(),
            From: new Date(startDate).toLocaleDateString(),
            To: new Date(endDate).toLocaleDateString(),
            Days: days.trim(),
          };
        } else {
          // For subsequent leave details, include only leave-specific details
          return {
            LeaveType: leaveType.trim(),
            Location: location.trim(),
            From: new Date(startDate).toLocaleDateString(),
            To: new Date(endDate).toLocaleDateString(),
            Days: days.trim(),
          };
        }
      });

      // Return the merged basic details and leave rows
      return leaveRows;
    });

    // Convert the extractedData to worksheet format
    const worksheet = XLSX.utils.json_to_sheet(extractedData);

    // Define header cell styles
    const headerCellStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } }, // White text
      fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "2F75B5" } }, // Blue background
    };

    // Apply style to header cells
    Object.keys(worksheet)
      .filter((key) => key.startsWith("A1"))
      .forEach((key) => {
        worksheet[key].s = headerCellStyle; // Apply style to each cell in the header row
      });

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate a binary string for the workbook
    const workbookBinary = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    });

    // Convert the binary string to a Blob object
    const blob = new Blob([s2ab(workbookBinary)], {
      type: "application/octet-stream",
    });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
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
                  <ArgonTypography variant="h5">Leave Report</ArgonTypography>
                </ArgonBox>

                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox>
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
                            Battery
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Battery"
                          id="bty_id"
                          name="bty_id"
                          value={formData.bty_id} // Access value from state
                          onChange={handleChangeSelectBattery}
                          fullWidth
                          error={!!errors.bty_id}
                          options={btysoptions}
                          onInputChange={(event) => {
                            setErrors({
                              ...errors,
                              bty_id: undefined,
                            });
                          }}
                        />
                        {errors.bty_id && (
                          <ErrorMessage message="Please select Battery." />
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
                  <ArgonBox mt={3} display="flex">
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      size="medium"
                      onClick={handleSubmit}
                    >
                      Leave Report
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
      <ArgonBox my={3}>
        <Card>
          <ArgonBox
            p={3}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <ArgonBox lineHeight={1}>
              <ArgonTypography variant="h5" fontWeight="medium">
                Leave Report
              </ArgonTypography>
            </ArgonBox>
            <Stack spacing={1} direction="row">
              <ArgonButton
                variant="outlined"
                color="info"
                size="small"
                onClick={exportToExcel}
              >
                Export
              </ArgonButton>
            </Stack>
          </ArgonBox>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <TailSpin
                visible={true}
                height={80}
                width={80}
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
              />
            </div>
          ) : (
            <DataTable
              table={dataTableData}
              entriesPerPage={{
                defaultValue: 7,
                entries: [5, 7, 10, 15, 20, 25],
              }}
              canSearch
            />
          )}
        </Card>
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
export default LeaveReport;
