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
function CourseCompletionList() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Army No", accessor: "armyNo" },
      { Header: "Course", accessor: "course" },
      { Header: "Course Serial", accessor: "courseSer" },
      { Header: "Course From", accessor: "courseFrom" },
      { Header: "Course To", accessor: "courseTo" },
      { Header: "Institution", accessor: "institution" },
      { Header: "Remarks", accessor: "remarks" },
      { Header: "Course Status", accessor: "courseStatus" },
      { Header: "Grade", accessor: "grade" },

      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });

  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/course_completions_list");
      const formattedData = response.data.course_completion.map(
        (item, index) => ({
          ser: index + 1,
          armyNo: `${item.army_no} ${item.rank} ${item.name}`,
          course: item.course_name,
          courseSer: item.course_serial,
          courseFrom: new Date(item.course_from).toLocaleDateString(),
          courseTo: new Date(item.course_to).toLocaleDateString(),
          institution: item.institution,
          remarks: item.remarks,
          courseStatus: item.course_status,
          grade: item.grade,

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
        })
      );
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

  useEffect(() => {
    fetchData();
  }, []);
  //// Handle Delete User
  const handleDeleteConfirmation = async (itemID) => {
    try {
      await authAxios.post("/api/delete_course_completion", { id: itemID }); // Use template literal for clarity
      Swal.fire(
        "Deleted!",
        "Course Completion deleted successfully.",
        "success"
      );
      await fetchData();
    } catch (error) {
      console.error("Error deleting cadre:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the cadre.",
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

  /// Handle Update User
  const handleEditClick = async (itemID) => {
    try {
      const response = await authAxios.post("/api/course_completion_by_id", {
        id: itemID,
      });

      if (response.data.courseCompletion) {
        const dbData = response.data.courseCompletion;
        navigate(`/admin/coursecompletion/edit-coursecompletion`, {
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
                Course Details
              </ArgonTypography>
            </ArgonBox>
            <Stack spacing={1} direction="row">
              <Link to="/admin/coursecompletion/new-coursecompletion">
                <ArgonButton variant="gradient" color="info" size="small">
                  + New Course Completion
                </ArgonButton>
              </Link>
              <ArgonButton variant="outlined" color="info" size="small">
                Import
              </ArgonButton>
              <ArgonButton variant="outlined" color="info" size="small">
                Export
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

export default CourseCompletionList;