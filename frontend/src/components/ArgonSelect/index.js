import { forwardRef } from "react";
import PropTypes from "prop-types"; // Prop-types for typechecking of props
import Select from "react-select"; // react-select components
import colors from "assets/theme/base/colors"; // Argon Dashboard 2 PRO MUI base styles
import { useArgonController } from "context"; // Argon Dashboard 2 PRO MUI context
import styles from "components/ArgonSelect/styles"; // Custom styles for ArgonSelect

const ArgonSelect = forwardRef(({ size, error, success, placeholder, ...rest }, ref) => {
  const [controller] = useArgonController();
  const { darkMode } = controller;
  const { light } = colors;

  return (
    <Select
      {...rest}
      ref={ref}
      placeholder={placeholder} // Set the placeholder here
      styles={styles(size, error, success, darkMode)}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: light.main,
          primary: light.main,
        },
      })}
      // Ensure this option is included to support single selection
      onChange={(option) => rest.onChange(option)} 
    />
  );
});

// Setting default values for the props of ArgonSelect
ArgonSelect.defaultProps = {
  size: "medium",
  error: false,
  success: false,
  placeholder: "Select an option...", // Default placeholder text
};

// Typechecking props for the ArgonSelect
ArgonSelect.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  error: PropTypes.bool,
  success: PropTypes.bool,
  placeholder: PropTypes.string, // Typecheck for placeholder prop
};

export default ArgonSelect;
