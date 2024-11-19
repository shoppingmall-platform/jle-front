import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Drawer } from "@/layouts/portal";
import MainDrawer from "@/layouts/MainDrawer";

//menuItems -> category 대분류 ?

const MainTopBar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
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
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  const goToHome = () => {
    navigate("/");
  };

  const goToCate = (index) => {
    // index는 배열의 인덱스, 이를 cate_no로 사용
    navigate(`/category/cate_no/${index + 1}`); // cate_no는 1부터 시작하도록 설정
  };

  return (
    <Box sx={{ flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 1.5,
          zIndex: 1,
          width: "100%",
        }}
      >
        <Stack direction="row" spacing={3}>
          <IconButton
            sx={{ color: "black" }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <IconButton sx={{ color: "black" }} onClick={goToLogin}>
            <PersonOutlineOutlinedIcon />
          </IconButton>
        </Stack>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          position="left"
        >
          <MainDrawer />
        </Drawer>

        <Box sx={{ display: "flex" }}>
          <Button
            onClick={goToHome} // 클릭 시 동작
            sx={{ padding: 0, minWidth: 0 }} // 기본 패딩과 최소 너비 제거
          >
            <img
              src="/jle_logo.jpg"
              style={{ width: "80px", height: "40px" }}
            />
          </Button>
        </Box>
        <Stack direction="row" spacing={3}>
          <IconButton sx={{ color: "black" }}>
            <ShoppingBagOutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: "black" }}>
            <SearchIcon />
          </IconButton>
        </Stack>
      </Box>
      <Box
        sx={{ flexGrow: 1, paddingTop: 8, paddingInline: 1, display: "flex" }}
      >
        <Grid container spacing={0.5}>
          {menuItems.map((item, index) => (
            <Grid
              item
              xs={3}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              {/* 모바일에서도 4칸씩 배치 */}
              <Button
                onClick={() => goToCate(index)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "80%",
                  width: "90%",
                  padding: 1,
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "black",
                    fontSize: "0.575rem", // 모바일에서의 폰트 크기 조정
                  }}
                >
                  {item}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MainTopBar;
