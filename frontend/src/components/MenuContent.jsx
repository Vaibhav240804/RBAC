import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrComponent } from "../redux/sharedSlice";

export default function MenuContent() {
  const { isRoot } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const mainListItems = [
    {
      text: "Home",
      icon: (
        <IconButton onClick={() => dispatch(setCurrComponent("dash"))}>
          <HomeRoundedIcon />
        </IconButton>
      ),
    },
    isRoot && {
      text: "Users",
      icon: (
        <IconButton onClick={() => dispatch(setCurrComponent("users"))}>
          <PeopleRoundedIcon />
        </IconButton>
      ),
    },
    {
      text: "Roles",
      icon: (
        <IconButton action={() => dispatch(setCurrComponent("roles"))}>
          <AssignmentRoundedIcon />
        </IconButton>
      ),
    },
  ];

  const secondaryListItems = [
    { text: "Settings", icon: <SettingsRoundedIcon /> },
    { text: "About", icon: <InfoRoundedIcon /> },
    { text: "Feedback", icon: <HelpRoundedIcon /> },
  ];
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
