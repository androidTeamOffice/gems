const pool = require("../db/db"); // Assuming the file is named db.js

// Function to add a duty to the MySQL database
async function addDutyToDatabase(duty) {
  const connection = await pool.getConnection();
  try {
    const sql = `INSERT INTO duties (name,description,cadre_specific,location_id,duration,emp_req,occurance_in_day,appt_id) VALUES (?,?,?,?,?,?,?,?)`;
    const [results] = await connection.execute(sql, [
      duty.name,
      duty.description,
      duty.cadre_specific,
      duty.location_id,
      duty.duration,
      duty.emp_req,
      duty.occurance_in_day,
      duty.appt_id,
    ]);
    duty.id = results.insertId; // Set the generated ID on the user object
  } catch (error) {
    console.error("Error adding duty to database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
  return duty;
}
async function findDutyByNameAndAppt(name, appt_id) {
  try {
    const [rows] = await pool.query(
      "SELECT dt.id as id, dt.name as name,dt.description as description, dt.occurance_in_day,dt.cadre_specific as cadre_specific, locs.id as location_id,locs.name as location_name,dt.duration,dt.emp_req FROM duties as dt join locations as locs on dt.location_id = locs.id  WHERE dt.name = ? and dt.appt_id = ?",
      [name, appt_id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding user by name and rank id: ", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findDutyById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT dt.id as id, dt.name as name,dt.description as description,dt.occurance_in_day, dt.cadre_specific as cadre_specific, locs.id as location_id,locs.name as location_name,appt.id as appt_id, appt.name as appt_name,dt.duration,dt.emp_req FROM duties as dt join locations as locs on dt.location_id = locs.id  join duty_appts appt on dt.appt_id=appt.id WHERE dt.id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding duty by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findConflictingSchedules(date, start_time, end_time, duty_id) {
  try {
    // Using template literals for SQL query with parameters
    const query = `
      SELECT *
      FROM schedules
      WHERE duty_id <> ?  
      AND (
        (date = ? AND (  
          (start_time < ? AND end_time > ?)
          OR (start_time BETWEEN ? AND ?)
        ))
        OR (
          (end_date = ? AND start_time < ?)
          OR (date BETWEEN ? AND ? AND end_date IS NULL) 
        )
      )
    AND ( 
  (start_time < ? AND end_time > ?)  
  OR (start_time < ? AND end_time BETWEEN ? AND ?) 
  OR (start_time BETWEEN ? AND ? AND end_time > ?) 
)
    `;

    // Execute query with parameters, including gap check times
    const gapStartTime = new Date(start_time);
    gapStartTime.setHours(gapStartTime.getHours() - 4); // Calculate start time for the 4-hour gap
    const gapEndTime = new Date(end_time);
    gapEndTime.setHours(gapEndTime.getHours() + 4); // Calculate end time for the 4-hour gap

    const [results] = await pool.query(query, [
      duty_id,
      date, start_time, end_time,
      start_time, end_time,
      date, start_time,
      date, date,
      gapStartTime, gapStartTime,
      gapStartTime, end_time, start_time, gapEndTime,
      // Add the two missing parameters for the gap check within the existing schedule
      end_time,  // Existing schedule overlaps after the new schedule (end_time of existing)
      gapEndTime, // Existing schedule overlaps after the new schedule (gapEndTime)
    ]);

    console.log("results")
    console.log(results)

    return results;
  } catch (error) {
    console.error("Error finding conflicting schedules:", error);
    throw error; // Re-throw the error for handling in the route handler
  }
}

async function findEmployeeLeavesOnDate(date, end_date) {
  try {
    const results = await pool.query(
      `SELECT *
       FROM leaves
       WHERE (
           (start_date <= ? AND end_date >= ?)
       )`,
      [date, end_date]
    );


    return results;

  } catch (error) {
    console.error("Error finding employee leaves:", error);
    throw error; // Re-throw the error for handling in the route handler
  }
}
async function findDutyOccuranceInDayById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT dt.occurance_in_day as dtt FROM duties as dt WHERE dt.id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding occurance_in_day duty by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getAllDuties() {
  try {
    const [rows] = await pool.query(
      "SELECT dt.id as id, dt.name as name,dt.description as description,dt.occurance_in_day, case dt.cadre_specific when 0 then 'No' else 'Yes' end as cadre_specific, locs.id as location_id,locs.name as location_name,appt.id as appt_id, appt.name as appt_name,dt.duration,dt.emp_req FROM duties as dt join locations as locs on dt.location_id = locs.id  join duty_appts  appt on dt.appt_id=appt.id"
    );
    console.log("fetched duties");
    return rows;
  } catch (error) {
    console.error("Error fetching all duties:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function deleteDuty(id) {
  try {
    const sql = `DELETE FROM duties WHERE id = ?`;
    const result = await pool.execute(sql, [id]); // Delete duty

    if (result[0].affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting duties:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
// Function to update a duty in the MySQL database
async function updateDutyInDatabase(id, updatedTrade) {
  const connection = await pool.getConnection();
  try {
    const sql = `UPDATE duties SET name=?,description=?,cadre_specific=?,location_id=?,appt_id=?,duration=?,emp_req=?,occurance_in_day=? WHERE id = ?`;

    const [results] = await connection.execute(sql, [
      updatedTrade.name,
      updatedTrade.description,
      updatedTrade.cadre_specific,
      updatedTrade.location_id,
      updatedTrade.appt_id,
      updatedTrade.duration,
      updatedTrade.emp_req,
      updatedTrade.occurance_in_day,
      id,
    ]);
    if (results.affectedRows === 0) {
      throw new Error("Duty not found"); // Handle case where duty wasn't updated (not found)
    }
  } catch (error) {
    console.error("Error updating duty in database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
module.exports = {
  addDutyToDatabase,
  findDutyByNameAndAppt,
  findDutyById,
  updateDutyInDatabase,
  getAllDuties,
  deleteDuty,
  findDutyOccuranceInDayById,
  findEmployeeLeavesOnDate,
  findConflictingSchedules,
};
