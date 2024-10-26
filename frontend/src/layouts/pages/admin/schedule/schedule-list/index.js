import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Success from "layouts/pages/sweet-alerts/components/Success";
const baseUrl = process.env.REACT_APP_BASE_URL; // Assuming variable name is REACT_APP_BASE_URL

const authAxios = axios.create({
  baseURL: baseUrl,
});

authAxios.interceptors.request.use(
  (config) => {
    return new Promise((resolve) => {
      const token = sessionStorage.getItem("pdf_excel_hash");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      resolve(config); // Resolve the promise with the modified config
    });
  },
  (error) => Promise.reject(error)
);
function ScheduleList() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Army No", accessor: "armyNo" },
      { Header: "Name", accessor: "employeeName" },
      { Header: "Rank", accessor: "rank" },
      { Header: "Trade", accessor: "trade" },
      { Header: "Bty", accessor: "bty" },
      { Header: "Date", accessor: "date" },
      { Header: "End Date", accessor: "enddate" },
      { Header: "Start Time", accessor: "startTime" },
      { Header: "End Time", accessor: "endTime" },
      { Header: "Duty Name", accessor: "dutyName" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });

  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/schedules_list");

      const formattedData = response.data.schedules.map((item, index) => ({
        ser: index + 1,
        armyNo: item.army_no,
        employeeName: item.employee_name,
        rank: item.rank_name,
        trade: item.cadre_name,
        bty: item.bty,
        dutyName: item.duty_name,
        startTime: item.start_time,
        endTime: item.end_time,
        date: new Date(item.date).toLocaleDateString(),
        enddate: new Date(item.end_date).toLocaleDateString(),

        action: (
          <ArgonBox display="flex" alignItems="center">
            <ArgonBox mx={2}>
              <ArgonTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => handleEditClick(item.id)}
              >
                <Tooltip title="Edit" placement="top">
                  <Icon>edit</Icon>
                </Tooltip>
              </ArgonTypography>
            </ArgonBox>
            <ArgonTypography
              variant="body1"
              color="secondary"
              sx={{ cursor: "pointer", lineHeight: 0 }}
              onClick={() => handleDeleteClick(item.id)}
            >
              <Tooltip title="Delete" placement="left">
                <Icon>delete</Icon>
              </Tooltip>
            </ArgonTypography>
          </ArgonBox>
        ),
      }));
      setDataTableData({
        ...dataTableData,
        rows: formattedData,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Check the last scheduled date from localStorage
    const scheduledDate = localStorage.getItem("scheduledDate");

    if (scheduledDate) {
      const schDate = new Date();
      const nextEnabledDate = new Date(scheduledDate);
      nextEnabledDate.setDate(nextEnabledDate.getDate() + 7); // 7 days later

      if (schDate >= nextEnabledDate) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  //// Handle Delete User
  const handleDeleteConfirmation = async (itemID) => {
    try {
      await authAxios.post("/api/delete_schedule", { id: itemID }); // Use template literal for clarity
      Swal.fire("Deleted!", "Schedule deleted successfully.", "success");
      await fetchData();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the schedule.",
        "error"
      );
    } finally {
      setLoading(false); // Ensure loading state is updated even on errors
    }
  };

  const handleDeleteClick = (itemID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745", // Green color for confirmation button
      cancelButtonColor: "#dc3545", // Red color for cancel button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirmation(itemID);
      }
    });
  };

  const handleDeleteAllSchedules = async () => {
    try {
      await authAxios.delete("/api/delete_all_schedules"); // Adjust the API endpoint as needed
      Swal.fire("Deleted!", "All schedules deleted successfully.", "success");
      fetchData(); // Refresh the data after deletion
      setIsDisabled(false);
    } catch (error) {
      console.error("Error deleting all schedules:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting all schedules.",
        "error"
      );
    }
  };

  const handleAutoSchedule = async () => {
    try {
      const response = await authAxios.get("/api/auto_schedule");
      Swal.fire("Added!", response.data.message, "success");

      // Disable the button and store the current date
      const schDate = new Date();
      localStorage.setItem("scheduledDate", schDate);
      setIsDisabled(true);

      fetchData();
    } catch (error) {
      console.error("Error creating daily schedule:", error);
      Swal.fire("Error!", "Error fetching Data", "error");
    }
  };
  /// Handle Update User
  const handleEditClick = async (itemID) => {
    try {
      const response = await authAxios.post("/api/schedule_by_id", {
        id: itemID,
      });

      if (response.data.schedule) {
        const dbData = response.data.schedule;
        navigate(`/admin/schedule/edit-schedule`, {
          state: { dbData },
        });
      } else {
        Swal.fire("Error!", "Data no Found", "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error!", "Error fetching Data", "error");
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox my={3}>
        <Card>
          <ArgonBox
            p={3}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <ArgonBox lineHeight={1}>
              <ArgonTypography variant="h5" fontWeight="medium">
                All Schedules
              </ArgonTypography>
            </ArgonBox>
            <Stack spacing={1} direction="row">
              <ArgonButton
                variant="gradient"
                onClick={handleAutoSchedule}
                color="info"
                size="small"
                disabled={isDisabled} // Button will be disabled based on the state
              >
                Create Weekly Schedule
              </ArgonButton>

              <ArgonButton variant="outlined" color="info" size="small">
                Import
              </ArgonButton>
              <ArgonButton variant="outlined" color="info" size="small">
                Export
              </ArgonButton>
              <ArgonButton
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "This will delete all schedules permanently!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#dc3545", // Red color for confirmation button
                    cancelButtonColor: "#6c757d", // Gray color for cancel button
                    confirmButtonText: "Yes, delete all!",
                    cancelButtonText: "No, cancel",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDeleteAllSchedules();
                    }
                  });
                }}
              >
                Delete All Schedules
              </ArgonButton>
            </Stack>
          </ArgonBox>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <TailSpin
                visible={true}
                height={80}
                width={80}
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
              />
            </div>
          ) : (
            <DataTable
              table={dataTableData}
              entriesPerPage={{
                defaultValue: 7,
                entries: [5, 7, 10, 15, 20, 25],
              }}
              canSearch
            />
          )}
        </Card>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ScheduleList;
