import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
}));

export default function SideMenu() {
  const { user, isRoot } = useSelector((state) => state.auth);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          [`& .${drawerClasses.paper}`]: {
            backgroundColor: "background.paper",
          },
        }}
      >
        <Divider />
        <MenuContent />
        <CardAlert />
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            sizes="small"
            alt="User"
            src="https://avatars.githubusercontent.com/u/8186664?v=4"
            sx={{ width: 36, height: 36 }}
          />
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px" }}
            >
              {isRoot ? user.username : user.accountId}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {user.email}
            </Typography>
          </Box>
          <OptionsMenu />
        </Stack>
      </Drawer>

      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .${drawerClasses.paper}`]: {
            backgroundColor: "background.paper",
          },
        }}
      >
        <Box sx={{ display: "flex", mt: 2, p: 1.5 }}>
          <SelectContent />
        </Box>
        <Divider />
        <MenuContent />
        <CardAlert />
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            sizes="small"
            alt="User"
            src="https://avatars.githubusercontent.com/u/8186664?v=4"
            sx={{ width: 36, height: 36 }}
          />
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px" }}
            >
              {isRoot ? user.username : user.accountId}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {user.email}
            </Typography>
          </Box>
          <OptionsMenu />
        </Stack>
      </Drawer>
    </>
  );
}
