/* eslint-disable no-unused-vars */

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { useState, useEffect } from "react";
// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 PRO MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import Table from "examples/Tables/Table";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 PRO MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboards/default/components/Slider";
import TeamMembers from "layouts/dashboards/default/components/TeamMembers";
import TodoList from "layouts/dashboards/default/components/TodoList";
import ProgressTrack from "layouts/dashboards/default/components/ProgressTrack";
import BalanceCard from "layouts/dashboards/default/components/BalanceCard";
import CryptoCard from "layouts/dashboards/default/components/CryptoCard";

// Pages layout components
import Post from "layouts/pages/profile/teams/components/Post";

// Data
import reportsBarChartData from "layouts/dashboards/default/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboards/default/data/gradientLineChartData";
import projectsTableData from "layouts/dashboards/default/data/projectsTableData";
import salesTableData from "layouts/dashboards/default/data/salesTableData";
import authorsTableData from "layouts/dashboards/default/data/authorsTableData";
import categoriesListData from "layouts/dashboards/default/data/categoriesListData";
import axios from "axios";

//
// Request interceptor to add JWT token to Authorization header (if present)
const baseUrl = process.env.REACT_APP_BASE_URL; // Assuming variable name is REACT_APP_BASE_URL
const authAxios = axios.create({
  baseURL: baseUrl,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("pdf_excel_hash");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

function Default() {
  const { size } = typography;
  const [counters, setCounters] = useState({
    onLeave: 0,
    onDuty: 0,
    onRest: 0,
    onCourse: 0,
  });

  useEffect(() => {
    fetchCounters();
  }, []);
  const fetchCounters = async () => {
    try {
      const response = await authAxios.get("/api/dashboard_counters");
      setCounters(response.data);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="On Leave"
              count={counters.onLeave}
              icon={{
                color: "info",
                component: <i className="ni ni-send" />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="On Duty"
              count={counters.onDuty}
              icon={{
                color: "error",
                component: <i className="ni ni-world" />,
              }}
              // percentage={{
              //   color: "success",
              //   count: "+3%",
              //   text: "since last week",
              // }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="On Rest"
              count={counters.onRest}
              icon={{
                color: "success",
                component: <i className="ni ni-paper-diploma" />,
              }}
              // percentage={{
              //   color: "error",
              //   count: "-2%",
              //   text: "since last quarter",
              // }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="On Course"
              count={counters.onCourse}
              icon={{
                color: "warning",
                component: <i className="ni ni-books" />,
              }}
              // percentage={{
              //   color: "success",
              //   count: "+5%",
              //   text: "than last month",
              // }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid>hi</Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid>hi</Grid>
        </Grid>
      </ArgonBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Default;