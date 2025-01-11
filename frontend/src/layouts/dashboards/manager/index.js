import PropTypes from 'prop-types';
import { Dialog, DialogContent, IconButton } from "@mui/material"; 
import { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  Card,
  Icon,
  Tooltip,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import ProductCell from "./components/ProductCell";
import Header from "../../dashboards/user/components/Header";

const bgImage = "";
const baseUrl = process.env.REACT_APP_BASE_URL;
const authAxios = axios.create({
  baseURL: baseUrl,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("pdf_excel_hash");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

function DefaultManager() {
  const [loading, setLoading] = useState(true);
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Name", accessor: "name" },
      { Header: "CNIC", accessor: "cnic" },
      { Header: "Mobile_no", accessor: "Mobile_no" },
      { Header: "Occupation", accessor: "occupation" },
      { Header: "Category", accessor: "category" },
      { Header: "Type", accessor: "type" },
      { Header: "FCNIC", accessor: "FCNIC" },
      { Header: "BCNIC", accessor: "BCNIC" },
      { Header: "Police_Verification_Document", accessor: "Police_Verification_Document" },
      { Header: "Vehicle_Documents", accessor: "Vehicle_Documents" },
      { Header: "Previous_Card_Picture", accessor: "Previous_Card_Picture" },
      { Header: "Appointment_Day", accessor: "Appointment_Day" },
      { Header: "Appointment_Time", accessor: "Appointment_Time" },
      { Header: "Remarks", accessor: "remarks" },
      { Header: "Status", accessor: "status" },
    ],
    rows: [],
  });

  const [newSlot, setNewSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [selectedImage, setSelectedImage] = useState(""); // Store selected image URL

  const fetchData = async () => {
    try {
      const imageUrl = "http://210.56.14.227:3216/uploads/";
      const response = await authAxios.get("/api/civilian_data_verified_list");
      const formattedData = response.data.civDatas.map((item, index) => ({
        ser: index + 1,
        name: item.name,
        cnic: item.cnic,
        Mobile_no: item.Mobile_no,
        occupation: item.occupation,
        category: item.category,
        type: item.type,
        BCNIC: (
          <ProductCell
            image={imageUrl + item.BCNIC}
            onClick={() => handleImageClick(imageUrl + item.BCNIC)} // Add onClick handler
          />
        ),
        FCNIC: (
          <ProductCell
            image={imageUrl + item.FCNIC}
            onClick={() => handleImageClick(imageUrl + item.FCNIC)}
          />
        ),
        Police_Verification_Document: (
          <ProductCell
            image={imageUrl + item.Police_Verification_Document}
            onClick={() => handleImageClick(imageUrl + item.Police_Verification_Document)}
          />
        ),
        Vehicle_Documents: (
          <ProductCell
            image={imageUrl + item.Vehicle_Documents}
            onClick={() => handleImageClick(imageUrl + item.Vehicle_Documents)}
          />
        ),
        Previous_Card_Picture: (
          <ProductCell
            image={imageUrl + item.Previous_Card_Picture}
            onClick={() => handleImageClick(imageUrl + item.Previous_Card_Picture)}
          />
        ),
        Appointment_Day: item.Appointment_Day,
        Appointment_Time: item.Appointment_Time,
        remarks: item.remarks,
        status: item.status === "Verified" ? (
          <Tooltip title="Verified">
            <Icon sx={{ color: "green" }}>verified_user</Icon>
          </Tooltip>
        ) : (
          <Tooltip title="Rejected">
            <Icon sx={{ color: "red" }}>remove_circle</Icon>
          </Tooltip>
        ),
      }));
      setDataTableData({ ...dataTableData, rows: formattedData });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleAddDate = () => {
    if (!newSlot) return;
    const slotExists = timeSlots.some((slot) => slot.date === newSlot);
    if (!slotExists) {
      setTimeSlots([...timeSlots, { id: Date.now(), date: newSlot, status: "enabled" }]);
      setNewSlot("");
    } else {
      Swal.fire("Error!", "This date already exists.", "error");
    }
  };
 
  
  const handleSaveDisabledDates = async () => {
    const disabledDates = timeSlots
      .filter((slot) => slot.status === "disabled")
      .map((slot) => slot.date);
  
    if (disabledDates.length === 0) {
      Swal.fire("Info", "No disabled dates to save.", "info");
      return;
    }
  
    try {
      console.log("Sending disabled dates try:", disabledDates);
      const response = await authAxios.post("/api/disabled-dates", {
        dates: disabledDates,
      });
      console.log("Response from server:", response.data);
      Swal.fire("Success", "Disabled dates saved successfully!", "success");
    } catch (error) {
      console.error("Error saving dates:", error);
      Swal.fire("Error", "Failed to save disabled dates.", "error");
    }
  
   
  };
  
  
  const handleToggleDate = (id, status) => {
    setTimeSlots((prev) =>
      prev.map((slot) =>
        slot.id === id ? { ...slot, status: status === "enabled" ? "disabled" : "enabled" } : slot
      )
    );
  };
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the clicked image URL
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <Header />
      <ArgonBox my={3}>
        <Card>
          <ArgonBox p={3} display="flex" justifyContent="space-between">
            <ArgonTypography variant="h5" fontWeight="medium">All Appts</ArgonTypography>
          </ArgonBox>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <TailSpin height={80} width={80} color="#4fa94d" />
            </div>
          ) : (
            <DataTable table={dataTableData} entriesPerPage={{ defaultValue: 7, entries: [5, 7, 10, 15, 20, 25] }} canSearch />
          )}
        </Card>
      </ArgonBox>

      <ArgonBox my={3}>
        <Card>
          <ArgonBox p={3}>
            <ArgonTypography variant="h5" fontWeight="medium">Manage Dates</ArgonTypography>
            <ArgonBox display="flex" my={2}>
              <TextField type="date" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} fullWidth />
              <ArgonButton variant="gradient" color="info" onClick={handleAddDate} sx={{ ml: 2 }}>
                Add
              </ArgonButton>
            </ArgonBox>
            {timeSlots.map((slot) => (
              <ArgonBox key={slot.id} display="flex" alignItems="center" my={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={slot.status === "enabled"}
                      onChange={() => handleToggleDate(slot.id, slot.status)}
                    />
                  }
                  label={`${slot.date} (${slot.status})`}
                />
              </ArgonBox>
            ))}
          </ArgonBox>
        </Card>
        <ArgonButton
  variant="gradient"
  color="success"
  onClick={handleSaveDisabledDates}
  sx={{ mt: 2 }}
>
  Save Disabled Dates
</ArgonButton>

      </ArgonBox>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <img src={selectedImage} alt="Full size" style={{ width: '100%', height: 'auto' }} />
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <Icon>close</Icon>
          </IconButton>
        </DialogContent>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default DefaultManager;
