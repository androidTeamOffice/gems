import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Container } from "@mui/material";
import ArgonSelect from "components/ArgonSelect";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;
const authAxios = axios.create({
  baseURL: baseUrl,
});

function RequiredLabel({ text }) {
  return (
    <span>
      {text} <span style={{ color: "red" }}>*</span>
    </span>
  );
}

const normalizeDate = (date) => {
  const d = new Date(date);
  return isNaN(d) ? null : d.toISOString().split("T")[0];
};

const AppointmentForm = ({ formData, setFormData }) => {
  const [appointmentData, setAppointmentData] = useState({
    appointmentDay: "",
    timeSlot: "",
  });
  const [disabledDates, setDisabledDates] = useState([]);

  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const response = await authAxios.get("/api/disabled-dates");
        const normalizedDates = response.data.dates
          .filter((date) => date.date)
          .map((date) => normalizeDate(date.date));
        setDisabledDates(normalizedDates);
      } catch (error) {
        console.error("Error fetching disabled dates:", error);
      }
    };
    fetchDisabledDates();
  }, []);

  const isDateDisabled = (date) => {
    // Ensure the date is converted to the same format as the items in disabledDates
    const dateString = date instanceof Date ? date.toISOString().split("T")[0] : date;
    return disabledDates.includes(dateString);
  };

  const handleInputChange = (event, field) => {
    const { value } = event.target || event;
    setFormData((prevData) => ({ ...prevData, [field]: value }));

    if (field === "Appointment_Day") {
      setAppointmentData((prevData) => ({
        ...prevData,
        appointmentDay: value,
      }));
    } else {
      setAppointmentData((prevData) => ({
        ...prevData,
        timeSlot: value,
      }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box flex={1} mr={2}>
          <Typography variant="subtitle2" mb={1}>
            Preferred Appointment Day
          </Typography>
          <TextField
            type="date"
            name="appointmentDay"
            value={appointmentData.appointmentDay}
            onChange={(e) => {
              if (!isDateDisabled(e.target.value)) {
                handleInputChange(e, "Appointment_Day");
              } else {
                alert("This date is not available. Please choose another date.");
              }
            }}
            fullWidth
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split("T")[0],
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box flex={1} ml={2}>
          <Typography variant="subtitle2" mb={1}>
            <RequiredLabel text="Time Slot Available" />
          </Typography>
          <ArgonSelect
            placeholder="Type and Select time slot"
            value={
              appointmentData.timeSlot
                ? {
                  label: appointmentData.timeSlot,
                  value: appointmentData.timeSlot,
                }
                : null
            }
            fullWidth
            variant="outlined"
            onChange={(e) => handleInputChange(e, "Appointment_Time")}
            options={[
              { label: "Select time slot", value: "" },
              { label: "8:00 AM - 8:30 AM", value: "8:00 AM - 8:30 AM" },
              { label: "8:30 AM - 9:00 AM", value: "8:30 AM - 9:00 AM" },
              { label: "9:00 AM - 9:30 AM", value: "9:00 AM - 9:30 AM" },
              { label: "9:30 AM - 10:00 AM", value: "9:30 AM - 10:00 AM" },
              { label: "10:00 AM - 10:30 AM", value: "10:00 AM - 10:30 AM" },
              { label: "10:30 AM - 11:30 AM", value: "10:30 AM - 11:30 AM" },
              { label: "11:30 AM - 12:00 PM", value: "11:30 AM - 12:00 PM" },
              // { label: "12:00 PM - 12:30 PM", value: "12:00 PM - 12:30 PM" },
              // { label: "12:30 PM - 1:00 PM", value: "12:30 PM - 1:00 PM" },
              // { label: "1:00 PM - 1:30 PM", value: "1:00 PM - 1:30 PM" },
              // { label: "1:30 PM - 2:00 PM", value: "1:30 PM - 2:00 PM" },
              { label: "2:00 PM - 2:30 PM", value: "2:00 PM - 2:30 PM" },
              { label: "2:30 PM - 3:00 PM", value: "2:30 PM - 3:00 PM" },
              { label: "3:00 PM - 3:30 PM", value: "3:00 PM - 3:30 PM" },
              { label: "3:30 PM - 4:00 PM", value: "3:30 PM - 4:00 PM" },
              { label: "4:00 PM - 4:30 PM", value: "4:00 PM - 4:30 PM" },
              { label: "4:30 PM - 5:00 PM", value: "4:30 PM - 5:00 PM" },
              { label: "4:30 PM - 5:00 PM", value: "4:30 PM - 5:00 PM" },
              { label: "4:30 PM - 5:00 PM", value: "4:30 PM - 5:00 PM" },
              { label: "4:30 PM - 5:00 PM", value: "4:30 PM - 5:00 PM" },

            ]}
          />
        </Box>
      </Box>

      <Typography variant="body2" color="textSecondary" align="center" mb={4}>
        Appointment Allotted: From {appointmentData.timeSlot || "N/A"} on{" "}
        {appointmentData.appointmentDay || "N/A"}
      </Typography>
    </Container>
  );
};

export default AppointmentForm;
