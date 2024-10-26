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

function Users() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  //  For Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null); // Initially null

  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Username", accessor: "username" },
      { Header: "Role", accessor: "role" },
      // { Header: "Status", accessor: "status" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });
  // Define initial form data state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "", // Add role field if needed
    status: {
      value: "active",
      label: "Active",
    }, // Default status (optional)
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleChangeSelectRole = (event) => {
    setFormData({
      ...formData,
      role: event,
    });
  };
  const handleChangeSelectStatus = (event) => {
    setFormData({
      ...formData,
      status: event,
    });
  };

  const schema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    role: Yup.object()
      .shape({
        value: Yup.string().required("Role is required"),
      })
      .required("Role is Required"),
    // status: Yup.object().shape({
    //   value: Yup.string().required("Status is required"),
    // }),
  });
  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/users_list");
      const formattedData = response.data.users.map((item, index) => ({
        ser: index + 1,
        username: item.username,
        role: item.role,
        // status: item.status,
        action: (
          <ArgonBox display="flex" alignItems="center">
            <ArgonBox mx={2}>
              <ArgonTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => handleEditUser(item.id)} // Add onClick handler
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
  //// Handle Delete User
  const handleDeleteConfirmation = async (itemID) => {
    try {
      await authAxios.post("/api/delete_user", { id: itemID }); // Use template literal for clarity
      console.log("Data" + data);
      await fetchData();
      Swal.fire("Deleted!", "User deleted successfully.", "success");
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
  /// Handle Edit User
  const handleEditUser = async (userId) => {
    try {
      const response = await authAxios.post("/api/user_by_id", { id: userId });

      if (response.data.user) {
        const userData = response.data.user;
        setFormData({
          id: userData.id,
          username: userData.username,
          password: "", // Optionally clear password or leave as is
          role: {
            value: userData.role,
            label: userData.role === "user" ? "User" : "Manager",
          },
          // status: {
          //   value: userData.status,
          //   label: userData.status === "active" ? "Active" : "De-Active",
          // },
        });
        setEditUserId(userId);
        setIsEditing(true);
      } else {
        console.error("User not found:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle errors appropriately (e.g., display user-friendly message)
    }
  };
  const handleClear = (event) => {
    setFormData({
      username: "",
      password: "",
      role: "", // Add role field if needed
      status: {
        value: "active",
        label: "Active",
      },
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
        console.log("FormData");
        console.log(formData);
        // Update existing user
        response = await authAxios.post("/api/update_user", formData);
        console.log("response" + response);

        Swal.fire("Updated!", "User updated successfully.", "success");
      } else {
        // Add new user
        await authAxios.post("/api/add_user", formData);
        console.log("response" + response);

        Swal.fire("Added!", "User added successfully.", "success");
      }
      await fetchData();
      setIsEditing(false);
      setFormData({
        username: "",
        password: "",
        role: "",
        // status: "",
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
              "User already exists. Please check and try again.",
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
                    {isEditing ? "Edit User" : "Add User"}
                  </ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.username}
                      />
                      {errors.username && (
                        <ErrorMessage message={errors.username} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        type="password"
                        error={!!errors.password}
                      />
                      {errors.password && (
                        <ErrorMessage message={errors.password} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox>
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
                              User Role
                            </ArgonTypography>
                          </ArgonBox>
                          <ArgonSelect
                            label="User Role"
                            id="role"
                            name="role"
                            value={formData.role} // Access value from state
                            onChange={handleChangeSelectRole}
                            fullWidth
                            error={!!errors.role}
                            defaultValue={{ value: "user", label: "User" }}
                            options={[
                              { value: "user", label: "User" },
                              { value: "manager", label: "Manager" },
                            ]}
                            onInputChange={(event) => {
                              setErrors({ ...errors, role: undefined });
                            }}
                          />
                          {errors.role && (
                            <ErrorMessage message="Please select a role for the user." />
                          )}
                        </ArgonBox>
                      </Grid>
                      {/* <Grid item xs={12} sm={6}>
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
                              Account Status
                            </ArgonTypography>
                          </ArgonBox>
                          <ArgonSelect
                            label="Account Status"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChangeSelectStatus}
                            fullWidth
                            error={!!errors.status}
                            defaultValue={{ value: "active", label: "Active" }}
                            options={[
                              { value: "active", label: "Active" },
                              { value: "deactive", label: "De-Active" },
                            ]}
                            onInputChange={(event) => {
                              setErrors({ ...errors, status: undefined });
                            }}
                          />
                          {errors.status && (
                            <ErrorMessage message="Please select a Status for the user." />
                          )}
                        </ArgonBox>
                      </Grid> */}
                    </Grid>
                  </ArgonBox>
                  <ArgonBox mt={3}>
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      {isEditing ? "Update User" : "Create User"}
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
export default Users;
