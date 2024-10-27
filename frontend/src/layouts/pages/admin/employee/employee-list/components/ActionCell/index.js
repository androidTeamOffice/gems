// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

function ActionCell() {
  return (
    <ArgonBox display="flex" alignItems="center">
      <ArgonBox mx={2}>
        <ArgonTypography
          variant="body1"
          color="secondary"
          sx={{ cursor: "pointer", lineHeight: 0 }}
        >
          <Tooltip title="Edit" placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </ArgonTypography>
      </ArgonBox>
      <ArgonTypography
        variant="body1"
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
      >
        <Tooltip title="Delete" placement="left">
          <Icon>delete</Icon>
        </Tooltip>
      </ArgonTypography>
    </ArgonBox>
  );
}

export default ActionCell;
