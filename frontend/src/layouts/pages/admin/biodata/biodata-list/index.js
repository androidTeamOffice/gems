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
import ProductCell from "./components/ProductCell";
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
function BioDataList() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      {
        Header: "Picture",
        accessor: "picture",
        width: "40%",
      },
      { Header: "Army No", accessor: "armyNo" },
      { Header: "Rank", accessor: "rank" },
      { Header: "Trade", accessor: "trade" },
      { Header: "Name", accessor: "indlName" },
      { Header: "Bty", accessor: "bty" },
      { Header: "CNIC", accessor: "cnic" },
      { Header: "Father Name", accessor: "fatherName" },
      { Header: "Medical Category", accessor: "medicalCategory" },
      { Header: "Bdr Dist", accessor: "bdrDist" },
      { Header: "Sect", accessor: "sect" },
      { Header: "Marital Status", accessor: "maritalStatus" },
      { Header: "Blood Gp", accessor: "bloodGp" },
      { Header: "Cl Cast", accessor: "ciCast" },
      { Header: "DOB", accessor: "dob" },
      { Header: "DOE", accessor: "doe" },
      { Header: "TOS", accessor: "tos" },
      { Header: "DOPR", accessor: "dopr" },
      { Header: "Total Svc", accessor: "totalSvc" },
      { Header: "Remaining Svc", accessor: "remainingSvc" },
      { Header: "Svc Brackt Year", accessor: "svcBktYr" },
      { Header: "SOS", accessor: "sos" },
      { Header: "Civ Education", accessor: "civEducation" },
      { Header: "Qual Status", accessor: "qualStatus" },
      { Header: "District", accessor: "district" },
      { Header: "Lve Circle", accessor: "lveCircle" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });

  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/bio_data_list");
      console.log(response);
      const formattedData = response.data.bioData.map((item, index) => ({
        ser: index + 1,
        picture: <ProductCell image={item.image} />,
        armyNo: item.Army_No,
        rank: item.rank,
        trade: item.Trade,
        indlName: item.Name,
        bty: item.bty,
        cnic: item.CNIC_Indl,
        fatherName: item.Father_Name,
        medicalCategory: item.Med_Cat,
        bdrDist: item.Bdr_Dist,
        sect: item.Sect,
        maritalStatus: item.Md_Unmd,
        qualStatus: item.qual_unqual,
        bloodGp: item.Blood_Gp,
        ciCast: item.Cl_Cast,
        svcBktYr: item.Svc_Bkt_Years,
        totalSvc: item.Total_Svc,
        remainingSvc: item.Remaining_Svc,
        dob: new Date(item.DOB).toLocaleDateString(),
        doe: new Date(item.DOE).toLocaleDateString(),
        dopr: new Date(item.DOPR).toLocaleDateString(),
        tos: new Date(item.TOS).toLocaleDateString(),
        sos: new Date(item.SOS).toLocaleDateString(),
        civEducation: item.Civ_Edn,
        lveCircle: item.lveCircle,
        district: item.district,
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
              onClick={() => handleDeleteClick(item.Army_No)}
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
      await authAxios.post("/api/delete_bio_data", { armyNo: itemID }); // Use template literal for clarity
      Swal.fire("Deleted!", "Bio Data deleted successfully.", "success");
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
      const response = await authAxios.post("/api/bio_data_by_army_no", {
        armyNo: itemID,
      });

      if (response.data.bioData) {
        const dbData = response.data.bioData;
        navigate(`/admin/biodata/edit-biodata`, { state: { dbData } });
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
                All Bio Data
              </ArgonTypography>
            </ArgonBox>
            <Stack spacing={1} direction="row">
              <Link to="/admin/biodata/new-biodata">
                <ArgonButton variant="gradient" color="info" size="small">
                  + New Bio Data
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

export default BioDataList;
