import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom"; // react-router-dom components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import * as Yup from "yup"; // Yup for form validation
import axios from "axios"; // Axios for API requests
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Swal from "sweetalert2"; // SweetAlert for alerts
import bgImage from "assets/images/signin-basic.jpg"; // Background image
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL for the API
const api = axios.create({ baseURL: baseUrl });

function Basic() {
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(true);

  // State for OTP handling
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSetAgreement = () => {
    setAgreement(!agreement);
    console.log("agreement: ", agreement);
  };

  // Form validation
  const validations = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    CNIC: Yup.string().required("CNIC is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      CNIC: "",
      email: "",
      password: "",
    },
    validationSchema: validations,
    onSubmit: async (values) => {
      try {
        const response = await api.post("/api/signup", values);

        if (response.status === 201) {
          Swal.fire("Registration Successful", `Welcome!`, "success");
          // Handle successful registration (e.g., navigate to sign-in page)
          navigate("/authentication/sign-in/basic");
        } else if (response.status === 400) {
          Swal.fire("Error", `Username already exists!`, "warning");
        } else {
          Swal.fire("Error", `Registration failed. Please try again.`, "error");
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          Swal.fire("Error", `Username already exists!`, "warning");
        } else {
          console.error("Error during registration:", error);
          Swal.fire("Error", `Error during registration: ${error}`, "error");
        }
      }
    },
  });

  // Function to send OTP to email
  const handleSendOTP = async () => {
    if (!formik.values.email) {
      Swal.fire("Error", "Please enter an email", "error");
      return;
    }
    try {
      setOtpLoading(true);
      const response = await api.post("/api/send-otp", { email: formik.values.email });
      if (response.status === 200) {
        Swal.fire("Success", "OTP sent to your email!", "success");
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire("Error", "Failed to send OTP. Please try again.", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  // Function to verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      Swal.fire("Error", "Please enter the OTP", "error");
      return;
    }
    try {
      setOtpLoading(true);
      const response = await api.post("/api/verify-otp", {
        email: formik.values.email,
        otp: otp,
      });
      if (response.status === 200 && response.data.verified) {
        Swal.fire("Success", "Email verified successfully!", "success");
        setEmailVerified(true);
      } else {
        Swal.fire("Error", "Invalid OTP. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire("Error", "Failed to verify OTP. Please try again.", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <BasicLayout
      image={bgImage}
      button={{ variant: "gradient", color: "dark" }}
    >
      <Card>
        <ArgonBox p={3} mb={1} textAlign="center">
          <ArgonTypography variant="h5" fontWeight="medium">
            Register with
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox pt={2} pb={3} px={3}>
          <ArgonBox component="form" role="form" onSubmit={formik.handleSubmit}>
            {/* Name Field */}
            <ArgonBox mb={2}>
              <ArgonInput
                placeholder="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name && (
                <ErrorMessage message={formik.errors.name} />
              )}
            </ArgonBox>

            {/* CNIC Field */}
            <ArgonBox mb={2}>
              <ArgonInput
                placeholder="CNIC"
                name="CNIC"
                value={formik.values.CNIC}
                onChange={formik.handleChange}
                error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
              />
              {formik.touched.CNIC && formik.errors.CNIC && (
                <ErrorMessage message={formik.errors.CNIC} />
              )}
            </ArgonBox>

            {/* Email Field with OTP Button */}
            <ArgonBox mb={2} display="flex" alignItems="center">
              <ArgonInput
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={(e) => {
                  formik.handleChange(e);
                  // If user changes email after sending OTP, reset verification
                  setEmailSent(false);
                  setEmailVerified(false);
                  setOtp("");
                }}
                error={formik.touched.email && Boolean(formik.errors.email)}
                fullWidth
              />
              {/* Send OTP button */}
              {!emailVerified && (
                <ArgonButton
                  variant="gradient"
                  color="info"
                  onClick={handleSendOTP}
                  disabled={otpLoading || !formik.values.email}
                  sx={{ ml: 2, height: "40px" }}
                >
                  {otpLoading ? "Sending..." : "Send OTP"}
                </ArgonButton>
              )}
              {/* Display a green check if verified */}
              {emailVerified && (
                <CheckCircleIcon sx={{ color: "green", ml: 2 }} />
              )}
            </ArgonBox>
            {formik.touched.email && formik.errors.email && (
              <ErrorMessage message={formik.errors.email} />
            )}

            {/* OTP Input Field */}
            {emailSent && !emailVerified && (
              <ArgonBox mb={2} display="flex" alignItems="center">
                <ArgonInput
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  fullWidth
                />
                <ArgonButton
                  variant="gradient"
                  color="info"
                  onClick={handleVerifyOTP}
                  disabled={otpLoading || !otp}
                  sx={{ ml: 2, height: "40px" }}
                >
                  {otpLoading ? "Verifying..." : "Verify OTP"}
                </ArgonButton>
              </ArgonBox>
            )}

            {/* Password Field */}
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

            {/* Agreement */}
            <ArgonBox display="flex" alignItems="center">
              <Checkbox checked={agreement} onChange={handleSetAgreement} />
              <ArgonTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetAgreement}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </ArgonTypography>
              <ArgonTypography
                component="a"
                href="#"
                color="info"
                variant="button"
                fontWeight="bold"
              >
                Terms and Conditions
              </ArgonTypography>
            </ArgonBox>

            {/* Sign up Button */}
            <ArgonBox mt={4} mb={1}>
              <ArgonButton
                color="info"
                disabled={!agreement || formik.isSubmitting || !emailVerified}
                fullWidth
                type="submit"
              >
                Sign up
              </ArgonButton>
            </ArgonBox>

            <ArgonBox mt={2}>
              <ArgonTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <ArgonTypography
                  component={Link}
                  to="/authentication/sign-in/basic"
                  variant="button"
                  color="info"
                  fontWeight="bold"
                >
                  Sign in
                </ArgonTypography>
              </ArgonTypography>
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
