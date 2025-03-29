import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import * as Yup from "yup";
import axios from "axios";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Swal from "sweetalert2";
import bgImage from "assets/images/signin-basic.jpg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const baseUrl = process.env.REACT_APP_BASE_URL;
const api = axios.create({ baseURL: baseUrl });

function Basic() {
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const toggleAgreement = () => setAgreement(!agreement);

  const validations = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    CNIC: Yup.string().required("CNIC is required"),
    mobile: Yup.string()
      .matches(/^\d{10,15}$/, "Invalid mobile number")
      .required("Mobile number is required"),
    password: Yup.string().min(6, "Minimum 6 characters required").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", CNIC: "", mobile: "", password: "" },
    validationSchema: validations,
    onSubmit: async (values) => {
      try {
        const response = await api.post("/api/signup", values);
        if (response.status === 201) {
          Swal.fire("Success", "Registration successful!", "success");
          navigate("/authentication/sign-in/basic");
        } else {
          Swal.fire("Error", "Registration failed. Please try again.", "error");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Registration error", "error");
      }
    },
  });

  const handleSendOTP = async () => {
    if (!formik.values.mobile) {
      Swal.fire("Error", "Please enter a mobile number", "error");
      return;
    }
    setOtpLoading(true);
    try {
      const response = await api.post("/api/send-otp", { mobile: formik.values.mobile });
      if (response.status === 200) {
        Swal.fire("Success", "OTP sent to your mobile!", "success");
        setOtpSent(true);
      }
    } catch {
      Swal.fire("Error", "Failed to send OTP. Try again.", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Swal.fire("Error", "Enter OTP", "error");
      return;
    }
    setOtpLoading(true);
    try {
      const response = await api.post("/api/verify-otp", { mobile: formik.values.mobile, otp });
      if (response.status === 200) {
        Swal.fire("Success", "Mobile verified!", "success");
        setOtpVerified(true);
      } else {
        Swal.fire("Error", "Invalid OTP", "error");
      }
    } catch {
      Swal.fire("Error", "OTP verification failed", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <ArgonBox p={3} mb={1} textAlign="center">
          <ArgonTypography variant="h5" fontWeight="medium">
            Register with Mobile OTP
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox pt={2} pb={3} px={3} component="form" onSubmit={formik.handleSubmit}>
          <ArgonBox mb={2}>
            <ArgonInput placeholder="Name" name="name" {...formik.getFieldProps("name")} />
          </ArgonBox>
          <ArgonBox mb={2}>
            <ArgonInput placeholder="CNIC" name="CNIC" {...formik.getFieldProps("CNIC")} />
          </ArgonBox>
          <ArgonBox mb={2} display="flex" alignItems="center">
            <ArgonInput placeholder="Mobile Number" name="mobile" {...formik.getFieldProps("mobile")} fullWidth />
            {!otpVerified && (
              <ArgonButton onClick={handleSendOTP} disabled={otpLoading} sx={{ ml: 2 }}>
                {otpLoading ? "Sending..." : "Send OTP"}
              </ArgonButton>
            )}
            {otpVerified && <CheckCircleIcon sx={{ color: "green", ml: 2 }} />}
          </ArgonBox>
          {otpSent && !otpVerified && (
            <ArgonBox mb={2} display="flex" alignItems="center">
              <ArgonInput placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} fullWidth />
              <ArgonButton onClick={handleVerifyOTP} disabled={otpLoading} sx={{ ml: 2 }}>
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </ArgonButton>
            </ArgonBox>
          )}
          <ArgonBox mb={2}>
            <ArgonInput type="password" placeholder="Password" name="password" {...formik.getFieldProps("password")} />
          </ArgonBox>
          <ArgonBox display="flex" alignItems="center">
            <Checkbox checked={agreement} onChange={toggleAgreement} />
            <ArgonTypography variant="button" onClick={toggleAgreement} sx={{ cursor: "pointer" }}>
              I agree to the <Link to="#">Terms and Conditions</Link>
            </ArgonTypography>
          </ArgonBox>
          <ArgonBox mt={4} mb={1}>
            <ArgonButton color="info" disabled={!agreement || formik.isSubmitting || !otpVerified} fullWidth type="submit">
              Sign up
            </ArgonButton>
          </ArgonBox>
          <ArgonBox mt={2}>
            <ArgonTypography variant="button">
              Already have an account? <Link to="/authentication/sign-in/basic">Sign in</Link>
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
