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
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";
import Swal from "sweetalert2"; // SweetAlert for alerts
import ArgonSelect from "components/ArgonSelect"; // Import ArgonSelect

// Images
const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-basic.jpg";

const baseUrl = process.env.REACT_APP_BASE_URL; // Base URL for the API
const api = axios.create({ baseURL: baseUrl });

function Basic() {
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(true);

  const handleSetAgreement = () => { setAgreement(!agreement); console.log("agreement: ", agreement) };



  // Form validation
  const validations = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: validations,
    onSubmit: async (values) => {
      try {
        const response = await api.post("/api/signup", values);

        if (response.status === 201) {
          Swal.fire("Registration Successful", `Welcome aboard! Your journey starts now!`, "success");
          // Handle successful registration (e.g., navigate to sign-in page)
          navigate("/authentication/sign-in/basic");
        }
        else if (response.status === 400) {
          Swal.fire("Error", `Username already exists!`, "warning");
          // Handle successful registration (e.g., navigate to sign-in page)
        }
        else {
          Swal.fire("Error", `Registration failed. Please try again.`, "error");
          // Handle error responses
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          Swal.fire("Error", `Username already exists!`, "warning");
          // Handle successful registration (e.g., navigate to sign-in page)
        } else {
          console.error("Error during registration:", error);
          Swal.fire("Error", `Error during registration: ${error}`, "error");
        }
      }
    },
  });

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
        <ArgonBox mb={2}>
          {/* <Socials /> */}
        </ArgonBox>
        <ArgonBox px={12}>
          {/* <Separator /> */}
        </ArgonBox>
        <ArgonBox pt={2} pb={3} px={3}>
          <ArgonBox component="form" role="form" onSubmit={formik.handleSubmit}>
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
            <ArgonBox mb={2}>
              <ArgonInput
                type="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email && (
                <ErrorMessage message={formik.errors.email} />
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
            <ArgonBox mt={4} mb={1}>
              <ArgonButton color="info" disabled={!agreement || formik.isSubmitting} // Disable if agreement is false or form is submitting
                fullWidth type="submit">
                Sign up
              </ArgonButton>
            </ArgonBox>
            <ArgonBox mt={2}>
              <ArgonTypography
                variant="button"
                color="text"
                fontWeight="regular"
              >
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
