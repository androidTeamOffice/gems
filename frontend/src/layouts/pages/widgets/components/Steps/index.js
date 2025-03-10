// @mui material components
import Card from "@mui/material/Card";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonBadge from "components/ArgonBadge";

function Steps() {
  return (
    <Card>
      <ArgonBox p={3}>
        <ArgonTypography variant="body2" color="text" fontWeight="regular">
          Steps
        </ArgonTypography>
        <ArgonBox mt={2} mb={1} lineHeight={0}>
          <ArgonTypography variant="h3" fontWeight="bold">
            11.4K
          </ArgonTypography>
        </ArgonBox>
        <ArgonBadge
          variant="contained"
          color="success"
          badgeContent="+4.3%"
          container
        />
      </ArgonBox>
    </Card>
  );
}

export default Steps;
