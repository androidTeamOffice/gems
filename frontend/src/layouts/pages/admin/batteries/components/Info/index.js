import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonEditor from "components/ArgonEditor";
import ArgonSelect from "components/ArgonSelect";

// NewProduct page components
import FormField from "../FormField";

function Info() {
  const [editorValue, setEditorValue] = useState(
    "<p>Some initial <strong>bold</strong> text</p><br><br><br>"
  );

  return (
    <ArgonBox>
      <ArgonTypography variant="h5">User Information</ArgonTypography>
      <ArgonBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="text"
              label="Username"
              placeholder="Enter Username"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="password"
              label="Password"
              placeholder="Enter Password"
            />
          </Grid>
        </Grid>
      </ArgonBox>
      <ArgonBox mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <ArgonBox mb={3}>
              <ArgonBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
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
                defaultValue={{ value: "user", label: "User" }}
                options={[
                  { value: "user", label: "User" },
                  { value: "manager", label: "Manager" },
                ]}
              />
            </ArgonBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ArgonBox mb={3}>
              <ArgonBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <ArgonTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Acctount Status
                </ArgonTypography>
              </ArgonBox>
              <ArgonSelect
                defaultValue={{ value: "active", label: "Active" }}
                options={[
                  { value: "active", label: "Active" },
                  { value: "deactive", label: "De-Active" },
                ]}
              />
            </ArgonBox>
          </Grid>
        </Grid>
      </ArgonBox>
    </ArgonBox>
  );
}

export default Info;
