import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
  Divider,
  List,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const buttonItems = [
  { icon: <BookmarkBorderIcon sx={{ fontSize: "16px" }} />, label: "my page" },
  { icon: <ShoppingCartIcon sx={{ fontSize: "16px" }} />, label: "cart" },
  { icon: <ReceiptIcon sx={{ fontSize: "16px" }} />, label: "order" },
  { icon: <FavoriteBorderIcon sx={{ fontSize: "16px" }} />, label: "wish" },
];

const menuItems = [
  "Best",
  "[당일발송]",
  "머슬핏",
  "New 5%",
  "All",
  "Outer",
  "Top",
  "Shirts",
  "Bottom",
  "ACC",
  "Shoes",
  "[MADE]",
  "휴양룩",
];

const localTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#000000", // 버튼 텍스트 색상
          backgroundColor: "", // 배경색
          "&:hover": {
            backgroundColor: "#72706F", // hover 색상
          },
        },
      },
    },
  },
});

const MainDrawer = () => {
  return (
    <ThemeProvider theme={localTheme}>
      <div>
        <Box sx={{ width: "100%", marginBottom: 1.5 }}>
          <Typography
            sx={{ fontSize: "10px", color: "black", textWrap: "wrap" }}
          >
            로그인을 하시면 <br /> 더 많은 혜택을 받으실 수 있어요.
          </Typography>
          <Grid container sx={{ marginTop: 1.5 }}>
            <Grid item xs={6}>
              <Button
                size="small"
                sx={{
                  backgroundColor: "#A3A09F",
                  color: "white",
                  width: "90%",
                  fontSize: "small",
                }}
              >
                LOGIN
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button size="small" sx={{ width: "90%", fontSize: "small" }}>
                Join Us
              </Button>
            </Grid>
            {buttonItems.map((item, index) => (
              <Grid item xs={3} key={index} sx={{ marginTop: 1.5 }}>
                <Button
                  sx={{
                    width: "100%",
                    fontSize: "x-small",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ marginTop: 1.5 }}>
          <List></List>
        </Box>
        <Box>notice</Box>
      </div>
    </ThemeProvider>
  );
};

export default MainDrawer;
