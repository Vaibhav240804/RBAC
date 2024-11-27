import React, { useEffect, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SideMenu from "../components/SideMenu";
import { alpha } from "@mui/system";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainGrid from "../components/MainGrid";
import RolesComponent from "../components/RolesComponent";
import { getAllPermissions } from "../redux/permSlice";
import { getCurrUsersRoles } from "../redux/roleSlice";
import IAMUsersComponent from "../components/IAMUsersComponent";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isRoot, user, isLoading, isSuccess } = useSelector(
    (state) => state.auth
  );
  const { currComponent } = useSelector((state) => state.shared);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      dispatch(getAllPermissions());
      dispatch(getCurrUsersRoles());
    } catch (error) {
      console.error("Failed to fetch permissions or roles", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
    if (isRoot) {
      fetchData();
    }
  }, [isRoot, isSuccess, user]);

  return isLoading ? (
    <div>Loading...</div>
  ) : user ? (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            {currComponent === "roles" ? (
              <RolesComponent />
            ) : currComponent === "users" ? (
              <IAMUsersComponent />
            ) : (
              <MainGrid />
            )}
          </Stack>
        </Box>
      </Box>
    </>
  ) : (
    <Navigate to="/signin" />
  );
}
