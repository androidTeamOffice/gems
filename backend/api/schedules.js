
const express = require("express");
const pool = require("../db/db"); // Assuming the file is named db.js
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addScheduleToDatabase,
  findScheduleByArmyNoAndStartEndDateTime,
  findScheduleById,
  updateScheduleInDatabase,
  countScheduleByArmyNoAndDate,
  getAllSchedules,
  deleteSchedule,
  countSchedule4HourGapByArmyNoAndDateAndStartTime,
  getDailySchedule,
  getWeeklySchedules,
} = require("../models/schedule"); // Assuming the file is named schedule.js
const { findLeaveById, empOnLeave } = require("../models/leave");
const { findDutyOccuranceInDayById,
  findEmployeeLeavesOnDate,
  getAllDuties } = require("../models/duty");
const {
  findEmployees,
  findAvailableEmployees,
} = require("../models/employee");
const { end } = require("../db/db");

require("dotenv").config();
const moment = require('moment-timezone');
const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
async function getAvailableEmployees(date, startTime, endTime, dutyId) {
  try {
    // Get all employees
    const [allEmployees] = await pool.query("SELECT * FROM employees");

    // Filter out employees on leave
    const availableEmployees = await Promise.all(
      allEmployees.map(async (employee) => {
        const isOnLeave = await checkForEmployeeLeave(employee.id, date);
        const hasConflict = await findConflictingSchedules(employee.id, date, startTime, endTime, dutyId);
        return !isOnLeave && !hasConflict.length;
      })
    );

    // Filter and return employees who are available
    return allEmployees.filter((_, index) => availableEmployees[index]);
  } catch (error) {
    console.error("Error getting available employees:", error);
    throw error;
  }
}



const getLeaveDates = async (emp_id) => {
  // Replace this with your actual database query
  const query = 'SELECT start_date, end_date FROM leaves WHERE employee_id = ?';
  const [rows] = await pool.query(query, [emp_id]);

  return rows.map(row => ({
    start_date: new Date(row.start_date), // Ensure conversion to Date object
    end_date: new Date(row.end_date) // Ensure conversion to Date object
  }));
};



// Function to delete all schedules from the database
async function deleteAllSchedules() {
  try {
    const query = 'DELETE FROM schedules'; // SQL query to delete all records from the 'schedules' table
    await pool.query(query);
    return true;
  } catch (error) {
    console.error("Error deleting schedules:", error);
    throw new Error("Failed to delete all schedules");
  }
}

// API endpoint to delete all schedules
router.delete('/delete_all_schedules', validateToken, checkManagerRole, async (req, res) => {
  try {
    const success = await deleteAllSchedules();
    if (success) {
      res.json({ message: "All schedules deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete all schedules" });
    }
  } catch (error) {
    handleError(error, res);
  }
})




router.post('/manual_schedule', validateToken, async (req, res) => {
  const { emp_id } = req.body;
  try {
    const leaveDates = await getLeaveDates(emp_id); // Get leave dates from database

    const highlightDates = [];
    leaveDates.forEach(({ start_date, end_date }) => {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        let currentDate = startDate;

        while (currentDate <= endDate) {
          highlightDates.push(currentDate.toISOString().split('T')[0]); // Convert to YYYY-MM-DD format
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next date
        }
      } else {
        console.error("Invalid date format:", { start_date, end_date });
      }
    });

    res.json({ highlightRows: [highlightDates] }); // Wrap in an array for consistency
  } catch (error) {
    console.error("Error fetching leave dates:", error);
    res.status(500).json({ error: "Failed to fetch leave dates" });
  }
});





