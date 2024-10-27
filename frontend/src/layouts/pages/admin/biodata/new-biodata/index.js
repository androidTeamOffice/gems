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
import Info from "./components/Info";
import ArgonInput from "components/ArgonInput";
import FormField from "./components/FormField";
import * as Yup from "yup";
// Images
const bgImage = "";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { Box, FormControl, Input, InputLabel } from "@mui/material";
import ArgonDropzone from "components/ArgonDropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

function NewBioData() {
  const [errors, setErrors] = useState({});
  const [ranks, setRanks] = useState([]);
  const [btys, setBtyIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trade, setTrades] = useState([]);
  const [lvecircle, setLeaveCircle] = useState([]);
  const [medicalCategory, setMedicalCategory] = useState([]);

  const navigate = useNavigate();
  // Define initial form data state
  const [formData, setFormData] = useState({
    armyNo: "",
    rank: "",
    trade: "",
    indlName: "",
    CNIC: "",
    fatherName: "",
    medicalCategory: "",
    bdrDist: "",
    sect: "",
    martialStatus: "",
    qualStatus: "",
    bloodGp: "",
    clCast: "",
    svcBktYears: "",
    totalSvc: "",
    remainingSvc: "",
    DOB: new Date(),
    DOE: new Date(),
    DOPR: new Date(),
    TOS: new Date(),
    SOS: new Date(),
    civEdn: "",
    image: null,
    bty_id: "",
    lve_circle_id: "",
    district: "",
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClear = (event) => {
    setFormData({
      armyNo: "",
      rank: "",
      trade: "",
      indlName: "",
      CNIC: "",
      fatherName: "",
      medicalCategory: "",
      bdrDist: "",
      sect: "",
      martialStatus: "",
      qualStatus: "",
      bloodGp: "",
      clCast: "",
      svcBktYears: "",
      totalSvc: "",
      remainingSvc: "",
      DOB: "",
      DOE: "",
      DOPR: "",
      TOS: "",
      SOS: "",
      civEdn: "",
      image: null,
      bty_id: "",
      lve_circle_id: "",
      district: "",
    });
  };
  const schema = Yup.object().shape({
    image: Yup.mixed().required("Please select an image"), // Makes the field required
    armyNo: Yup.string().required("ArmyNo is required"),
    indlName: Yup.string().required("Name is required"),
    CNIC: Yup.string().required("CNIC is required"),
    fatherName: Yup.string().required("Father Name is required"),
    bdrDist: Yup.string().required("Bdr Dist is required"),
    sect: Yup.string().required("Sect is required"),
    district: Yup.string().required("District is required"),
    bloodGp: Yup.string().required("Blood Gp is required"),
    clCast: Yup.string().required("CL Cast is required"),

    totalSvc: Yup.string().required("Total Svc is required"),
    remainingSvc: Yup.string().required("Remaining Svc is required"),

    civEdn: Yup.string().required("Civ Edn is required"),
    rank: Yup.object().shape({
      value: Yup.string().required("Rank is required"),
    }),
    bty_id: Yup.object().shape({
      value: Yup.string().required("Battery is required"),
    }),
    lve_circle_id: Yup.object().shape({
      value: Yup.string().required("Leave Circle is required"),
    }),
    trade: Yup.object().shape({
      value: Yup.string().required("Trade is required"),
    }),
    medicalCategory: Yup.object().shape({
      value: Yup.string().required("Medical Category is required"),
    }),
    martialStatus: Yup.object().shape({
      value: Yup.string().required("Marital Status is required"),
    }),
    qualStatus: Yup.object().shape({
      value: Yup.string().required("Qual Status is required"),
    }),
  });

  // Handle form submission with Yup validation
  const headers = {
    "Content-Type": "multipart/form-data", // Important for Multer
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = "";
    try {
      // Validate form data using Yup schema

      await schema.validate(formData, { abortEarly: false });

      // // If validation passes, proceed with form submission logic
      console.log(formData.image);
      response = await authAxios.post("/api/add_bio_data", formData, {
        headers,
      });
      console.log("Resposne " + response.status);
      console.log("Bio Data created successfully:", response.data);
      Swal.fire("Added!", "Bio Data Added successfully.", "success");
      navigate("/admin/biodata/biodata-list");

      // Optionally clear form data
      handleClear();
    } catch (error) {
      console.error("Validation error:", error.message);

      if (error.response) {
        // If there's a response
        const { status, data } = error.response;

        switch (status) {
          case 400: // Bad request
            console.error("Bad request:", data);
            Swal.fire(
              "Error: " + status,
              "Bio Data already exists. Please check and try again.",
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
  };
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
  const handleChangeSelectMaritalStatus = (event) => {
    setFormData({
      ...formData,
      martialStatus: event,
    });
  };
  const handleChangeSelectQualStatus = (event) => {
    setFormData({
      ...formData,
      qualStatus: event,
    });
  };
  const handleChangeSelectBattery = (event) => {
    setFormData({
      ...formData,
      bty_id: event,
    });
  };
  const handleChangeSelectLeaveCircle = (event) => {
    setFormData({
      ...formData,
      lve_circle_id: event,
    });
  };

  const fetchLUVsData = async () => {
    try {
      const btysresponse = await authAxios.get("/api/batteries_list");
      const rankresponse = await authAxios.get("/api/ranks_list");
      const cadreresponse = await authAxios.get("/api/cadres_list");
      const medresponse = await authAxios.get("/api/medicalstatuses_list");
      const lvecircleresponse = await authAxios.get("/api/leave_circle_list");

      setBtyIds(btysresponse.data.batterys);
      setRanks(rankresponse.data.ranks);
      setTrades(cadreresponse.data.cadres);
      setMedicalCategory(medresponse.data.medicalstatuses);
      setLeaveCircle(lvecircleresponse.data.lveCircle);
    } catch (error) {
      console.error("Error fetching LUVs:", error);
    }
  };

  useEffect(() => {
    fetchLUVsData();
  }, []);

  const rankoptions = ranks.map((rank) => ({
    value: rank.id,
    label: rank.name,
  }));
  const btysoptions = btys.map((bty) => ({
    value: bty.id,
    label: bty.name,
  }));
  const cadreoptions = trade.map((trades) => ({
    value: trades.id,
    label: trades.name,
  }));
  const medoptions = medicalCategory.map((med) => ({
    value: med.id,
    label: med.name,
  }));
  const lvecircleoptions = lvecircle.map((lvecircle) => ({
    value: lvecircle.id,
    label: lvecircle.name,
  }));

  const handleDateChange = (dateString, field) => {
    console.log("Date" + dateString);
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      // Handle invalid date
      console.error("Invalid date:", dateString);
      return;
    }
    // Adjust the date to account for time zone offset
    const offset = date.getTimezoneOffset(); // Get the time zone offset in minutes
    date.setMinutes(date.getMinutes() - offset); // Subtract the offset from the date
  
    const formattedDate = date.toISOString().split("T")[0];
    console.log("Formatted Date" + formattedDate);
  
    // If the field is DOE, calculate total service and update the state
    if (field === "DOE") {
      const enrollmentDate = new Date(date);
      console.log(enrollmentDate)
      const totalService = calculateTotalService(enrollmentDate);
      console.log(calculateTotalService(enrollmentDate));
  
      // Update both the DOE and totalSvc fields in formData state
      setFormData((prevState) => ({
        ...prevState,
        [field]: formattedDate,
        totalSvc: totalService,
      }));
    } else {
      // For other date fields, just update the corresponding field
      setFormData((prevState) => ({
        ...prevState,
        [field]: formattedDate,
      }));
    }
  };
  

  const calculateTotalService = (enrollmentDate) => {
    const currentDate = new Date(); // Current date

    // Calculate total milliseconds difference
    let difference = currentDate - enrollmentDate;

    // Calculate years
    const years = Math.floor(difference / (365 * 24 * 60 * 60 * 1000));
    difference -= years * (365 * 24 * 60 * 60 * 1000);

    // Calculate months
    const months = Math.floor(difference / (30 * 24 * 60 * 60 * 1000));
    difference -= months * (30 * 24 * 60 * 60 * 1000);


    // Calculate days
    const days = Math.floor(difference / (24 * 60 * 60 * 1000));

    return `${years} years, ${months} months, ${days} days`;
  };
  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      setLoading(true);
      const imageData = e.target.result;
      // Send image data to backend (see next step)
      // sendDataToServer(imageData, file.name); // Assuming you have a sendDataToServer function
      console.log("imageData");
      console.log(imageData);
      setFormData({
        ...formData,
        image: imageData,
      });
    };
    setLoading(false);
    reader.readAsDataURL(file);
  };

  const renderImageOrPlaceholder = () => {
    if (loading) {
      return (
        <ArgonBox
          component="img"
          src={formData.image}
          alt="Uploaded Image"
          borderRadius="lg"
          shadow="lg"
          width={300}
          height={200}
          my={3}
        />
      );
    } else {
      return (
        <ArgonTypography variant="body1" color="secondary">
          No image found
        </ArgonTypography>
      );
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
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: "100%" }}>
              <ArgonBox p={3}>
                {renderImageOrPlaceholder()}
                <Grid item>
                  <ArgonBox mt={2}>
                    <ArgonBox
                      mb={1}
                      ml={0.5}
                      lineHeight={0}
                      display="inline-block"
                    ></ArgonBox>
                    <Input
                      id="image-upload"
                      type="file"
                      name="image"
                      enctype="multipart/form-data"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                      inputProps={{ "aria-label": "upload image" }}
                      endAdornment={
                        <Box component="span" mt={1} ml={1}>
                          <CloudUploadIcon />
                        </Box>
                      }
                    />
                    {errors.image && <ErrorMessage message={errors.image} />}
                  </ArgonBox>
                </Grid>
              </ArgonBox>
            </Card>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Card>
              <ArgonBox p={2}>
                <ArgonBox mb={2}>
                  <ArgonTypography variant="h5">BioData</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Army No"
                        name="armyNo"
                        value={formData.armyNo}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.armyNo}
                      />
                      {errors.armyNo && (
                        <ErrorMessage message={errors.armyNo} />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox>
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
                            Rank
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Rank"
                          id="rank"
                          name="rank"
                          value={formData.rank} // Access value from state
                          onChange={handleChangeSelectRank}
                          fullWidth
                          error={!!errors.rank}
                          options={rankoptions}
                          onInputChange={(event) => {
                            setErrors({ ...errors, rank: undefined });
                          }}
                        />
                        {errors.rank && (
                          <ErrorMessage message="Please select Rank." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox>
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
                            Trade
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Trade"
                          id="trade"
                          name="trade"
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
                        )}
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Name"
                        name="indlName"
                        value={formData.indlName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.indlName}
                      />
                      {errors.indlName && (
                        <ErrorMessage message={errors.indlName} />
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="CNIC"
                        name="CNIC"
                        value={formData.CNIC}
                        onChange={handleChange}
                        fullWidth
                        placeholder="12345-1234567-1"
                        maxLength={15}
                        error={!!errors.CNIC}
                      />
                      {errors.CNIC && <ErrorMessage message={errors.CNIC} />}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Father Name"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.fatherName}
                      />
                      {errors.fatherName && (
                        <ErrorMessage message={errors.fatherName} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox>
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

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Brd Dist"
                        name="bdrDist"
                        value={formData.bdrDist}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.bdrDist}
                      />
                      {errors.bdrDist && (
                        <ErrorMessage message={errors.bdrDist} />
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Sect"
                        name="sect"
                        value={formData.sect}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.sect}
                      />
                      {errors.sect && <ErrorMessage message={errors.sect} />}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox>
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
                            Marital Status
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Marital Status"
                          id="meritalStatus"
                          name="meritalStatus"
                          value={formData.martialStatus} // Access value from state
                          onChange={handleChangeSelectMaritalStatus}
                          fullWidth
                          error={!!errors.martialStatus}
                          options={[
                            { value: "single", label: "Single" },
                            { value: "married", label: "Married" },
                          ]}
                          onInputChange={(event) => {
                            setErrors({
                              ...errors,
                              martialStatus: undefined,
                            });
                          }}
                        />
                        {errors.martialStatus && (
                          <ErrorMessage message="Please select Marital Status." />
                        )}
                      </ArgonBox>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Blood Group"
                        name="bloodGp"
                        value={formData.bloodGp}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.bloodGp}
                      />
                      {errors.bloodGp && (
                        <ErrorMessage message={errors.bloodGp} />
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Cl Cast"
                        name="clCast"
                        value={formData.clCast}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.clCast}
                      />
                      {errors.clCast && (
                        <ErrorMessage message={errors.clCast} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                      >
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          mt={1}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                          >
                            DOB
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.DOB}
                          onChange={(date) => handleDateChange(date, "DOB")}
                        />
                      </ArgonBox>
                    </Grid>

                    <Grid item xs={4}>
                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                      >
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          mt={1}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                          >
                            DOE
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.DOE}
                          onChange={(date) => handleDateChange(date, "DOE")}
                        />
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                      >
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          mt={1}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                          >
                            TOS
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.TOS}
                          onChange={(date) => handleDateChange(date, "TOS")}
                        />
                      </ArgonBox>

                      {errors.TOS && <ErrorMessage message={errors.TOS} />}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                      >
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          mt={1}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                          >
                            DOPR
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.DOPR}
                          onChange={(date) => handleDateChange(date, "DOPR")}
                        />
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Total Svc"
                        name="totalSvc"
                        value={formData.totalSvc}
                        readOnly
                        fullWidth
                        error={!!errors.totalSvc}
                      />
                      {errors.totalSvc && (
                        <ErrorMessage message={errors.totalSvc} />
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Remaining Svc"
                        name="remainingSvc"
                        value={formData.remainingSvc}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.remainingSvc}
                      />
                      {errors.remainingSvc && (
                        <ErrorMessage message={errors.remainingSvc} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox>
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
                            Qual Status
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Qual Status"
                          id="qualStatus"
                          name="qualStatus"
                          value={formData.qualStatus} // Access value from state
                          onChange={handleChangeSelectQualStatus}
                          fullWidth
                          error={!!errors.qualStatus}
                          options={[
                            { value: "Unqual", label: "Unqual" },
                            { value: "Qual", label: "Qual" },
                          ]}
                          onInputChange={(event) => {
                            setErrors({
                              ...errors,
                              qualStatus: undefined,
                            });
                          }}
                        />
                        {errors.qualStatus && (
                          <ErrorMessage message="Please select Qual Status." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        height="100%"
                      >
                        <ArgonBox
                          mb={1}
                          ml={0.5}
                          mt={1}
                          lineHeight={0}
                          display="inline-block"
                        >
                          <ArgonTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                          >
                            SOS
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonDatePicker
                          value={formData.SOS}
                          onChange={(date) => handleDateChange(date, "SOS")}
                        />
                      </ArgonBox>

                      {errors.SOS && <ErrorMessage message={errors.SOS} />}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="Civ Education"
                        name="civEdn"
                        value={formData.civEdn}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.civEdn}
                      />
                      {errors.civEdn && (
                        <ErrorMessage message={errors.civEdn} />
                      )}
                    </Grid>
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
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
                            Battery
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Battery"
                          id="bty_id"
                          name="bty_id"
                          value={formData.bty_id} // Access value from state
                          onChange={handleChangeSelectBattery}
                          fullWidth
                          error={!!errors.bty_id}
                          options={btysoptions}
                          onInputChange={(event) => {
                            setErrors({
                              ...errors,
                              bty_id: undefined,
                            });
                          }}
                        />
                        {errors.bty_id && (
                          <ErrorMessage message="Please select Battery." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                            Leave Circle
                          </ArgonTypography>
                        </ArgonBox>
                        <ArgonSelect
                          label="Leave Circle"
                          id="lve_circle_id"
                          name="lve_circle_id"
                          value={formData.lve_circle_id} // Access value from state
                          onChange={handleChangeSelectLeaveCircle}
                          fullWidth
                          error={!!errors.lve_circle_id}
                          options={lvecircleoptions}
                          onInputChange={(event) => {
                            setErrors({
                              ...errors,
                              lve_circle_id: undefined,
                            });
                          }}
                        />
                        {errors.lve_circle_id && (
                          <ErrorMessage message="Please select Leave Circle." />
                        )}
                      </ArgonBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        label="District"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.district}
                      />
                      {errors.district && (
                        <ErrorMessage message={errors.district} />
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
                      Create Bio Data
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
export default NewBioData;
