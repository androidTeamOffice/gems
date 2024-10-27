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
function NOKList() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Army No", accessor: "armyNo" },
      { Header: "Rank", accessor: "rank" },
      { Header: "Trade", accessor: "trade" },
      { Header: "Name", accessor: "indlName" },
      { Header: "Bty", accessor: "bty" },
      { Header: "Nok Name", accessor: "name" },
      { Header: "Relation", accessor: "relation" },
      { Header: "address", accessor: "address" },
      { Header: "Contact No", accessor: "contactNo" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });

  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/nok_infos_list");
      const formattedData = response.data.noks.map((item, index) => ({
        ser: index + 1,
        armyNo: item.Army_No,
        rank: item.rank_name,
        trade: item.cadre_name,
        indlName: item.name,
        bty: item.bty,
        name: item.ni_name,
        relation: item.relation,
        address: item.address,
        contactNo: item.contact_no,
        action: (
          <ArgonBox display="flex" alignItems="center">
            <ArgonBox mx={2}>
              <ArgonTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => handleEditClick(item.Army_No)}
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

  useEffect(() => {
    fetchData();
  }, []);
  //// Handle Delete User
  const handleDeleteConfirmation = async (itemID) => {
    try {
      await authAxios.post("/api/delete_nok_info", { id: itemID }); // Use template literal for clarity
      Swal.fire("Deleted!", "NOK deleted successfully.", "success");
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
      const response = await authAxios.post("/api/nok_info_by_army_no", {
        armyNo: itemID,
      });

      if (response.data.nokInfo) {
        const dbData = response.data.nokInfo;
        navigate(`/admin/nok/edit-nok/`, { state: { dbData } });
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
                All NOK
              </ArgonTypography>
            </ArgonBox>
            <Stack spacing={1} direction="row">
              <Link to="/admin/nok/new-nok">
                <ArgonButton variant="gradient" color="info" size="small">
                  + New NOK
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

export default NOKList;
