const express = require('express');
const moment = require('moment-timezone');

const app = express();

app.get('/api/auto_schedule', (req, res) => {
    const currentDate = new Date();
    const userTimeZone = req.query.timeZone || 'Asia/Karachi'; // Get time zone from URL query parameter (default to Asia/Karachi)

    if (userTimeZone) {
        console.log(userTimeZone);
        const userTime = moment.utc(currentDate).tz(userTimeZone).format();
        // Get the start of the day in user time zone
        const startTime = moment.tz(currentDate, userTimeZone).startOf('day').format();
        const todayStart = new Date(startTime).toISOString();
        console.log("todayStart ");
        console.log(todayStart);
        // Get the end of the day in user time zone (set to 23:59:59.999)
        const endTime = moment.tz(currentDate, userTimeZone).endOf('day').format();
        const todayEnd = new Date(endTime).toISOString();
        console.log("todayEnd ");
        console.log(todayEnd);
        res.json({ date: userTime, startTime, endTime, todayStart: todayStart, todayEnd: todayEnd });
    } else {
        res.json({ message: "Please provide a valid time zone parameter" }); // Inform user about missing time zone
    }
});
function assignEmployeesToDuties(duties, employees) {
    const assignedDuties = [];

    // Assuming employees is an array of objects with 'id' and 'availableTimeSlots' properties
    employees.forEach(employee => {
        duties.forEach(duty => {
            const dutyTimeSlot = {
                startTime: duty.startTime,
                endTime: duty.endTime,
                dutyId: duty.id
            };

            if (isTimeSlotAvailable(employee.availableTimeSlots, dutyTimeSlot)) {
                // Assign the duty to the employee
                assignedDuties.push({ employeeId: employee.id, dutyId: duty.id });

                // Update the employee's available time slots
                employee.availableTimeSlots.push(dutyTimeSlot);
            }
        });
    });

    return assignedDuties;
}

function isTimeSlotAvailable(availableTimeSlots, newTimeSlot) {
    for (const existingTimeSlot of availableTimeSlots) {
        if (isTimeSlotOverlapping(existingTimeSlot, newTimeSlot)) {
            return false; // Overlap found
        }
    }
    return true; // No overlap
}

function isTimeSlotOverlapping(timeSlot1, timeSlot2) {
    // Check if the start time of one is before the end time of the other, and vice versa
    return (timeSlot1.startTime <= timeSlot2.endTime && timeSlot1.endTime >= timeSlot2.startTime) ||
        (timeSlot2.startTime <= timeSlot1.endTime && timeSlot2.endTime >= timeSlot1.startTime);
}

app.listen(3216, () => console.log('Server listening on port 3216'));
