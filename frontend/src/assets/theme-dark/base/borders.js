/**
 * The base border styles for the Argon Dashboard 2 PRO MUI.
 * You can add new border width, border color or border radius using this file.
 * You can customized the borders value for the entire Argon Dashboard 2 PRO MUI using thie file.
 */

// Argon Dashboard 2 PRO MUI Base Styles
import colors from "assets/theme-dark/base/colors";

// Argon Dashboard 2 PRO MUI Helper Functions
import pxToRem from "assets/theme-dark/functions/pxToRem";
import rgba from "assets/theme-dark/functions/rgba";

const { white } = colors;

const borders = {
  borderColor: rgba(white.main, 0.15),

  borderWidth: {
    0: 0,
    1: pxToRem(1),
    2: pxToRem(2),
    3: pxToRem(3),
    4: pxToRem(4),
    5: pxToRem(5),
  },

  borderRadius: {
    xs: pxToRem(2),
    sm: pxToRem(4),
    md: pxToRem(8),
    lg: pxToRem(12),
    xl: pxToRem(16),
    xxl: pxToRem(24),
    section: pxToRem(160),
  },
};

export default borders;
