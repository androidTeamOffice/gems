import { useEffect, useState } from "react";

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
import FormField from "./components/FormField";
import * as Yup from "yup";
// Images
const bgImage = "";
import axios from "axios";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import { Icon, Stack, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

function LeaveCircle() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  //  For Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editLeaveCirceId, setLeaveCircleId] = useState(null); // Initially null

  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Circle Name", accessor: "circleName" },
      { Header: "Distance", accessor: "distance" },
      { Header: "Leave Gt", accessor: "lveGrant" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });
  // Define initial form data state
  const [formData, setFormData] = useState({
    circleName: "",
    distance: "",
    lveGrant: "",
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const schema = Yup.object().shape({
    circleName: Yup.string().required("CircleName is required"),
    distance: Yup.string().required("Distance is required"),
    lveGrant: Yup.string().required("Leave Grant is required"),
  });
  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/leave_circle_list");
      const formattedData = response.data.lveCircle.map((item, index) => ({
        ser: index + 1,
        circleName: item.name,
        distance: item.distance,
        lveGrant: item.lveGt,
        // status: item.status,
        action: (
          <ArgonBox display="flex" alignItems="center">
            <ArgonBox mx={2}>
              <ArgonTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => handleEditClick(item.id)} // Add onClick handler
              >
                <Tooltip title="Edit" placement="top">
                  <Icon>
                    <EditIcon />
                  </Icon>
                </Tooltip>
              </ArgonTypography>
            </ArgonBox>
            <ArgonTypography
              variant="body1"
              color="secondary"
              sx={{ cursor: "pointer", lineHeight: 0 }}
              onClick={() => handleDeleteClick(item.id)} // Add onClick handler
            >
              <Tooltip title="Delete" placement="left">
                <Icon>
                  <DeleteIcon />
                </Icon>
              </Tooltip>
            </ArgonTypography>
          </ArgonBox>
        ),
      }));
      setData(formattedData);
      setDataTableData((prevState) => ({
        ...prevState,
        rows: formattedData,
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  //// Handle Delete Leave Circle
  const handleDeleteConfirmation = async (itemID) => {
    try {
      await authAxios.post("/api/delete_leave_circle", { id: itemID }); // Use template literal for clarity
      console.log("Data" + data);
      await fetchData();
      Swal.fire("Deleted!", "Leave Circle deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting cadre:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the user.",
        "error"
      );
    } finally {
      setLoading(false); // Ensure loading state is updated even on errors
    }
  };
  const handleDeleteClick = (itemID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745", // Green color for confirmation button
      cancelButtonColor: "#dc3545", // Red color for cancel button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirmation(itemID);
      }
    });
  };
  /// Handle Edit Leave Circle
  const handleEditClick = async (userId) => {
    try {
      const response = await authAxios.post("/api/leave_circle_by_id", {
        id: userId,
      });

      if (response.data.leaveCircle) {
        const userData = response.data.leaveCircle;
        setFormData({
          id: userData.id,
          circleName: userData.name,
          distance: userData.distance, // Optionally clear distance or leave as is
          lveGrant: userData.lveGt, // Optionally clear distance or leave as is
        });
        setLeaveCircleId(userId);
        setIsEditing(true);
      } else {
        console.error("Leave Circle not found:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Leave Circle data:", error);
      // Handle errors appropriately (e.g., display user-friendly message)
    }
  };
  const handleClear = (event) => {
    setFormData({
      circleName: "",
      distance: "",
      lveGrant: "", // Add role field if needed
    });
  };
  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      // Validate form data using Yup schema

      await schema.validate(formData, { abortEarly: false });

      if (isEditing) {
        response = await authAxios.post("/api/update_leave_cirle", formData);
        Swal.fire("Updated!", "Leave Circle updated successfully.", "success");
      } else {
        await authAxios.post("/api/add_leave_circle", formData);

        Swal.fire("Added!", "Leave Circle added successfully.", "success");
      }
      await fetchData();
      setIsEditing(false);
      setFormData({
        circleName: "",
        distance: "",
        lveGrant: "",
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
              "Leave Circle already exists. Please check and try again.",
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
    /////// Data Table
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

      <ArgonBox mt={1}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <ArgonBox p={2}>
                <ArgonBox mb={2}>
                  <ArgonTypography variant="h5">
                    {isEditing ? "Edit Leave Gt" : "Add Leave Gt"}
                  </ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Circle Name"
                        name="circleName"
                        value={formData.circleName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.circleName}
                      />
                      {errors.circleName && (
                        <ErrorMessage message={errors.circleName} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Distance"
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.distance}
                      />
                      {errors.distance && (
                        <ErrorMessage message={errors.distance} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox>
                  <ArgonBox mt={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Leave Grant "
                          name="lveGrant"
                          value={formData.lveGrant}
                          onChange={handleChange}
                          fullWidth
                          error={!!errors.lveGrant}
                        />
                        {errors.lveGrant && (
                          <ErrorMessage message={errors.lveGrant} />
                        )}
                      </Grid>
                    </Grid>
                  </ArgonBox>
                  <ArgonBox mt={3}>
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      {isEditing ? "Update Leave Gt" : "Create Leave Gt"}
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
export default LeaveCircle;
