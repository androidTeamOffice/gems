import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";
import DataTable from "examples/Tables/DataTable";

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
import { Box, FormControl, Input, InputLabel, Stack } from "@mui/material";
import ArgonDropzone from "components/ArgonDropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import ProductCell from "./components/ProductCell";

import PDF from "./components/Pdf";
import { PDFDownloadLink, DocumentDownloadLink } from "@react-pdf/renderer";

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

function SearchData() {
  const [errors, setErrors] = useState({});
  const [ranks, setRanks] = useState([]);
  const [btys, setBtyIds] = useState([]);
  /// For Modal
  const [open, setOpen] = useState(false);
  const [bioDataCheck, setBioDataCheck] = useState(true);
  const [contactCheck, setContactCheck] = useState(true);
  const [nokCheck, setNokCheck] = useState(true);
  const [enablePrint, setEnablePrint] = useState(true);
  const [downloadLink, setDownloadLink] = useState(null);

  /// For Modal
  const [loading, setLoading] = useState(false);
  const [trade, setTrades] = useState([]);
  const [medicalCategory, setMedicalCategory] = useState([]);
  const [armyNos, setArmyNos] = useState([]);
  const [data, setData] = useState([]);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      {
        Header: "Picture",
        accessor: "picture",
        width: "50%",
      },
      { Header: "Ser", accessor: "ser" },
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
    ],
    rows: [], // Initially empty array
  });

  const navigate = useNavigate();
  // Define initial form data state
  const [formData, setFormData] = useState({
    indlName: "",
    rank: "",
    bty_id: "",
    trade: "",
    medicalCategory: "",
    martialStatus: "",
    qualStatus: "",
    bloodGp: "",
    clCast: "",
  });
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleClose = () => {
    setOpen(false);
    handleClear();
  };
  const generatePdf = async () => {
    console.log("armyNos :");
    console.log(armyNos);
    let responsenoks = [];
    let contacts = [];
    let noks = [];
    if (nokCheck) {
      responsenoks = await authAxios.post("/api/nok_infos_by_armynos_list", {
        armyNos: armyNos,
      });
      noks = responsenoks.data.noks;
    }
    let responsecontacts = [];
    if (contactCheck) {
      responsecontacts = await authAxios.post("/api/contacts_by_armynos_list", {
        armyNos: armyNos,
      });
      contacts = responsecontacts.data.contacts;
    }

    // Define the lambda function for filtering
    const filterContacts = (searchTerm) => {
      return contacts.filter((contact) =>
        contact.soldier_id.includes(searchTerm)
      );
    };
    const filterNoks = () => {
      return noks.filter((nok) => {
        return nok.soldier_id && nok.soldier_id.includes(searchTerm);
      });
    };

    let bios = [];
    if (bioDataCheck) {
      data.map((item) => {
        bios.push({
          img: item.image,
          Army_No: item.Army_No,
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
          contacts: filterContacts(item.Army_No),
          noks: filterNoks(item.Army_No),
        });
      });
    }

    console.log("bios");
    console.log(bios);
    console.log("responsecontacts");
    console.log(responsecontacts);

    let PDFDyp = () => (
      <PDF
        data={bios}
        contactsShown={contactCheck}
        noksShown={nokCheck}
        bioDatasCheck={bioDataCheck}
        contactsCheck={contactCheck}
        noksCheck={nokCheck}
      />
    );

    // Trigger PDF download using either PDFDownloadLink or DocumentDownloadLink
    const downloadLink = (
      <PDFDownloadLink document={<PDFDyp />} fileName={`BiodataReport.pdf`}>
        {({ loading }) =>
          loading ? (
            "Loading..."
          ) : (
            <ArgonButton variant="gradient" color="error" size="medium">
              Download
            </ArgonButton>
          )
        }
      </PDFDownloadLink>
      // OR
      // <DocumentDownloadLink document={<MyDocWithUserData />} fileName={`user_${response.data.user.id}.pdf`}>
      //   {({ loading }) => (loading ? 'Loading...' : 'Download PDF')}
      // </DocumentDownloadLink>
    );

    setDownloadLink(downloadLink);
  };

  const printPdf = () => {
    generatePdf();
    // setOpen(false);
    // handleClear();
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClear = (event) => {
    setFormData({
      indlName: "",
      rank: "",
      trade: "",
      medicalCategory: "",

      martialStatus: "",
      bloodGp: "",
      clCast: "",
      qualStatus: "",

      bty_id: "",
    });
    setDownloadLink(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("formData");
      console.log(formData);
      const response = await authAxios.post("/api/search_data", formData);
      console.log(response);
      let armys = [];
      console.log("obj.Army_No");
      response.data.bioData.map((obj) => {
        console.log(obj.Army_No);
        armys.push(obj.Army_No);
      });
      console.log(armys);
      setArmyNos(armys);
      const formattedData = response.data.bioData.map((item, index) => ({
        ser: index + 1,
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
        img: item.image,
        civEducation: item.Civ_Edn,
      }));
      console.log(formattedData)
      setDataTableData({
        ...dataTableData,
        rows: formattedData,
      });
      setData(response.data.bioData);
      setLoading(false);
      handleClear();
      setEnablePrint(response.data.bioData.length === 0);
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

  const fetchLUVsData = async () => {
    try {
      const btysresponse = await authAxios.get("/api/batteries_list");
      const rankresponse = await authAxios.get("/api/ranks_list");
      const cadreresponse = await authAxios.get("/api/cadres_list");
      const medresponse = await authAxios.get("/api/medicalstatuses_list");

      setBtyIds(btysresponse.data.batterys);
      setRanks(rankresponse.data.ranks);
      setTrades(cadreresponse.data.cadres);
      setMedicalCategory(medresponse.data.medicalstatuses);
    } catch (error) {
      console.error("Error fetching ranks:", error);
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

      <ArgonBox mt={1} mb={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card>
              <ArgonBox p={2}>
                <ArgonBox mb={2}>
                  <ArgonTypography variant="h5">Search Data</ArgonTypography>
                </ArgonBox>
                <ArgonBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
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
                    <Grid item xs={12} sm={3}>
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
                    <Grid item xs={12} sm={3}>
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
                    <Grid item xs={12} sm={3}>
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
                  </Grid>
                </ArgonBox>

                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
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

                    <Grid item xs={12} sm={3}>
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

                    <Grid item xs={12} sm={3}>
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
                    <Grid item xs={12} sm={3}>
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
                  </Grid>
                </ArgonBox>
                <ArgonBox mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
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
                      Search Data
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
          <ArgonBox
            p={3}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <ArgonBox lineHeight={1}>
              <ArgonTypography variant="h5" fontWeight="medium">
                Search Data
              </ArgonTypography>
            </ArgonBox>
            <Stack spacing={1} direction="row">
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800,
                    backgroundColor: "white", // Set background color to white
                    border: "2px solid #000",
                    boxShadow: 24,
                    padding: "20px", // Increased padding for better spacing
                    borderRadius: "8px", // Optional: Rounded corners
                  }}
                >
                  <h2 id="modal-title">Select section to print</h2>
                  <ArgonBox mt={5} spacing={5}>
                    <Grid
                      style={{
                        marginBottom: "20px",
                      }}
                      container
                      spacing={1}
                    >
                      <Checkbox
                        defaultChecked={bioDataCheck}
                        value={bioDataCheck}
                        onChange={(event) =>
                          setBioDataCheck(event.target.checked)
                        }
                      />
                      <ArgonBox
                        style={{
                          marginRight: "10px",
                        }}
                        ml={0.9}
                        lineHeight={1}
                      >
                        <ArgonTypography variant="button" fontWeight="medium">
                          Bio-Data
                        </ArgonTypography>
                      </ArgonBox>
                      <Checkbox
                        defaultChecked={contactCheck}
                        value={contactCheck}
                        onChange={(event) =>
                          setContactCheck(event.target.checked)
                        }
                      />
                      <ArgonBox
                        style={{
                          marginRight: "10px",
                        }}
                        ml={0.2}
                        lineHeight={1}
                      >
                        <ArgonTypography variant="button" fontWeight="medium">
                          Contact addresses list
                        </ArgonTypography>
                      </ArgonBox>
                      <Checkbox
                        defaultChecked={nokCheck}
                        value={nokCheck}
                        onChange={(event) => setNokCheck(event.target.checked)}
                      />
                      <ArgonBox
                        style={{
                          marginRight: "10px",
                        }}
                        ml={0.2}
                        lineHeight={1}
                      >
                        <ArgonTypography variant="button" fontWeight="medium">
                          NOK's list
                        </ArgonTypography>
                      </ArgonBox>
                    </Grid>
                  </ArgonBox>
                  <ArgonButton
                    variant="contained"
                    color="primary"
                    onClick={printPdf}
                    style={{ marginTop: "10px" }}
                  >
                    Print
                  </ArgonButton>
                  <ArgonButton
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                    style={{ marginLeft: "10px", marginTop: "10px" }}
                  >
                    Cancel
                  </ArgonButton>
                  <ArgonBox my={1} style={{ textAlign: "right" }}>
                    {downloadLink && <div>{downloadLink}</div>}
                  </ArgonBox>
                </div>
              </Modal>
              <ArgonButton
                variant="outlined"
                color="error"
                disabled={enablePrint}
                onClick={handleOpen}
                size="small"
              >
                Generate Report
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
export default SearchData;