// Route to reschedule duty
router.post("/re_schedule", validateToken, async (req, res) => {
  const { emp_id } = req.body;
  if (!emp_id) {
    return res.status(400).json({ message: "emp_id is required" });
  }

  try {
    const duty = await getDutyByEmployeeId(emp_id);
    // console.log("Duty object:", JSON.stringify(duty, null, 2));

    if (!duty) {
      return res.status(404).json({ message: "Duty not found for the given employee" });
    }

    const duty_id = duty.duty_id;
    console.log("Extracted duty_id:", duty_id);

    const employee = await findEmployeeById(emp_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find the next available employee
    const availableEmployees = await getAvailableEmployees(/* parameters */);
    const nextEmployee = availableEmployees.find(emp => emp.id !== emp_id); // exclude current employee

    if (!nextEmployee) {
      return res.status(404).json({ message: "No available employees to reschedule duty" });
    }

    const success = await rescheduleDuty(nextEmployee.id, duty_id);
    if (!success) {
      return res.status(500).json({ message: "Failed to reschedule duty" });
    }

    res.json({ message: "Duty rescheduled successfully.", duty_id });
  } catch (error) {
    console.error("Error in re_schedule API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});






router.post(
  "/add_schedule",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { employee_id, date, start_time, end_time, duty_id, end_date } = req.body;

    // Validation
    if (!employee_id || !date || !start_time || !end_time || !duty_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if employee is on leave
    const empOnLeaveResponse = await empOnLeave(employee_id.value, date);
    if (empOnLeaveResponse) {
      return res.status(400).json({ message: "Employee is on leave!" });
    }

    // Check for occurrence limit in a day
    const ocrdSchedule = await findDutyOccuranceInDayById(duty_id.value);
    const countSchedules = await countScheduleByArmyNoAndDate(employee_id.value, date);
    if (countSchedules.ct >= ocrdSchedule.dtt) {
      return res.status(400).json({
        message: "Schedule with same Army no and Date has already reached max limit in a day!",
      });
    }

    // Check for 4-hour gap
    const maxEndTimeSchedule = await countSchedule4HourGapByArmyNoAndDateAndStartTime(
      employee_id.value,
      end_date,
      start_time
    );
    if (maxEndTimeSchedule.hours_diff < 4) {
      return res.status(400).json({
        message: "A gap of 4 Hours must be considered while scheduling with same Army no and Date!",
      });
    }

    // Check for existing schedule
    const existingSchedule = await findScheduleByArmyNoAndStartEndDateTime(
      employee_id.value,
      end_date,
      start_time,
      end_time
    );
    if (existingSchedule) {
      return res.status(400).json({
        message: "Schedule with same Army no, End Date, Start and End times already exists",
      });
    }

    try {
      // Generate schedules for the day
      const schedules = getStartAndEndTimesForDuty(4); // Assuming 4 is the duty duration
      const validSchedules = schedules.filter((sch) => {
        // Check if schedule overlaps with existing ones
        return !schedules.some(existing =>
          existing.startTime < sch.endTime && sch.startTime < existing.endTime
        );
      });

      // Save valid schedules to the database
      const createdSchedules = [];
      for (const sch of validSchedules) {
        const schedule = await addScheduleToDatabase({
          employee_id: employee_id.value,
          date: new Date(date).toISOString(),
          start_time: sch.startTime,
          end_date: new Date(end_date).toISOString(),
          end_time: sch.endTime,
          duty_id: duty_id.value,
        });
        createdSchedules.push(schedule);
      }

      res.json({
        message: "Schedules created successfully",
        schedules: createdSchedules,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);



function getStartAndEndTimesForDuty(duration) {
  const dutyDuration = duration; // Duration of duty in hours
  const gapBetweenDuties = 4; // Hours between end of one duty and start of the next
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // End of the day

  // Initialize start time to 00:00:00.000 today
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0); // Set to midnight

  const schedules = [];
  let currentStartTime = new Date(startTime); // Copy of the start time for manipulation

  // Loop until current start time exceeds the end of the day
  while (currentStartTime <= endOfDay) {
    const endTime = new Date(currentStartTime);
    endTime.setHours(endTime.getHours() + dutyDuration);

    // If end time exceeds the day limit, adjust end time
    if (endTime > endOfDay) {
      endTime.setHours(23, 59, 59, 999); // Adjust to 23:59:59.999
    }

    schedules.push({
      startTime: currentStartTime.toISOString().slice(0, 16), // Format to YYYY-MM-DDTHH:MM
      endTime: endTime.toISOString().slice(0, 16), // Format to YYYY-MM-DDTHH:MM
    });

    // Calculate start time for the next duty slot with the gap
    currentStartTime = new Date(endTime);
    currentStartTime.setHours(new Date(endTime).getHours() + gapBetweenDuties);

    // Break loop if next start time exceeds the end of the day
    if (currentStartTime > endOfDay) {
      break;
    }
  }

  return schedules;
}

const dutiesWithSchedulesM = (data) => {
  const schedules = {};
  for (const row of data) {
    const dutyId = row.duty_id;
    const duty_name = row.duty_name;
    if (!schedules[dutyId]) {
      schedules[dutyId] = {
        id: dutyId,
        duty_name: duty_name,
        duration: row.duration,
        location: row.location,

        schedules: [],
      };
    }
    schedules[dutyId].schedules.push({
      startTime: row.start,
      endTime: row.end,
      sch_id: row.sch_id,
      start_date: row.start_date,
      end_date: row.end_date,
      assignedCandidate: { // Assuming assignedCandidate is relevant, populate based on data
        name: row.title,
        rank_name: row.rank_name,
        location: row.location,


        // Add other employee details if available
      },
    });
  }
  return Object.values(schedules); // Convert object to array for mapping
  console.log(schedules);
};

router.get("/weekly_schedule", validateToken, async (req, res) => {
  //SELECT * FROM `schedules` order by duty_id asc,date asc, start_time asc; 
  try {
    const results = await getWeeklySchedules();
    console.log(results)
    const dutiesWithSchedules = dutiesWithSchedulesM(results);
    res.json({ dutiesWithSchedules });
  }
  catch (error) { console.log(error); }

});
const calculateSchedulesForDuty = (duty) => {
  let dutiesWithSchedules = [];
  const currentDate = new Date();
  const currentDateE = new Date();
  const userTimeZone = 'Asia/Karachi'; // Get time zone from URL query parameter (default to Asia/Karachi)
  const momentObj = moment.tz(currentDate, userTimeZone);
  const momentObjEnd = moment.tz(currentDateE, userTimeZone);

  const startTime = momentObj.set({ hour: 18, minute: 0, second: 0 });
  const endTime = momentObjEnd.set({ hour: 18, minute: 0, second: 0 });
  endTime.add(duty.duration, 'hours');
  dutiesWithSchedules.push({ startTime: startTime.format(), endTime: endTime.format() });
  const desiredHour = 18; // Hour to find (6 PM)
  startTime.add(duty.duration, 'hours');
  const expertCheck = (24 * 7) / duty.duration;
  let counter = 0;
  while (counter < expertCheck) {
    endTime.add(duty.duration, 'hours');
    dutiesWithSchedules.push({ startTime: startTime.format(), endTime: endTime.format() });
    startTime.add(duty.duration, 'hours'); // Add 1 hour to startTime
    counter++;
  }

  return dutiesWithSchedules;

};
function shuffle(array) {
  // Create a copy of the array to avoid modifying the original
  const shuffledArray = [...array];

  // Sort the array using a random comparison function
  shuffledArray.sort(() => Math.random() - 0.5);

  return shuffledArray;
}
router.get("/auto_schedule", validateToken, async (req, res) => {
  console.log("Auto schedule!");
  try {
    //fetch list of all duties from db 
    const listOfAllDuties = await getAllDuties();
    const listOfAllAvailableEmployeesSorted = await findAvailableEmployees();
    const listOfAllAvailableEmployees = shuffle(listOfAllAvailableEmployeesSorted);
    //creating schedules accordingy to duty's duration.
    let dutiesWithSchedules = [];
    listOfAllDuties.map((duty) => {

      const dutyWithSch = calculateSchedulesForDuty(duty);
      let availableEmployeesForThisDuty = [];
      const assignedCounts = {}; // Track assigned times per employee (week)
      listOfAllAvailableEmployees.map((emp) => {
        if (duty.appt_id === emp.duty_appt) {
          availableEmployeesForThisDuty.push(emp);
          assignedCounts[emp.id] = 0; // Initialize assigned count for each employee
        }
      });
      let availableEmployeesForThisDutyFinal = [];
      let remembringIndex = 0;

      for (let i = 0; i < duty.occurance_in_day; i++) {
        // Check if there are enough available employees for this duty occurrence
        if (availableEmployeesForThisDuty.length > duty.emp_req) {
          // Loop and assign employees based on emp_req
          for (let counter = 0; counter < duty.emp_req; counter++) {
            const employeeIndex = (remembringIndex + counter) % availableEmployeesForThisDuty.length; // Calculate circular index
            const employee = availableEmployeesForThisDuty[employeeIndex];
            // Check if employee can be assigned (less than 3 times a week)
            if (assignedCounts[employee.id] < 2) {
              availableEmployeesForThisDutyFinal.push(employee);
              assignedCounts[employee.id]++; // Increment assigned count
            }
          }
          // Update rememberingIndex for next iteration
          remembringIndex = (remembringIndex + duty.emp_req) % availableEmployeesForThisDuty.length;
        } else {
          // Assign all available employees if not enough
          availableEmployeesForThisDuty.map((fg) => availableEmployeesForThisDutyFinal.push(fg));
        }
      }
      dutiesWithSchedules.push({ id: duty.id, duration: duty.duration, schedules: dutyWithSch, candidatesEmps: availableEmployeesForThisDutyFinal });
    });
    const assignedDuties = assignCandidates(dutiesWithSchedules);
    let count = 0;
    assignedDuties.map((dt) => {
      // if (count < 2) {
      //   console.log(dt);
      //   count++;
      // }
      dt.schedules.map((sch) => {
        const date = sch.startTime.split('T')[0];
        const end_date = sch.endTime.split('T')[0];
        if (sch.assignedCandidate && sch.assignedCandidate.id) {
          createSchedule(pool, sch.assignedCandidate.id, date, end_date, sch.startTime, sch.endTime, dt.id);
        }
      });
    });
    res.json({ message: "Daily Schedule Created." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function assignCandidates_(dutiesWithSchedules) {
  for (const duty of dutiesWithSchedules) {
    const schedules = duty.schedules;
    const candidates = duty.candidatesEmps.flat(); // Flatten candidate list
    let assignedCandidates = []; // Track assigned candidates

    // Loop through schedules
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      let assignedCandidate = null;

      // Check if any unassigned candidate has a 4-hour gap
      for (let j = 0; j < candidates.length; j++) {
        const candidate = candidates[j];
        if (!assignedCandidates.includes(candidate)) {
          // Check for 4-hour gap using last assigned time
          const lastAssignedTime = assignedCandidates.length > 0 ? assignedCandidates[assignedCandidates.length - 1].endTime : null;
          // if (!lastAssignedTime || isFourHourGap(lastAssignedTime, schedule.startTime)) {
          if (isFourHourGap(lastAssignedTime, schedule.startTime)) {
            assignedCandidate = candidate;
            assignedCandidates.push(candidate);
            candidates.splice(j, 1); // Remove assigned candidate
            break;
          }
        }
      }

      // Round-robin assignment if no candidate with gap found
      if (!assignedCandidate && assignedCandidates.length > 0) {
        assignedCandidate = assignedCandidates.shift(); // Remove and reassign first assigned candidate
        assignedCandidates.push(assignedCandidate); // Add back to the end
      }

      // Update schedule with assigned candidate if any
      if (assignedCandidate) {
        schedule.assignedCandidate = assignedCandidate;
      }
    }
  }

  return dutiesWithSchedules;
}

function isFourHourGap(endTime1, startTime2) {
  const differenceInHours = Math.abs(moment(endTime1).diff(moment(startTime2), 'hours', true)); // Use moment.js for accurate time calculations
  return differenceInHours >= 4;
}

//suggessted by gemini
function assignCandidates(dutiesWithSchedules) {
  for (const duty of dutiesWithSchedules) {
    const schedules = duty.schedules;
    const candidates = duty.candidatesEmps.flat(); // Flatten candidate list
    let assignedCandidates = []; // Track assigned candidates
    const assignedTimeSlots = {}; // Map employee IDs to their assigned time slots
    // Initialize assignedTimeSlots with empty objects
    candidates.forEach(candidate => assignedTimeSlots[candidate.id] = {});

    // Loop through schedules
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      const scheduleTimeSlot = {
        startTime: schedule.startTime,
        endTime: schedule.endTime
      };
      let assignedCandidate = null;

      // Check if any unassigned candidate has a 4-hour gap and doesn't overlap
      for (let j = 0; j < candidates.length; j++) {
        const candidate = candidates[j];
        if (!assignedCandidates.includes(candidate) && !isTimeSlotOverlapping(assignedTimeSlots[candidate.id], scheduleTimeSlot)) {
          if (isFourHourGap(candidates[j].endTime, schedule.startTime)) {
            assignedCandidate = candidate;
            assignedCandidates.push(candidate);
            assignedTimeSlots[candidate.id] = scheduleTimeSlot; // Update assigned time slots
            candidates.splice(j, 1);
            break;
          }
        }
      }

      // Round-robin assignment if no candidate with gap found (optional, adjust based on your needs)
      // Round-robin assignment if no candidate with gap found
      if (!assignedCandidate && assignedCandidates.length > 0) {
        assignedCandidate = assignedCandidates.shift(); // Remove and reassign first assigned candidate
        assignedCandidates.push(assignedCandidate); // Add back to the end
      }

      // Update schedule with assigned candidate if any
      if (assignedCandidate) {
        schedule.assignedCandidate = assignedCandidate;
      }
    }
  }

  return dutiesWithSchedules;
}

function isTimeSlotOverlapping(existingTimeSlot, newTimeSlot) {
  // Check if the start time of one is before the end time of the other, and vice versa
  return (existingTimeSlot && newTimeSlot &&
    (existingTimeSlot.startTime <= newTimeSlot.endTime && existingTimeSlot.endTime >= newTimeSlot.startTime) ||
    (newTimeSlot.startTime <= existingTimeSlot.endTime && newTimeSlot.endTime >= existingTimeSlot.startTime));
}

//suggessted by gemini
async function klop(pool, duty, date) {
  try {
    const { id, duration, emp_req } = duty; // Destructure duty object

    // 1. Get all available employees considering leave and conflicts
    const availableEmployees = await getAvailableEmployees(
      pool,
      date,
      // Calculate start time based on duty duration
      new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), // Set default start time (adjust as needed)
      calculateEndTime(date, new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), duration), // Calculate end time
      id
    );
    console.log("availableEmployees");
    // console.log(availableEmployees);
    // 2. Assign employees to schedules (round-robin)
    const assignedEmployees = [];
    let employeeIterator = availableEmployees[Symbol.iterator](); // Create iterator

    while (assignedEmployees.length < emp_req) {
      const { value: employee, done } = employeeIterator.next();

      if (done) {
        // Restart iterator for round-robin if all employees have been assigned once
        employeeIterator = availableEmployees[Symbol.iterator]();
        continue;
      }

      // Create schedule for the current employee
      await createSchedule(pool, employee.id, date, calculateStartTime(date), calculateEndTime(date), id);
      assignedEmployees.push(employee.id);
    }

    console.log(`Successfully assigned ${assignedEmployees.length} employees to duty ${id} on ${date}`);
    return { assignedEmployees }; // Return assigned employees for potential further actions
  } catch (error) {
    console.error("Error assigning schedules:", error);
    throw error; // Re-throw for handling in the route handler
  }
}
async function checkForEmployeeLeave(pool, employeeId, date) {
  try {
    const query = `
      SELECT *
      FROM leaves
      WHERE employee_id = ? AND ? BETWEEN start_date AND end_date;
    `;
    const [results] = await pool.query(query, [employeeId, date]);
    return results.length > 0; // Return true if there's leave on that date
  } catch (error) {
    console.error("Error checking for employee leave:", error);
    throw error; // Re-throw for handling in the calling function
  }
}
async function getAvailableEmployees(date, startTime, endTime, dutyId) {
  try {
    // 1. Get all employees
    const [allEmployees] = await pool.query("SELECT * FROM employees");

    // 2. Filter out employees on leave
    const availableEmployees = allEmployees.filter(
      async (employee) => !await checkForEmployeeLeave(pool, employee.id, date)
    );
    console.log("availableEmployees after leave check");
    // console.log(availableEmployees);
    // 3. Filter out employees with conflicting schedules
    const filteredByConflict = await Promise.all(
      availableEmployees.map(async (employee) => {
        const conflicts = await findConflictingSchedules(
          pool,
          employee.id,
          date,
          startTime,
          endTime,
          dutyId
        );
        return !conflicts.length; // Include employee if no conflicts
      })
    );
    console.log("after filteredByConflict");
    // console.log(filteredByConflict);
    return availableEmployees.filter((_, index) => filteredByConflict[index]);
  } catch (error) {
    console.error("Error getting available employees:", error);
    throw error; // Re-throw for handling in the calling function
  }
}
async function findConflictingSchedules(pool, employeeId, date, startTime, endTime, dutyId) {
  try {
    const query = `
      SELECT *
      FROM schedules
      WHERE employee_id = ? AND duty_id <> ? AND (
        (date = ? AND (
          (start_time < ? AND end_time > ?)
          OR (start_time BETWEEN ? AND ?)
        ))
        OR (
          (end_date = ? AND start_time < ?)  /* Duty ends on the same day, new schedule starts before */
          OR (date BETWEEN ? AND ? AND end_date IS NULL)  /* New duty falls within existing multi-day schedule */
        )
      )
      AND (
        (start_time < ? AND end_time > ?)  /* Existing schedule overlaps the gap before the new schedule */
        OR (start_time < ? AND end_time BETWEEN ? AND ?)  /* Existing schedule overlaps the gap within the new schedule */
        OR (start_time BETWEEN ? AND ? AND end_time > ?)  /* Existing schedule overlaps the gap after the new schedule */
      )
    `;

    const gapStartTime = new Date(startTime);
    gapStartTime.setHours(gapStartTime.getHours() - 4); // Calculate start time for the 4-hour gap
    const gapEndTime = new Date(endTime);
    gapEndTime.setHours(gapEndTime.getHours() + 4); // Calculate end time for the 4-hour gap

    const [results] = await pool.query(query, [
      employeeId,
      dutyId,
      date,
      startTime,
      endTime,
      startTime,
      endTime,
      date,
      startTime,
      date,
      date,
      gapStartTime,
      gapStartTime,
      gapStartTime,
      endTime,
      startTime,
      gapEndTime,
      endTime, // Existing schedule overlaps after the new schedule (end_time of existing)
      gapEndTime, // Existing schedule overlaps after the new schedule (gapEndTime)
    ]);

    return results;
  } catch (error) {
    console.error("Error finding conflicting schedules:", error);
    throw error;
  }
}

function calculateStartTime(date) {
  // You can replace this with logic to get the start time from user input or another source
  // For demonstration purposes, we'll use a default start time (adjust as needed)
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function calculateEndTime(date, startTime, duration) {
  const startTimeObject = new Date(date + " " + startTime);
  startTimeObject.setHours(startTimeObject.getHours() + duration);
  return startTimeObject.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
async function createSchedule(pool, employeeId, date, end_date, startTime, endTime, duty_id) {
  try {
    const query = `
      INSERT INTO schedules (employee_id, date,end_date, start_time, end_time, duty_id)
      VALUES (?, ?, ?, ?, ?,?)
    `;

    await pool.query(query, [employeeId, date, end_date, startTime, endTime, duty_id]); // Assuming duty.id is available

    console.log(`Created schedule for employee ${employeeId} on ${date}`);
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error; // Re-throw for handling in the calling function
  }
}
router.post("/schedule_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding schedule!");
  try {
    const schedule = await findScheduleById(id);
    if (schedule) {
      res.json({ schedule });
    } else {
      res
        .status(404)
        .json({ message: "Schedule with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/daily_schedule", validateToken, async (req, res) => {
  try {
    const schedule = await getDailySchedule();
    if (schedule) {
      res.json({ schedule });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a schedule (POST)
router.post(
  "/update_schedule",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, employee_id, date, end_date, start_time, end_time, duty_id } =
      req.body;

    // Check for missing fields
    if (
      !employee_id ||
      !date ||
      !end_date ||
      !start_time ||
      !end_time ||
      !duty_id ||
      !id
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const schedule = await findScheduleById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    try {
      // Prepare updated schedule object
      const updatedschedule = {};
      if (employee_id) schedule.employee_id = employee_id.value;
      if (date) schedule.date = new Date(date).toISOString();
      if (end_date) schedule.end_date = new Date(end_date).toISOString();
      if (start_time) schedule.start_time = start_time;
      if (end_time) schedule.end_time = end_time;
      if (duty_id) schedule.duty_id = duty_id.value;

      // Update schedule in the database (using updateScheduleInDatabase)
      await updateScheduleInDatabase(schedule.id, schedule);

      res.json({ message: "Schedule updated successfully" });
    } catch (error) {
      console.error("Error updating schedule:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/schedules_list", validateToken, async (req, res) => {
  console.log("Fetching all schedules list!");
  try {
    const schedules = await getAllSchedules();
    res.json({ schedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});




async function findEmployeeById(emp_id) {
  const query = 'SELECT * FROM employees WHERE id = ?';
  const values = [emp_id];

  try {
    const [rows] = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
}



async function rescheduleDuty(employeeId, duty_id) {
  try {
    console.log('Employee ID:', employeeId);
    console.log('Duty ID:', duty_id);

    // Ensure column names match your database schema
    const [result] = await pool.query("UPDATE schedules SET employee_id = ? WHERE duty_id = ?", [employeeId, duty_id]);

    console.log('Update Result:', result);

    if (result.affectedRows === 0) {
      throw new Error("Duty not found or no update made.");
    }

    return result;
  } catch (error) {
    console.error("Error rescheduling duty:", error);
    throw error;
  }
}



const getDutyById = async (duty_id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM duties WHERE id = ?', [duty_id]);
    return rows[0];
  } catch (error) {
    throw new Error('Error fetching duty by ID');
  }
};

const getDutyByEmployeeId = async (emp_id) => {
  try {
    const [rows] = await pool.query('SELECT duty_id FROM schedules WHERE employee_id = ?', [emp_id]);
    return rows[0];
  } catch (error) {
    throw new Error('Error fetching duty by employee ID');
  }
};
router.post(
  "/delete_schedule",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const schedules = await deleteSchedule(id);
      console.log(schedules);
      if (schedules)
        res.status(200).json({ message: "Schedule deleted successfully" });
      if (!schedules)
        res.status(500).json({ message: "Schedule not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }


);



module.exports = router;


