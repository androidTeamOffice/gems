
import Grid from "@mui/material/Grid";

import { useState, useEffect } from "react";
// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import ArgonButton from "components/ArgonButton";
import Card from "@mui/material/Card";

// Argon Dashboard 2 PRO MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import Footer from "examples/Footer";


// Argon Dashboard 2 PRO MUI base styles
import typography from "assets/theme/base/typography";


import Header from "../../dashboards/user/components/Header";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
// import EditCadre from "../edit-cadre";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "examples/Tables/DataTable";

const bgImage = "";
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
function Verifier() {
  const { size } = typography;
  const [loading, setLoading] = useState(true);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Name", accessor: "name" },
      { Header: "Occupation", accessor: "occupation" },
      { Header: "Category", accessor: "category" },
      { Header: "Type", accessor: "type" },
      { Header: "CINC", accessor: "cnic" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });

  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/civilian_data_for_verification_list");
      const formattedData = response.data.civDatas.map((item, index) => ({
        ser: index + 1,
        name: item.name,
        occupation: item.occupation,
        category: item.category,
        type: item.type,
        cnic: item.cnic,
        action: (
          <ArgonBox display="flex" alignItems="center">
            <ArgonBox mx={2}>
              <ArgonTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => handleEditClick(item.id)}
              >
                <Tooltip title="Verify" placement="top">
                  <Icon sx={{ color: "green" }}>verified_user</Icon>
                </Tooltip>
              </ArgonTypography>
            </ArgonBox>
            <ArgonTypography
              variant="body1"
              color="secondary"
              sx={{ cursor: "pointer", lineHeight: 0 }}
              onClick={() => handleDeleteClick(item.id)}
            >
              <Tooltip title="Reject" placement="left">
                <Icon sx={{ color: "red" }}>remove_circle</Icon>
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

  useEffect(() => {
    fetchData();
  }, []);
  //// Handle Delete User
  const handleDeleteConfirmation = async (itemID,remarks) => {
    try {
      await authAxios.post("/api/reject_civdata", { id: itemID,remarks:remarks }); // Use template literal for clarity
      Swal.fire("Rejected!", "Rejected successfully.", "success");
      await fetchData();
    } catch (error) {
      console.error("Error rejecting Civillian data:", error);
      Swal.fire(
        "Error!",
        "An error occurred while rejecting the Civillian data.",
        "error"
      );
    } finally {
      setLoading(false); // Ensure loading state is updated even on errors
    }
  };
  const handleVerifyConfirmation = async (itemID) => {
    try {
      await authAxios.post("/api/verify_civData", { id: itemID }); // Use template literal for clarity
      Swal.fire("Verified!", "Verified successfully.", "success");
      await fetchData();
    } catch (error) {
      console.error("Error verifiing Civillian data:", error);
      Swal.fire(
        "Error!",
        "An error occurred while verifiing the Civillian data.",
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
      input: "text", // Adds an input field
      inputPlaceholder: "Enter remarks here...",
      inputAttributes: {
        'aria-label': 'Enter remarks' // Accessibility
      },
      showCancelButton: true,
      confirmButtonColor: "#28a745", // Green color for confirmation button
      cancelButtonColor: "#dc3545",  // Red color for cancel button
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, cancel",
      preConfirm: (remarks) => {
        // Check if remarks are provided
        if (!remarks) {
          Swal.showValidationMessage("Remarks are required to proceed.");
        } else {
          return remarks; // Return the input value if valid
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const remarks = result.value;
        handleDeleteConfirmation(itemID, remarks); // Pass itemID and remarks to handleDeleteConfirmation
      }
    });
    
  };
  const handleEditClick = (itemID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745", // Green color for confirmation button
      cancelButtonColor: "#dc3545", // Red color for cancel button
      confirmButtonText: "Yes, Verify it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleVerifyConfirmation(itemID);
      }
    });
  };

  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({
          functions: { rgba, linearGradient },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.info.main, 1),
            rgba(gradients.info.state, 1)
          )}, url(${bgImage})`,
        backgroundPositionY: "50%",
      }}
    >
      <Header />
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
                {/* All Appts */}
              </ArgonTypography>
            </ArgonBox>
            {/* <Stack spacing={1} direction="row">
              <Link to="/admin/appts/new-appt">
                <ArgonButton variant="gradient" color="info" size="small">
                  + New Appt
                </ArgonButton>
              </Link>
              <ArgonButton variant="outlined" color="info" size="small">
                Import
              </ArgonButton>
              <ArgonButton variant="outlined" color="info" size="small">
                Export
              </ArgonButton>
            </Stack> */}
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
export default Verifier;