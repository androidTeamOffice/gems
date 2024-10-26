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

function Batteries() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const location = useLocation();

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  //  For Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editBatteryId, setEditBatteryId] = useState(null);
  const batteryData = location.state?.dbData;



  const [dataTableData, setDataTableData] = useState({
    columns: [
        { Header: "Ser", accessor: "ser" },
        { Header: "Battery Name", accessor: "batteryname" },
        { Header: "Battery Capacity", accessor: "batterycapacity" },
        { Header: "Location", accessor: "location" },
        { Header: "Action", accessor: "action" },
      ],
      rows: [], // Initially empty array
    });


  // Define initial form data state
  const [formData, setFormData] = useState({
    id: batteryData ? batteryData.id : "",
    batteryname: batteryData ? batteryData.name : "",
    capacity: batteryData ? batteryData.capacity : "",
    locationId: batteryData
      ? {
          value: batteryData.loc_id,
          label: batteryData.loc_name,
        }
      : {
          value: "",
          label: "",
        },
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClear = (event) => {
    setFormData({
      batteryname: "",
      capacity: "",
      locationId: "",
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
    batteryname: Yup.string().required("Battery name is required"),
    capacity: Yup.string().required("Battery capacity is required"),
    locationId: Yup.object().shape({
      value: Yup.string().required("Location is required"),
    }),
  });

  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/batteries_list");

      const formattedData = response.data.batterys.map((item, index) => ({
        ser: index + 1,
        batteryname: item.name,
        batterycapacity: item.capacity,
        location: item.loc_name,
        action: (
          <ArgonBox display="flex" alignItems="center">
            <ArgonBox mx={2}>
              <ArgonTypography
                variant="body1"
                color="secondary"
                sx={{ cursor: "pointer", lineHeight: 0 }}
                onClick={() => handleEditBatteries(item.id)}
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
      await authAxios.post("/api/delete_battery", { id: itemID }); // Use template literal for clarity
      Swal.fire("Deleted!", "Battery deleted successfully.", "success");
      await fetchData();
    } catch (error) {
      console.error("Error deleting duty:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the duty.",
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

  /// Handle Update Batteries
  const handleEditBatteries = async (itemID) => {
    try {
      console.log("Fetching Batteries data for ID:", itemID); // Debugging log
  
      // Fetch Batteries data by ID
      const response = await authAxios.post("/api/battery_by_id", { id: itemID });
  
      console.log("API Response:", response.data); // Debugging log
  
      if (response.data && response.data.battery) {
        const batteryData = response.data.battery;
        setFormData({
            id:itemID,
          batteryname: batteryData.name, 
          capacity: batteryData.capacity,
          locationId: {
            value: batteryData.loc_id,
            label:batteryData.loc_name},
        });
        setEditBatteryId(itemID); // Set the ID for editing
        setIsEditing(true); // Set editing mode to true
      } else {
        console.error("Batteries not found:", response.data.message || "No data returned");
        Swal.fire(
          "Error",
          "Batteries not found or no data returned. Please check the ID and try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error during API request:", error.response || error.message || error);
      Swal.fire(
        "Error",
        "There was an error fetching Batteries details. Please try again later.",
        "error"
      );
    }
  };
  
  


  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    console.log(batteryData)


    try {
      // Validate form data using Yup schema

      await schema.validate(formData, { abortEarly: false });
      const submitData = {
        ...formData,
        locationId: formData.locationId.value,
      };

      if (isEditing) {
        console.log("FormData");
        console.log(submitData);
        // Update existing Batteries
        response = await authAxios.post("/api/update_battery", submitData);
        console.log("response" + response);

        Swal.fire("Updated!", "Battery updated successfully.", "success");
      } else {
        // Add new Batteries
        await authAxios.post("/api/add_battery", submitData);
        console.log("response" + response);

        Swal.fire("Added!", "Battery Added successfully.", "success");
      }
      await fetchData();
      setIsEditing(false);
      setFormData({
          batteryname: "", 
          capacity: "",
          locationId: "",
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
              "Battery already exists. Please check and try again.",
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

  //  Handling Location from DB
  const fetchLocations = async () => {
    try {
      const response = await authAxios.get("/api/locations_list");
      setLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const options = locations.map((location) => ({
    value: location.id,
    label: location.name,
  }));
  
  const handleChangeSelectLocation = (event) => {
    setFormData({
      ...formData,
      locationId: event,
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
                  <ArgonTypography variant="h5">Battery</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Battery Name"
                        name="batteryname"
                        value={formData.batteryname}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.batteryname}
                      />
                      {errors.batteryname && (
                        <ErrorMessage message={errors.batteryname} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Battery Capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.capacity}
                      />
                      {errors.capacity && (
                        <ErrorMessage message={errors.capacity} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ArgonBox mb={1}>
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            Location
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Location"
                          id="locationId"
                          name="locationId"
                          value={formData.locationId}
                          onChange={handleChangeSelectLocation}
                          fullWidth
                          options={options}
                          error={!!errors.locationId}
                          onInputChange={(event) => {
                            setErrors({ ...errors, status: undefined });
                          }}
                        />
                        {errors.status && (
                          <ErrorMessage message="Please select a Status for the user." />
                        )}
                      </ArgonBox>
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
                      {isEditing ? "Update Battery" : "Create Battery"}
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
export default Batteries;
