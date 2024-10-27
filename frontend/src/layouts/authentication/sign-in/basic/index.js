import { useState } from "react";
import { useFormik } from "formik";
import Card from "@mui/material/Card"; // @mui material components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import BasicLayout from "layouts/authentication/components/BasicLayout"; // Authentication layout components
import bgImage from "assets/images/signin-basic.jpg"; // Background image
import * as Yup from "yup"; // Yup for form validation
import axios from "axios"; // Axios for API requests
import { useNavigate } from "react-router-dom"; // Navigation hook
import Swal from "sweetalert2"; // SweetAlert for alerts
import ArgonSelect from "components/ArgonSelect"; // Import ArgonSelect

const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL for the API
const api = axios.create({ baseURL: baseUrl });

function Basic() {
  const navigate = useNavigate();
  
  // Form validation and API Request
  const validations = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    userType: Yup.string().required("User Type is required"), // Add validation for user type
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      userType: "", // Include userType in initial values
    },
    validationSchema: validations,
    onSubmit: async (values) => {
      const { userType, username, password } = values; // Destructure values
      try {
        const response = await api.post("/api/login", { username, password, userType });
        console.log("Login successful:", response);

        if (response.status === 200) {
          sessionStorage.setItem("pdf_excel_hash", response.data.token);
          sessionStorage.setItem("isAuthenticated", true);
          sessionStorage.setItem("userName", response.data.user);
          sessionStorage.setItem("userrole", response.data.role);
          Swal.fire("Welcome", `${response.data.user}! Glad to have you here. ${response.data.role}`, "success");

          // Navigate based on role
          switch (response.data.role) {
            case "admin":
              navigate("/dashboards/default");
              break;
            case "manager":
              navigate("/dashboards/manager");
              break;
            default:
              navigate("/dashboards/user");
              break;
          }
        } else {
          Swal.fire("Error", "Invalid username or password", "error");
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          Swal.fire("Error", data.message || "An unexpected error occurred.", "error");
        }
      }
    },
  });

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <ArgonBox p={3} textAlign="center">
          <ArgonTypography variant="h5" fontWeight="medium" sx={{ my: 2 }}>
            Sign in
          </ArgonTypography>
        </ArgonBox>

        <ArgonBox px={6} pb={3} textAlign="center">
          <ArgonBox component="form" role="form" onSubmit={formik.handleSubmit}>
            {/* User Type Dropdown */}
            <ArgonBox mb={2}>
            <ArgonSelect
  label="User Type"
  options={[
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "user", label: "User" },
  ]}
  value={formik.values.userType ? { value: formik.values.userType, label: formik.values.userType.charAt(0).toUpperCase() + formik.values.userType.slice(1) } : null} // Format the value
  onChange={(option) => formik.setFieldValue("userType", option.value)} // Set Formik value
  fullWidth
  required
  error={formik.touched.userType && Boolean(formik.errors.userType)}
  placeholder="Select User Type" // Custom placeholder
/>


              {formik.touched.userType && formik.errors.userType && (
                <ErrorMessage message={formik.errors.userType} />
              )}
            </ArgonBox>

            <ArgonBox mb={2}>
              <ArgonInput
                type="text"
                placeholder="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                errormsg={formik.errors.username}
                error={formik.touched.username && Boolean(formik.errors.username)}
              />
              {formik.touched.username && formik.errors.username && (
                <ErrorMessage message={formik.errors.username} />
              )}
            </ArgonBox>

            <ArgonBox mb={2}>
              <ArgonInput
                type="password"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
              />
              {formik.touched.password && formik.errors.password && (
                <ErrorMessage message={formik.errors.password} />
              )}
            </ArgonBox>

            <ArgonBox mt={4} mb={1}>
              <ArgonButton color="info" fullWidth type="submit" disabled={formik.isSubmitting}>
                Sign In
              </ArgonButton>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </BasicLayout>
  );
}

function ErrorMessage({ message }) {
  return (
    <p style={{ color: "red", fontSize: "0.8rem", margin: "0 0" }}>
      {message}
    </p>
  );
}

export default Basic;
