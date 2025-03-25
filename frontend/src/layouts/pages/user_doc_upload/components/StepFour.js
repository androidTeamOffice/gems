import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import ArgonSelect from "components/ArgonSelect";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createGlobalStyle } from "styled-components";
const baseUrl = process.env.REACT_APP_BASE_URL;
const authAxios = axios.create({ baseURL: baseUrl });

const CalendarStyles = createGlobalStyle`
  .react-calendar .highlighted {
    background-color: #ffcccc !important;
    color: #d32f2f !important;
    border-radius: 5px;
  }
`;

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
  const [disabledSlots, setDisabledSlots] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    appointmentDay: "",
    timeSlot: "",
  });
  const [disabledDates, setDisabledDates] = useState([]);
  const [currentDated, setCurrentDated] = useState(new Date().toISOString().split("T")[0]);

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

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const currentDate1 = new Date();
        const newDate = new Date(currentDate1);
        newDate.setDate(currentDate1.getDate() + 2);
        const currentDate = newDate.toISOString().split("T")[0];
        setCurrentDated(currentDate);

        const response = await authAxios.get(`/api/appointmentSlots?date=${currentDate}`);

        if (response.data.success) {
          const disabled = response.data.slots
            .filter((slot) => slot.bookings >= 10)
            .map((slot) => slot.time);
          setDisabledSlots(disabled);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, []);

  useEffect(() => {
    const allTimeSlots = [
      "8:00 AM - 8:30 AM",
      "8:30 AM - 9:00 AM",
      "9:00 AM - 9:30 AM",
      "9:30 AM - 10:00 AM",
      "10:00 AM - 10:30 AM",
      "10:30 AM - 11:30 AM",
      "11:30 AM - 12:00 PM",
      "2:00 PM - 2:30 PM",
      "2:30 PM - 3:00 PM",
      "3:00 PM - 3:30 PM",
      "3:30 PM - 4:00 PM",
      "4:00 PM - 4:30 PM",
      "4:30 PM - 5:00 PM",
    ];

    const options = allTimeSlots.map((slot) => ({
      label: slot,
      value: slot,
      isDisabled: disabledSlots.includes(slot),
    }));

    setTimeOptions(options);
  }, [disabledSlots]);

  const isDateDisabled = (date) => {
    const dateString = date instanceof Date ? date.toISOString().split("T")[0] : date;
    return disabledDates.includes(dateString);
  };

  const handleDateChange = (selectedDate) => {
    if (!isDateDisabled(selectedDate)) {
      setAppointmentData((prevData) => ({
        ...prevData,
        appointmentDay: selectedDate.toISOString().split("T")[0],
      }));
      setFormData((prevData) => ({
        ...prevData,
        Appointment_Day: selectedDate.toISOString().split("T")[0],
      }));
    } else {
      alert("This date is not available. Please choose another date.");
    }
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
      <CalendarStyles />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box flex={1} mr={2}>
          <Typography variant="subtitle2" mb={1}>
            Preferred Appointment Day
          </Typography>
          {/* Replaced TextField with react-calendar */}
          {Calendar &&
          <Calendar
            onChange={handleDateChange}
            tileClassName={({ date }) => {
              const dateString = date.toISOString().split("T")[0];
              return disabledDates.includes(dateString) ? "highlighted" : "";
            }}
            minDate={new Date(currentDated)}
          />}
        </Box>

        <Box flex={1} ml={2}>
          <Typography variant="subtitle2" mb={1}>
            <RequiredLabel text="Time Slot Available" />
          </Typography>
          <ArgonSelect
            name="appointmentTime"
            placeholder="Type and Select time slot"
            value={
              appointmentData.timeSlot
                ? { label: appointmentData.timeSlot, value: appointmentData.timeSlot }
                : null
            }
            fullWidth
            variant="outlined"
            onChange={(e) => {
              if (!e.isDisabled) handleInputChange(e, "Appointment_Time");
            }}
            options={timeOptions}
            isOptionDisabled={(option) => option.isDisabled}
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
