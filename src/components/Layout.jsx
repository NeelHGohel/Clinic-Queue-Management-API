import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import GridViewIcon from "@mui/icons-material/GridView";
import { useAuth } from "../context/AuthProvider";
import { Queue, Report, People, AccessTime } from "@mui/icons-material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicationIcon from "@mui/icons-material/Medication";

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { user, isAdmin, isPatient, isReceptionist, isDoctor, logoutAuth } =
    useAuth();

  const handleLogout = () => {
    logoutAuth();
    navigate("/login");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <GridViewIcon />,
      path: "/dashboard",
    },
    ...(isAdmin
      ? [
          {
            text: "Manage Users",
            icon: <People />,
            path: "/admin",
          },
        ]
      : []),

    ...(isPatient
      ? [
          {
            text: "Appointments",
            icon: <AccessTime />,
            path: "/appointments",
          },
        ]
      : []),
    ...(isDoctor
      ? [
          {
            text: "Doctor",
            icon: <MedicalServicesIcon />,
            path: "/doctor",
          },
        ]
      : []),
    ...(isPatient
      ? [
          {
            text: "Prescriptions",
            icon: <MedicationIcon />,
            path: "/prescriptions",
          },
        ]
      : []),
    ...(isReceptionist
      ? [
          {
            text: "Queue",
            icon: <Queue />,
            path: "/queue",
          },
        ]
      : []),

    ...(isPatient
      ? [
          {
            text: "Reports",
            icon: <Report />,
            path: "/report",
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            You are the login as <b>{user?.role}</b>
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        open
      >
        <Toolbar />

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>

                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
