import { useState } from "react";
import { Formik, useFormik, Form } from "formik";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import ArgonAlert from "components/ArgonAlert";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

// Images
import github from "assets/images/logos/github.svg";
import google from "assets/images/logos/google.svg";
import bgImage from "assets/images/signin-basic.jpg";

import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const baseUrl = process.env.REACT_APP_BASE_URL; // Assuming variable name is REACT_APP_BASE_URL

const api = axios.create({
  baseURL: baseUrl,
});

console.log("baseUrl: " + process.env.REACT_APP_BASE_URL);
function Basic() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  //Form validation and API Request
  const validations = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validations,

    onSubmit: async (values) => {
      try {
        const response = await api.post("/api/login", values);
        console.log("Login successful:", response); // Access data here

        if (response.status === 200) {
          sessionStorage.setItem("pdf_excel_hash", response.data.token); // Access data after successful response
          sessionStorage.setItem("isAuthenticated", true);
          sessionStorage.setItem("userName", response.data.user);
          sessionStorage.setItem("userrole", response.data.role);
          Swal.fire(
            "Welcome",
            response.data.user + "! Glad to have you here.",
            "success"
          );
          if (response.data.role === "admin") {
            navigate("/dashboards/default");
          } else if (response.data.role === "manager") {
            navigate("/dashboards/manager");
          } else {
            navigate("/dashboards/user");
          }
        } else {
          Swal.fire(error.message, "Invalid username or password", "error");

          console.log("Error:", response.data); // Log error details from response
        }
      } catch (error) {
        if (error.response) {
          // If there's a response
          const { status, data } = error.response;

          switch (status) {
            case 401: // Unauthorized
              console.error("Unauthorized:", data);
              Swal.fire(
                "Error: " + status,
                "Invalid Username or Password.",
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
      }
    },
  });

  const handleInputChange = (event) => {
    formik.handleChange(event);
  };

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
            <ArgonBox mb={2}>
              <ArgonInput
                type="text"
                placeholder="Username"
                name="username"
                value={formik.values.username}
                onChange={handleInputChange}
                errormsg={formik.errors.username}
                error={formik.touched.username && formik.errors.username}
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
                onChange={handleInputChange}
                error={formik.touched.password && formik.errors.password}
              />
              {formik.touched.password && formik.errors.password && (
                <ErrorMessage message={formik.errors.password} />
              )}
            </ArgonBox>
            <ArgonBox mt={4} mb={1}>
              <ArgonButton
                color="info"
                fullWidth
                type="submit"
                disabled={formik.isSubmitting}
              >
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
export default Basic;