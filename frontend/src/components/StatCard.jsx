import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListIcon from "@mui/icons-material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { Chip, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { setCurrComponent } from "../redux/sharedSlice";
import PeopleIcon from "@mui/icons-material/People";

export default function StatCard({ title, value, data }) {
  const chartColor = "#9e9e9e";
  const dispatch = useDispatch();

  return (
    <Card variant="outlined" className="h-full shadow-xl round-xl"  style={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack direction="column" gap={1} style={{ flexGrow: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" component="p">
              {value}
            </Typography>
            <IconButton
            color="primary"
              onClick={() =>
                dispatch(
                  setCurrComponent(
                    title === "Roles"
                      ? "roles"
                      : title === "IAM Users"
                      ? "users"
                      : "createdRoles"
                  )
                )
              }
            >
              <Chip
                icon={<ListIcon color="primary" />}
                label="View"
                color="transparent"
              />
            </IconButton>
          </Stack>
          <div style={{ width: "100%", height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: "band",
                data: data.map((_, index) => `Day ${index + 1}`),
              }}
            />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
