import React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import StatCard from "./StatCard";

export default function MainGrid() {
  const { roles, createdRoles, iamUsers } = useSelector(
    (state) => state.shared
  );

  const formatDataForChart = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => new Date(item.timestamp).getDate());
  };

  const rolesData = React.useMemo(() => formatDataForChart(roles), [roles]);
  const createdRolesData = React.useMemo(
    () => formatDataForChart(createdRoles),
    [createdRoles]
  );
  const iamUsersData = React.useMemo(
    () => formatDataForChart(iamUsers),
    [iamUsers]
  );

  return (
    <Box style={{ width: "100%", maxWidth: "1700px" }}>
      <Typography component="h2" variant="h6" style={{ marginBottom: "16px" }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Roles" value={`${roles.length}`} data={rolesData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Created Roles"
            value={`${createdRoles.length}`}
            interval="Last 30 days"
            trend="neutral"
            data={createdRolesData}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="IAM Users"
            value={`${iamUsers.length}`}
            data={iamUsersData}
          />
        </Grid>
      </Grid>
      <Typography
        component="h2"
        variant="h6"
        style={{ marginTop: "32px", marginBottom: "16px" }}
      >
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          {/* Add other components for details here */}
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", lg: "column" }}>
            {/* Add additional charts or details here */}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
