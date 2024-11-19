import { createTheme } from "@mui/material";

export const userTheme = createTheme({
  palette: {
    primary: {
      main: "#A3A09F", // 약간의 카키 톤이 들어간 그레이
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#72706F", // 조금 더 진한 카키-그레이
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
        color: "primary",
      },
    },
  },
});
