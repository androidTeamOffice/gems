import { useMemo, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import { TailSpin } from "react-loader-spinner";
import { format } from "date-fns";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import ArgonButton from "components/ArgonButton";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import EventCalendar from "examples/Calendar";
import axios from "axios";
import Card from "@mui/material/Card";

// import { format } from "date-fns";
import { Description } from "@mui/icons-material";

import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  Appointments,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";

import { styled, alpha } from "@mui/material/styles";
import moment from "moment";

const PREFIX = "Demo";

const baseUrl = process.env.REACT_APP_BASE_URL;
const authAxios = axios.create({ baseURL: baseUrl });

authAxios.interceptors.request.use(
  (config) => {
    return new Promise((resolve) => {
      const token = sessionStorage.getItem("pdf_excel_hash");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(config);
    });
  },
  (error) => Promise.reject(error)
);




function DailySchedule() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const classes = {
    todayCell: `${PREFIX}-todayCell`,
    weekendCell: `${PREFIX}-weekendCell`,
    today: `${PREFIX}-today`,
    weekend: `${PREFIX}-weekend`,
  };

  const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(
    ({ theme }) => ({
      [`&.${classes.todayCell}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.14),
        },
        "&:focus": {
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
      },
      [`&.${classes.weekendCell}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        "&:hover": {
          backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
        "&:focus": {
          backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
      },
    })
  );

  const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(
    ({ theme }) => ({
      [`&.${classes.today}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
      },
      [`&.${classes.weekend}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
      },
    })
  );

  

  const CustomAppointmentTooltipContent = ({ appointmentData }) => {
    if (!appointmentData) {
      return <div>No data available</div>;
    }

    const { title, startDate, endDate, location, assignedCandidate } =
      appointmentData;
      console.log(appointmentData)

    const formattedStartDate = startDate
      ? moment(startDate).format("MMMM Do YYYY, h:mm A")
      : "Invalid date";
    const formattedEndDate = endDate
      ? moment(endDate).format("MMMM Do YYYY, h:mm A")
      : "Invalid date";

    return (
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px rgba(0,0,0)"
        }}
      >
        <h3 style={{ margin: 0, color: "black" }}>{title || "No Title"}</h3>
        <p style={{ margin: "5px 0", color: generateColor(appointmentData.id) }}>
          <strong>Start Time:</strong> {formattedStartDate}
        </p>
        <p style={{ margin: "5px 0", color: generateColor(appointmentData.id) }}>
          <strong>End Time:</strong> {formattedEndDate}
        </p>
        <p style={{ margin: "5px 0", color: generateColor(appointmentData.id) }}>
          <strong>Location:</strong> {location || "No Location"}
        </p>
        {assignedCandidate && (
          <p style={{ margin: "5px 0", color: generateColor(appointmentData.id) }}>
            <strong>Assigned To:</strong>{" "}
            {`${assignedCandidate.rank_name} ${assignedCandidate.name}`}
          </p>
        )}
      </div>
    );
  };

  


  const TimeTableCell = (props) => {
    const { startDate } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
      return (
        <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />
      );
    }
    if (date.getDay() === 0 || date.getDay() === 6) {
      return (
        <StyledWeekViewTimeTableCell
          {...props}
          className={classes.weekendCell}
        />
      );
    }
    return <StyledWeekViewTimeTableCell {...props} />;
  };

  const DayScaleCell = (props) => {
    const { startDate, today } = props;

    if (today) {
      return (
        <StyledWeekViewDayScaleCell {...props} className={classes.today} />
      );
    }
    if (startDate.getDay() === 0 || startDate.getDay() === 6) {
      return (
        <StyledWeekViewDayScaleCell {...props} className={classes.weekend} />
      );
    }
    return <StyledWeekViewDayScaleCell {...props} />;
  };

  const currentDate = moment();
  let date = currentDate.date();

  const makeTodayAppointment = (startDate, endDate) => {
    const days = moment(startDate).diff(endDate, "days");
    const nextStartDate = moment(startDate)
      .year(currentDate.year())
      .month(currentDate.month())
      .date(date);
    const nextEndDate = moment(endDate)
      .year(currentDate.year())
      .month(currentDate.month())
      .date(date + days);

    return {
      startDate: nextStartDate.toDate(),
      endDate: nextEndDate.toDate(),
    };
  };

  const fetchData = async () => {
    try {
      const response = await authAxios.get("/api/weekly_schedule");

      const appointments1 = [];
      response.data.dutiesWithSchedules.map((item) => {
        const dutyName = item.duty_name;
        item.schedules.map((sch) => {
          const dateTimeString = `${sch.start_date.split("T")[0]} ${sch.startTime}`;
          const dateTimeStringE = `${sch.end_date.split("T")[0]} ${sch.endTime}`;
          appointments1.push({
            title: dutyName + " - " + sch.assignedCandidate.rank_name + " " + sch.assignedCandidate.name,
            id: sch.sch_id,
            startDate: new Date(dateTimeString),
            endDate: new Date(dateTimeStringE),
            location: sch.assignedCandidate.location,
            assignedCandidate: sch.assignedCandidate,

          });
        });
      });

      setAppointments(
        appointments1.map(({ startDate, endDate, ...restArgs }) => {
          const result = {
            ...makeTodayAppointment(startDate, endDate),
            ...restArgs,
          };
          date += 1;
          if (date > 31) date = 1;
          return result;
        })
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  // Function to generate color based on dutyId
  function generateColor(dutyId) {
    // Generate a pseudo-random hue based on dutyId
    const hue = dutyId * 137.508; // Golden angle approximation

    // Convert HSV to RGB
    const h = (hue % 360) / 360; // Normalize hue to 0-1
    const s = 0.6; // Saturation
    const v = 0.9; // Value

    // HSV to RGB conversion formula
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r, g, b;
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    // Convert RGB to hex format
    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    const color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return color;
  }
  const Appointment = ({ children, style, ...restProps }) => {
    const appointment = restProps.data;
    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: generateColor(appointment.id),
          borderRadius: "8px",
          padding: "8px",
        }}
      >
        <div>
          <b>{appointment.title}</b>
          <br />
          <small>{moment(appointment.startDate).format("h:mm A")}</small> -{" "}
          <small>{moment(appointment.endDate).format("h:mm A")}</small>
        </div>
      </Appointments.Appointment>
    );
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
                Weekly Schedule
              </ArgonTypography>
            </ArgonBox>
            <Stack spacing={1} direction="row">
              <ArgonButton variant="outlined" color="info" size="small">
                Print
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
            <Paper>
        <Scheduler data={appointments}>
          <ViewState />
          <WeekView
            startDayHour={0}
            endDayHour={24}
            cellDuration={60}
            timeTableCellComponent={TimeTableCell}
            dayScaleCellComponent={DayScaleCell}
          />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments
            appointmentComponent={Appointment}
            data={appointments}
          />
          <AppointmentTooltip
            showCloseButton
            contentComponent={(props) => <CustomAppointmentTooltipContent {...props} />}
          />
          <AppointmentForm readOnly />
        </Scheduler>
      </Paper>
          )}
        </Card>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DailySchedule;
