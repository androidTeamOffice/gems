import { useState } from "react";
import PropTypes from "prop-types";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Background Image
const bgImage = "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-cover.jpg";

function Cover({ role }) {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // Handle sign-in based on role
  const handleSignIn = () => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "manager") {
      navigate("/manager/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  return (
    <CoverLayout
      title={`Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)}!`}
      description={`Enter your email and password to sign in as ${role}.`}
      image={bgImage}
    >
      <Card>
        <ArgonBox pt={3} px={3}>
          <ArgonTypography variant="h3" color="dark" fontWeight="bold" mb={1}>
            {`Welcome back, ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </ArgonTypography>
          <ArgonTypography variant="body2" color="text">
            Enter your email and password to sign in
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox p={3}>
          <ArgonBox component="form" role="form">
            <ArgonBox mb={3}>
              <ArgonTypography
                display="block"
                variant="caption"
                fontWeight="bold"
                color="dark"
                sx={{ ml: 0.5, mb: 1 }}
              >
                Email
              </ArgonTypography>
              <ArgonInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </ArgonBox>
            <ArgonBox mb={3}>
              <ArgonTypography
                display="block"
                variant="caption"
                fontWeight="bold"
                color="dark"
                sx={{ ml: 0.5, mb: 1 }}
              >
                Password
              </ArgonTypography>
              <ArgonInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </ArgonBox>
            <ArgonBox display="flex" alignItems="center">
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <ArgonTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp;&nbsp;Remember me
              </ArgonTypography>
            </ArgonBox>
            <ArgonBox mt={4}>
              <ArgonButton color="info" fullWidth onClick={handleSignIn}>
                Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
              </ArgonButton>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>
        <ArgonBox pb={4} px={1} textAlign="center">
          <ArgonTypography variant="button" fontWeight="regular" color="text">
            Don&apos;t have an account?{" "}
            <ArgonTypography
              component={Link}
              to="/authentication/sign-up/cover"
              variant="button"
              fontWeight="regular"
              color="info"
            >
              Sign up
            </ArgonTypography>
          </ArgonTypography>
        </ArgonBox>
      </Card>
    </CoverLayout>
  );
}

// Define prop types
Cover.propTypes = {
  role: PropTypes.oneOf(["admin", "manager", "user"]).isRequired,
};

export default Cover;
