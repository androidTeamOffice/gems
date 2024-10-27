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

function Ranks() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  //  For Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editRankId, setEditRankId] = useState(null);


  const [dataTableData, setDataTableData] = useState({
    columns: [
        { Header: "Ser", accessor: "ser" },
        { Header: "Rank Name", accessor: "rankname" },
        { Header: "Action", accessor: "action" },
      ],
      rows: [], // Initially empty array
    });
  // Define initial form data state
  const [formData, setFormData] = useState({
    rankname: "",
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClear = (event) => {
    setFormData({
      rankname: "",
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
    rankname: Yup.string().required("Rank is required"),
  });


  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/ranks_list");
      const formattedData = response.data.ranks.map((item, index) => ({
        ser: index + 1,
        rankname: item.name,
        action: (
          <ArgonBox display="flex" alignItems="center">
            <ArgonBox mx={2}>
              <ArgonTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => handleEditRank(item.id)}
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



  //// Handle Delete Rank
  const handleDeleteConfirmation = async (itemID) => {
    try {
      await authAxios.post("/api/delete_rank", { id: itemID }); // Use template literal for clarity
      Swal.fire("Deleted!", "Rank deleted successfully.", "success");
      await fetchData();
    } catch (error) {
      console.error("Error deleting rank:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the rank.",
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

  /// Handle Update Rank
  const handleEditRank = async (rankId) => {
    try {
      console.log("Fetching Rank data for ID:", rankId); // Debugging log
  
      // Fetch Rank data by ID
      const response = await authAxios.post("/api/rank_by_id", { id: rankId });
  
      console.log("API Response:", response); // Debugging log
  
      if (response.data && response.data.rank) {
        const rankData = response.data.rank;
        setFormData({
          id: rankData.id,
          rankname: rankData.name, // Assuming 'name' is the field for Rank name
        });
        setEditRankId(rankId); // Set the ID for editing
        setIsEditing(true); // Set editing mode to true
      } else {
        console.error("Rank not found:", response.data.message || "No data returned");
        Swal.fire(
          "Error",
          "Rank not found or no data returned. Please check the ID and try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error during API request:", error.response || error.message || error);
      Swal.fire(
        "Error",
        "There was an error fetching Rank details. Please try again later.",
        "error"
      );
    }
  };
  
  


  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      // Validate form data using Yup schema

      await schema.validate(formData, { abortEarly: false });

      if (isEditing) {
        console.log("FormData");
        console.log(formData);
        // Update existing rank
        response = await authAxios.post("/api/update_rank", formData);
        console.log("response" + response);

        Swal.fire("Updated!", "Rank updated successfully.", "success");
      } else {
        // Add new rank
        await authAxios.post("/api/add_rank", formData);
        console.log("response" + response);

        Swal.fire("Added!", "Rank Added successfully.", "success");
      }
      await fetchData();
      setIsEditing(false);
      setFormData({
        id: "",
        rankname: "",
      });
    } catch (error) {
      console.error("Validation error:", error);

      if (error.response) {
        // If there's a response
        const { status, data } = error.response;

        switch (status) {
          case 400: // Bad request
            console.error("Bad request:", data);
            Swal.fire(
              "Error: " + status,
              "Rank already exists. Please check and try again.",
              "error"
            );

            break;
          case 401: // Unauthorized
            console.error("Unauthorized:", data);
            Swal.fire(
              "Error: " + status,
              "You are not authorized to perform this action.",
              "error"
            );

            break;
          case 404: // Not found
            console.error("Not found:", data);
            Swal.fire(
              "Error: " + status,
              "The requested resource was not found.",
              "error"
            );

            break;
          case 500: // Internal server error
            console.error("Internal server error:", data);
            Swal.fire(
              "Error: " + status,
              "An unexpected error occurred on the server. Please try again later.",
              "error"
            );
            break;
          default:
            console.error("Unknown error:", status, data);
            Swal.fire(
              "Error: Unkown",
              "An unknown error occurred. Please try again later.",
              "error"
            );
        }
      }
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }
      setErrors(validationErrors);

      // Create a new object to store errors
    }
    /////// Data Table
  };
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
                  <ArgonTypography variant="h5">Rank</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Rank Name"
                        name="rankname"
                        value={formData.rankname}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.rankname}
                      />
                      {errors.rankname && (
                        <ErrorMessage message={errors.rankname} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox>
                  <ArgonBox mt={3}>
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      {isEditing ? "Update Rank" : "Create Rank"}
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
export default Ranks;
