// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Checkbox from "@mui/material/Checkbox";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

function ProductCell({ image, name, checked, onClick }) {
  return (
    <ArgonBox display="flex" alignItems="center">
      {/* Checkbox (optional, uncomment if needed) */}
      {/* <Checkbox defaultChecked={checked} /> */}
      <ArgonBox
        mx={2}
        width="3.75rem"
        onClick={onClick}
        sx={{
          cursor: "pointer", // Make the image appear clickable
          "&:hover": {
            opacity: 0.8, // Add a hover effect
          },
        }}
      >
        <ArgonBox
          component="img"
          src={image}
          alt={name}
          width="100%"
          sx={{
            borderRadius: "8px", // Optional: add some styling to the image
          }}
        />
      </ArgonBox>
      {/* Text (optional, uncomment if needed) */}
      {/* <ArgonTypography variant="button" fontWeight="medium">
        {name}
      </ArgonTypography> */}
    </ArgonBox>
  );
}

// Setting default value for the props of ProductCell
ProductCell.defaultProps = {
  checked: false,
  onClick: () => {}, // Default to no-op if no onClick is provided
};

// Typechecking props for the ProductCell
ProductCell.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onClick: PropTypes.func, // New prop for handling click events
};

export default ProductCell;
