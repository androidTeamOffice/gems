const pool = require("../db/db"); // Assuming the file is named db.js

// Function to add a schedule to the MySQL database
async function addScheduleToDatabase(schedule) {
  const connection = await pool.getConnection();
  try {
    const sql = `INSERT INTO schedules (employee_id, date, start_time, end_time, duty_id,end_date) VALUES (?,?,?,?,?,?)`;
    const [results] = await connection.execute(sql, [
      schedule.employee_id,
      schedule.date,
      schedule.start_time,
      schedule.end_time,
      schedule.duty_id,
      schedule.end_date,
    ]);
    schedule.id = results.insertId; // Set the generated ID on the user object
  } catch (error) {
    console.error("Error adding schedule to database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
  return schedule;
}
async function findScheduleByArmyNoAndStartEndDateTime(
  employee_id,
  date,
  start_time,
  end_time
) {
  try {
    const [rows] = await pool.query(
      "SELECT sch.id as id, emp.id as employee_id,emp.name as employee_name,emp.Army_No as army_no,rk.id as rank_id,rk.name as rank_name, sch.date as date, sch.end_date as end_date,sch.start_time as start_time, sch.end_time as end_time, dt.id as duty_id,dt.name as duty_name FROM schedules as sch join duties as dt on sch.duty_id = dt.id join employees as emp on sch.employee_id = emp.id join ranks as rk on emp.rank_id = rk.id WHERE emp.id = ? and sch.end_date =? and sch.start_time =? and sch.end_time =?",
      [employee_id, date, start_time, end_time]
    );
    return rows[0] || null;
  } catch (error) {
    console.error(
      "Error finding Schedule by ArmyNo, Date, Start and End Times: ",
      error
    );
    // You can also throw a specific error here for handling in the route handler
  }
}
async function countScheduleByArmyNoAndDate(employee_id, date) {
  try {
    console.log("date: " + date);
    const [rows] = await pool.query(
      "SELECT count(sch.id) as ct FROM schedules as sch join employees as emp on sch.employee_id = emp.id WHERE emp.id = ? and sch.date =DATE(STR_TO_DATE(?, '%Y-%m-%d'))",
      [employee_id, date]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding Schedule by ArmyNo and Date:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getDailySchedule() {
  try {
    const [rows] = await pool.query(
      `SELECT 
        emp.name as title,
        sch.start_time as start,
        sch.end_time as end,
        sch.end_date,
        loc.name as location
      FROM 
        schedules as sch
      JOIN 
        employees as emp 
      ON 
        sch.employee_id = emp.id
      JOIN
        duties as dt
      ON
        sch.duty_id = dt.id
      JOIN
        locations as loc
      ON
        dt.location_id = loc.id`
    );
    console.log(rows[0]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding Schedule by ArmyNo and Date:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getWeeklySchedules() {
  try {
    const [rows] = await pool.query(
      `SELECT 
        sch.duty_id,
        sch.id as sch_id,
        dt.name as duty_name,
        dt.duration,
        rks.name as rank_name,
        emp.name as title,
        sch.start_time as start,
        sch.end_time as end,
        sch.date as start_date,
        sch.end_date,
        loc.name as location
      FROM 
        schedules as sch
      JOIN 
        employees as emp 
      ON 
        sch.employee_id = emp.id
      JOIN 
        ranks as rks 
      ON 
        emp.rank_id = rks.id
      JOIN 
        duties as dt 
      ON 
        sch.duty_id = dt.id
      JOIN 
        locations as loc 
      ON 
        dt.location_id = loc.id
      ORDER BY 
        sch.duty_id ASC,
        sch.date ASC, 
        sch.start_time ASC;`
    );

    return rows || null;
  } catch (error) {
    console.error("Error finding Weekly Schedule:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function countSchedule4HourGapByArmyNoAndDateAndStartTime(
  employee_id,
  date,
  start_time
) {
  try {
    const sql =
      "SELECT TIMEDIFF(" +
      start_time +
      ", sch.end_time) / (60 * 60) AS hours_diff FROM schedules as sch join employees as emp on sch.employee_id = emp.id WHERE emp.id = " +
      employee_id +
      " and sch.end_date =" +
      date;
    console.log("sql: " + sql);
    const [rows] = await pool.query(
      "SELECT TIMEDIFF(TIME(STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s')) , sch.end_time) / (60 * 60) AS hours_diff FROM schedules as sch join employees as emp on sch.employee_id = emp.id WHERE emp.id = ? and sch.end_date =DATE(STR_TO_DATE(?, '%Y-%m-%d%H:%i:%s'))",
      [start_time, employee_id, date]
    );
    console.log("rows: " + rows);
    return rows[0] || { hours_diff: 5 };
  } catch (error) {
    console.error(
      "Error finding Schedule by ArmyNo, Date and Start time: ",
      error
    );
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findScheduleById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT sch.id as id, emp.id as employee_id,emp.name as employee_name,emp.Army_No as army_no,rk.id as rank_id,rk.name as rank_name,cd.id as cadre_id, cd.name as cadre_name,sch.date as date,sch.end_date as end_date, sch.start_time as start_time, sch.end_time as end_time,dt.id as duty_id,dt.name as duty_name FROM schedules as sch join duties as dt on sch.duty_id = dt.id join employees as emp on sch.employee_id = emp.id join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id  WHERE sch.id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding schedule by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getAllSchedules() {
  try {
    const [rows] = await pool.query(
      "SELECT sch.id as id, emp.id as employee_id,emp.name as employee_name,emp.Army_No as army_no,rk.id as rank_id,rk.name as rank_name,sch.date as date, sch.end_date as end_date,sch.start_time as start_time, sch.end_time as end_time,dt.id as duty_id,dt.name as duty_name,bt.id as bty_id,bt.name as bty,cd.id as cadre_id,cd.name as cadre_name FROM schedules as sch join duties as dt on sch.duty_id = dt.id join employees as emp on sch.employee_id = emp.id join bio_data as bd on emp.Army_No=bd.Army_No join ranks as rk on emp.rank_id = rk.id join batteries as bt on bd.bty_id=bt.id join cadres as cd on bd.Trade=cd.id  ORDER BY emp.id asc,sch.start_time asc"
    );
    console.log("fetched schedules");
    return rows;
  } catch (error) {
    console.error("Error fetching all schedules:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function deleteSchedule(id) {
  try {
    const sql = `DELETE FROM schedules WHERE id = ?`;
    const result = await pool.execute(sql, [id]); // Delete schedule

    if (result[0].affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting schedules:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
// Function to update a schedule in the MySQL database
async function updateScheduleInDatabase(id, updatedSchedule) {
  const connection = await pool.getConnection();
  try {
    const sql = `UPDATE schedules SET employee_id = ?, date = ?,end_date = ?, start_time = ?, end_time = ?, duty_id = ? WHERE id = ?`;
    const [results] = await connection.execute(sql, [
      updatedSchedule.employee_id,
      updatedSchedule.date,
      updatedSchedule.end_date,
      updatedSchedule.start_time,
      updatedSchedule.end_time,
      updatedSchedule.duty_id,
      id,
    ]);
    if (results.affectedRows === 0) {
      throw new Error("Schedule not found"); // Handle case where schedule wasn't updated (not found)
    }
  } catch (error) {
    console.error("Error updating schedule in database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
module.exports = {
  addScheduleToDatabase,
  findScheduleByArmyNoAndStartEndDateTime,
  findScheduleById,
  updateScheduleInDatabase,
  getAllSchedules,
  deleteSchedule,
  countScheduleByArmyNoAndDate,
  countSchedule4HourGapByArmyNoAndDateAndStartTime,
  getDailySchedule,
  getWeeklySchedules,
};
