import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "examples/Tables/DataTable";
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonSelect from "components/ArgonSelect";
import ArgonTypography from "components/ArgonTypography";
import { TailSpin } from "react-loader-spinner";
import FormField from "./components/FormField";
const bgImage = "";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import Header from "./components/Header";

const baseUrl = process.env.REACT_APP_BASE_URL;
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

function MedicalStatus() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  //  For Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editMedicleStatusId, setEditMedicleStatusId] = useState(null);

  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Medical Status Name", accessor: "cadrename" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });
  // Define initial form data state
  const [formData, setFormData] = useState({
    medicalStatusName: "",
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClear = (event) => {
    setFormData({
        medicalStatusName: "",
    });
  };

  const handleChangeSelectRole = (event) => {
    setFormData({
      ...formData,
      role: event,
    });
  };

  const handleChangeSelectStatus = (event) => {
    setFormData({
      ...formData,
      status: event,
    });
  };

  const schema = Yup.object().shape({
    medicalStatusName: Yup.string()
      .required("Medical status name is required")
  });  


  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/medicalstatuses_list");
      console.log(response);
      const formattedData = response.data.medicalstatuses.map(
        (item, index) => ({
          ser: index + 1,
          cadrename: item.name,
          action: (
            <ArgonBox display="flex" alignItems="center">
              <ArgonBox mx={2}>
                <ArgonTypography
                  variant="body1"
                  color="secondary"
                  sx={{ cursor: "pointer", lineHeight: 0 }}
                  onClick={() => handleEditMedicleStatus(item.id)}
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
      await authAxios.post("/api/delete_medicalstatus", { id: itemID }); // Use template literal for clarity
      Swal.fire("Deleted!", "Medical status deleted successfully.", "success");
      await fetchData();
    } catch (error) {
      console.error("Error deleting Medical Status:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the medical status.",
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

  /// Handle Update MedicalStatus
  const handleEditMedicleStatus = async (MedicleStatusId) => {
    try {
      // Fetch MedicalStatus data by ID
      const response = await authAxios.post("/api/medicalstatus_by_id", {
        id: MedicleStatusId,
      });

      console.log("API Response:", response); // Debugging log

      if (response.data && response.data.medicalstatus) {
        const MedicleStatusData = response.data.medicalstatus;
        console.log(MedicleStatusData);
        setFormData({
          id: MedicleStatusData.id,
          medicalStatusName: MedicleStatusData.name, // Assuming 'name' is the field for MedicalStatus name
        });
        setEditMedicleStatusId(MedicleStatusId); // Set the ID for editing
        setIsEditing(true); // Set editing mode to true
      } else {
        console.error(
          "Medical Status not found:",
          response.data.message || "No data returned"
        );
        Swal.fire(
          "Error",
          "Medical Status not found or no data returned. Please check the ID and try again.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Error during API request:",
        error.response || error.message || error
      );
      Swal.fire(
        "Error",
        "There was an error fetching Medical Status details. Please try again later.",
        "error"
      );
    }
  };

  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      let response;
      if (isEditing) {
        response = await authAxios.post("/api/update_medicalstatus", formData);
        Swal.fire("Updated!", "Medical Status updated successfully.", "success");
      } else {
        response = await authAxios.post("/api/add_medicalstatus", formData);
        Swal.fire("Added!", "Medical Status added successfully.", "success");
      }

      await fetchData();
      setIsEditing(false);
      setFormData({
        medicalStatusName:"",
      });    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 400:
            Swal.fire("Error", "Bad request. Please check the input and try again.", "error");
            break;
          case 401:
            Swal.fire("Error", "Unauthorized. Please check your credentials.", "error");
            break;
          case 404:
            Swal.fire("Error", "Resource not found. Please check the URL and try again.", "error");
            break;
          case 500:
            Swal.fire("Error", "Server error. Please try again later.", "error");
            break;
          default:
            Swal.fire("Error", "An unknown error occurred. Please try again later.", "error");
        }
      } else {
        Swal.fire("Error", "An unexpected error occurred. Please try again later.", "error");
      }
    }
  };

  //     const validationErrors = {};
  //     if (error.inner) {
  //       error.inner.forEach((err) => {
  //         validationErrors[err.path] = err.message;
  //       });
  //     }
  //     setErrors(validationErrors);

  //     // Create a new object to store errors
  //   }
  //   /////// Data Table
  // };
  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({
          functions: { rgba, linearGradient },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.6),
            rgba(gradients.info.state, 0.6)
          )}, url(${bgImage})`,
        backgroundPositionY: "50%",
      }}
    >
      <Header />

      <ArgonBox mt={1}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <ArgonBox p={2}>
                <ArgonBox mb={2}>
                  <ArgonTypography variant="h5">Medical Status</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Medical Status Name"
                        name="medicalStatusName"
                        value={formData.medicalStatusName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.medicalStatusName}
                      />
                      {errors.medicalStatusName && (
                        <ErrorMessage message={errors.medicalStatusName} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <ArgonButton
                    variant="gradient"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    {isEditing
                      ? "Update Meical Status"
                      : "Create Medical Status"}
                  </ArgonButton>
                  <ArgonButton
                    variant="gradient"
                    color="info"
                    size="medium"
                    style={{ marginLeft: "10px" }}
                    onClick={handleClear}
                  >
                    Clear
                  </ArgonButton>
                </ArgonBox>
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      </ArgonBox>
      <ArgonBox my={3}>
        <Card>
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
function ErrorMessage({ message }) {
  return (
    <p
      style={{
        color: "red",
        fontSize: "0.8rem",
        margin: "0 0",
      }}
    >
      {message}
    </p>
  );
}
export default MedicalStatus;
