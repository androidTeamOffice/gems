import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";

// Argon Dashboard 2 PRO MUI components
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonSelect from "components/ArgonSelect";
import ArgonTypography from "components/ArgonTypography";
import ArgonAlert from "components/ArgonAlert";
import ArgonDatePicker from "components/ArgonDatePicker";

// Argon Dashboard 2 PRO MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

// NewProduct page components
import Header from "./components/Header";

import ArgonInput from "components/ArgonInput";
import FormField from "./components/FormField";
import * as Yup from "yup";
// Images
const bgImage = "";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { EmojiEmotions } from "@mui/icons-material";

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

function EditEmployee() {
  const [errors, setErrors] = useState({});
  const [ranks, setRanks] = useState([]);
  const [trade, setTrades] = useState([]);
  const [locations, setLocations] = useState([]);
  const [medicalCategory, setMedicalCategory] = useState([]);
  const [armyNo, setArmyNo] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const employeeData = location.state?.dbData || {};

  // Define initial form data state
  const [formData, setFormData] = useState({
    id: employeeData.id || "",
    armyNo: employeeData.Army_No,
    rank: employeeData.rank_name,
    trade: employeeData.cadre_name,
    // armyNo: {
    //   value: employeeData.Army_No,
    //   label: employeeData.Army_No,
    // },
    // rank: {
    //   value: employeeData.rank_id,
    //   label: employeeData.rank_name,
    // },
    // trade: {
    //   value: employeeData.cadre_id,
    //   label: employeeData.cadre_name,
    // },
    indlName: employeeData.name,
    remarks: employeeData.remarks,
    medicalCategory: {
      value: employeeData.medical_status_id,
      label: employeeData.medical_status_name,
    },
    loc_id: {
      value: employeeData.loc_id,
      label: employeeData.loc_name,
    },
    available: {
      value: employeeData.available,
      label: employeeData.available === "yes" ? "Yes" : "No",
    },
  });

  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleChangeSelectAvailability = (event) => {
    setFormData({
      ...formData,
      available: event,
    });
  };
  const handleClear = (event) => {
    setFormData({
      armyNo: "",
      rank: "",
      trade: "",
      loc_id: "",
      indlName: "",
      remarks: "",
      medicalCategory: "",
      available: "",
    });
  };
  const schema = Yup.object().shape({
    indlName: Yup.string().required("Name is required"),

    // armyNo: Yup.object().shape({
    //   value: Yup.string().required("Army No is required"),
    // }),
    // rank: Yup.object().shape({
    //   value: Yup.string().required("Rank is required"),
    // }),
    // trade: Yup.object().shape({
    //   value: Yup.string().required("Trade is required"),
    // }),
    medicalCategory: Yup.object().shape({
      value: Yup.string().required("Medical Category is required"),
    }),
    available: Yup.object().shape({
      value: Yup.string().required("Availability is required"),
    }),
  });

  const handleChangeSelectRank = (event) => {
    setFormData({
      ...formData,
      rank: event,
    });
  };
  const handleChangeSelectTrade = (event) => {
    setFormData({
      ...formData,
      trade: event,
    });
  };
  const handleChangeSelectMedicalCategory = (event) => {
    setFormData({
      ...formData,
      medicalCategory: event,
    });
  };
  // const handleChangeSelectArmyNo = (event) => {
  //   setFormData({
  //     ...formData,
  //     armyNo: event,
  //   });
  // };
  const handleChangeSelectLocation = (event) => {
    setFormData({
      ...formData,
      loc_id: event,
    });
  };
  const fetchLUVsData = async () => {
    try {
      // const rankresponse = await authAxios.get("/api/ranks_list");
      // const cadreresponse = await authAxios.get("/api/cadres_list");
      const medresponse = await authAxios.get("/api/medicalstatuses_list");
      // const armynoresponse = await authAxios.get("/api/bio_data_list");
      const response = await authAxios.get("/api/locations_list");

      // setArmyNo(armynoresponse.data.bioData);
      // setRanks(rankresponse.data.ranks);
      // setTrades(cadreresponse.data.cadres);
      setMedicalCategory(medresponse.data.medicalstatuses);
      setLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  useEffect(() => {
    fetchLUVsData();
  }, []);

  // const armynooptions = armyNo.map((armyno) => ({
  //   value: armyno.Army_No,
  //   label: armyno.Army_No,
  // }));
  // const rankoptions = ranks.map((rank) => ({
  //   value: rank.id,
  //   label: rank.name,
  // }));
  // const cadreoptions = trade.map((trades) => ({
  //   value: trades.id,
  //   label: trades.name,
  // }));
  const medoptions = medicalCategory.map((med) => ({
    value: med.id,
    label: med.name,
  }));
  const options = locations.map((location) => ({
    value: location.id,
    label: location.name,
  }));

  // Handle form submission with Yup validation
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      await schema.validate(formData, { abortEarly: false });
      const hasChanges = Object.values(formData).some(
        (value, index) => value !== employeeData[Object.keys(formData)[index]]
      );
      if (hasChanges) {
        response = await authAxios.post("/api/update_employee", formData);
        console.log("Response: " + response.status);
        console.log("Employee updated successfully:", response.data);
        Swal.fire("Updated!", "Employee updated successfully.", "success");
        handleClear();
        navigate("/admin/employee/employee-list");
      } else {
        console.log("No changes detected. Update not sent.");
        Swal.fire("Info", "No changes detected. Employee not updated.", "info");
      }
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
              "Employee already exists. Please check and try again.",
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
    }
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

      <ArgonBox mt={1} mb={20}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <ArgonBox p={2}>
                <ArgonBox mb={2}>
                  <ArgonTypography variant="h5">Employee</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ArgonBox mb={1}>
                        <FormField
                          label="ArmyNo"
                          name="armyNo"
                          value={formData.armyNo}
                          onChange={handleChange}
                          fullWidth
                          disabled
                          error={!!errors.armyNo}
                        />
                        {/* <ArgonBox
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
                            Army No
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Army No"
                          id="armyNo"
                          name="armyNo"
                          value={formData.armyNo}
                          onChange={handleChangeSelectArmyNo}
                          fullWidth
                          disabled
                          options={armynooptions}
                          error={!!errors.armyNo}
                          onInputChange={(event) => {
                            setErrors({ ...errors, armyNo: undefined });
                          }}
                        />
                        {errors.armyNo && (
                          <ErrorMessage message="Please select ArmyNo." />
                        )} */}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ArgonBox mb={1}>
                        <FormField
                          label="Rank"
                          name="rank"
                          value={formData.rank}
                          onChange={handleChange}
                          fullWidth
                          disabled
                          error={!!errors.rank}
                        />
                        {/* <ArgonBox
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
                            Rank
                          </ArgonTypography>
                        </ArgonBox> */}
                        {/* <ArgonSelect
                          label="Rank"
                          id="rank"
                          name="rank"
                          disabled
                          value={formData.rank} // Access value from state
                          onChange={handleChangeSelectRank}
                          fullWidth
                          error={!!errors.rank}
                          options={rankoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, rank: undefined });
                          }}
                        /> */}
                        {/* {errors.rank && (
                          <ErrorMessage message="Please select Rank." />
                        )} */}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ArgonBox mb={1}>
                        <FormField
                          label="Trade"
                          name="trade"
                          value={formData.trade}
                          onChange={handleChange}
                          fullWidth
                          disabled
                          error={!!errors.rank}
                        />
                        {/* <ArgonBox
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
                            Trade
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Trade"
                          id="trade"
                          name="trade"
                          disabled
                          value={formData.trade} // Access value from state
                          onChange={handleChangeSelectTrade}
                          fullWidth
                          error={!!errors.trade}
                          options={cadreoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, trade: undefined });
                          }}
                        />
                        {errors.trade && (
                          <ErrorMessage message="Please select Trade." />
                        )} */}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Name"
                        name="indlName"
                        value={formData.indlName}
                        onChange={handleChange}
                        fullWidth
                        disabled
                        error={!!errors.indlName}
                      />
                      {errors.indlName && (
                        <ErrorMessage message={errors.indlName} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
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
                            Medical Category
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Medical Category"
                          id="medicalCategory"
                          name="medicalCategory"
                          value={formData.medicalCategory} // Access value from state
                          onChange={handleChangeSelectMedicalCategory}
                          fullWidth
                          error={!!errors.medicalCategory}
                          options={medoptions}
                          onInputChange={(event) => {
                            setErrors({
                              ...errors,
                              medicalCategory: undefined,
                            });
                          }}
                        />
                        {errors.medicalCategory && (
                          <ErrorMessage message="Please select Medical Category." />
                        )}
                      </ArgonBox>
                    </Grid>
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
                          id="loc_id"
                          name="loc_id"
                          value={formData.loc_id}
                          onChange={handleChangeSelectLocation}
                          fullWidth
                          options={options}
                          error={!!errors.loc_id}
                          onInputChange={(event) => {
                            setErrors({ ...errors, status: undefined });
                          }}
                        />
                        {errors.loc_id && (
                          <ErrorMessage message="Please select a Loc for the Employee." />
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ArgonBox mb={3}>
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
                            Available
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Available"
                          id="available"
                          name="available"
                          value={formData.available}
                          onChange={handleChangeSelectAvailability}
                          fullWidth
                          error={!!errors.status}
                          defaultValue={{ value: "yes", label: "Yes" }}
                          options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ]}
                          onInputChange={(event) => {
                            setErrors({ ...errors, available: undefined });
                          }}
                        />
                        {errors.available && (
                          <ErrorMessage message="Please select a Availability for the Employee." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        label="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.remarks}
                      />
                      {errors.remarks && (
                        <ErrorMessage message={errors.remarks} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox>
                  <ArgonBox mt={3} display="flex">
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      size="medium"
                      onClick={handleSubmit}
                    >
                      Update Employee
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
export default EditEmployee;
