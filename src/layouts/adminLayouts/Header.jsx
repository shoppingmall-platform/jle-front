import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Avatar,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import "./AdminHeader.css";
const menuItems = [
  {
    id: "products",
    label: "상품",
    link: "./products",
    subItems: [
      { label: "상품 목록", link: "./products/list" },
      { label: "상품 등록", link: "./products/add" },
      { label: "상품 관리", link: "./products/manage" },
      { label: "카테고리", link: "./products/categories" },
    ],
  },
  {
    id: "customers",
    label: "고객",
    link: "./customers",
    subItems: [
      { label: "고객 조회", link: "./customers/list" },
      { label: "고객 관리", link: "./customers/manage" },
    ],
  },
  {
    id: "orders",
    label: "주문/배송",
    link: "./orders",
    subItems: [
      { label: "주문 조회", link: "./orders/list" },
      { label: "배송 관리", link: "./orders/delivery" },
      { label: "취소 관리", link: "./orders/cancel" },
    ],
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleNavigation = (link) => {
    navigate(link);
  };
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", color: "black" }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/admin"
            className="logo"
          >
            Admin
          </Typography>
          <div className="menu-box">
            {menuItems.map((menuItem) => (
              <button
                key={menuItem.label}
                className="menu-button"
                onClick={() => handleNavigation(menuItem.link)}
              >
                {menuItem.label}
              </button>
            ))}
          </div>
          {dropdownOpen && (
            <div className="dropdown">
              {menuItems.map((menuItem) => (
                <div key={menuItem.label} className="dropdown-column">
                  {menuItem.subItems.map((subItem) => (
                    <button
                      key={subItem.label}
                      onClick={() => handleNavigation(subItem.link)}
                      className="dropdown-item"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
          <Box sx={{}}>
            <IconButton href="/" sx={{ p: 2 }}>
              <HomeIcon />
            </IconButton>
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="Remy Sharp"
                src="https://i1.sndcdn.com/artworks-Z5SLEGyINrvdjrkz-CQbgFA-t500x500.jpg"
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
