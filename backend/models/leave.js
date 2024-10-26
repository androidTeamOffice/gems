const pool = require("../db/db"); // Assuming the file is named db.js

// Function to add a leave to the MySQL database
async function addLeaveToDatabase(leave) {
  const connection = await pool.getConnection();
  try {
    const sql = `INSERT INTO leaves (employee_id, leave_type_id, start_date, end_date,avail_till_date,loc_id) VALUES (?,?,?,?,?,?)`;
    const [results] = await connection.execute(sql, [
      leave.employee_id,
      leave.leave_type_id,
      leave.start_date,
      leave.end_date,
      leave.end_date,
      leave.loc_id,
    ]);
    leave.id = results.insertId; // Set the generated ID on the user object
  } catch (error) {
    console.error("Error adding leave to database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
  return leave;
}
async function findLeaveByArmyNo(army_no, s_d, e_d) {
  try {
    const [rows] = await pool.query(
      "SELECT lv.id, emp.id as employee_id,emp.name as employee_name,emp.Army_No as army_no, lvts.id as leave_type_id,lvts.name as leave_type_name, lv.start_date, lv.end_date FROM leaves as lv join employees as emp on lv.employee_id = emp.id join leavetypes as lvts on lv.leave_type_id = lvts.id  WHERE emp.id = ? and lv.start_date= ? and lv.end_date = ? ",
      [army_no, s_d, e_d]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding leave by army no:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function empOnLeave(employee_id, date) {
  try {
    const [rows] = await pool.query(
      "SELECT 1 AS is_on_leave FROM leaves as lv join employees as emp on lv.employee_id = emp.id WHERE emp.id = ? AND ? BETWEEN lv.start_date AND lv.end_date",
      [employee_id, date]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding employee is on leave:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findLeaveById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT lv.id, lv.loc_id, emp.id as employee_id, emp.name as employee_name, emp.Army_No as army_no, rk.id as rank_id, rk.name as rank_name, bt.id as bty_id, bt.name as bty, cd.id as cadre_id, cd.name as cadre_name, lvts.id as leave_type_id, lvts.name as leave_type_name, lv.start_date, lv.end_date FROM leaves as lv JOIN employees as emp ON lv.employee_id = emp.id JOIN leavetypes as lvts ON lv.leave_type_id = lvts.id JOIN ranks as rk ON emp.rank_id = rk.id JOIN bio_data as bd ON emp.Army_No = bd.Army_No JOIN batteries as bt ON bd.bty_id = bt.id JOIN cadres as cd ON bd.Trade = cd.id WHERE lv.id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding leave by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getAllLeaves() {
  try {
    const [rows] = await pool.query(
      "SELECT lv.id, lv.loc_id, emp.id as employee_id,emp.name as employee_name,emp.Army_No as army_no, rk.id as rank_id,rk.name as rank_name,bt.id as bty_id,bt.name as bty,cd.id as cadre_id,cd.name as cadre_name,lvts.id as leave_type_id,lvts.name as leave_type_name, lv.start_date, lv.end_date,DATEDIFF(lv.end_date, lv.start_date) + 1 AS days,  DATEDIFF(lv.end_date, CURDATE()) AS days_end,DATEDIFF(lv.avail_till_date,lv.start_date) + 1 as avail_till_date FROM leaves as lv join employees as emp on lv.employee_id = emp.id join leavetypes as lvts on lv.leave_type_id = lvts.id  join ranks as rk on emp.rank_id = rk.id join bio_data as bd on emp.Army_No=bd.Army_No join batteries as bt on bd.bty_id=bt.id join cadres as cd on bd.Trade=cd.id  WHERE lv.end_date >= CURDATE() ORDER by rk.id, days_end ASC"
    );
    console.log("fetched leaves");
    return rows;
  } catch (error) {
    console.error("Error fetching all leaves:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function deleteLeave(id) {
  try {
    const sql = `DELETE FROM leaves WHERE id = ?`;
    const result = await pool.execute(sql, [id]); // Delete leave

    if (result[0].affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting leaves:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
// Function to update a leave in the MySQL database
async function updateLeaveInDatabase(id, updatedLeave) {
  const connection = await pool.getConnection();
  try {
    const sql = `UPDATE leaves SET employee_id = ?, leave_type_id = ?, start_date = ?, end_date = ?, avail_till_date= ?, loc_id=? WHERE id = ?`;
    const [results] = await connection.execute(sql, [
      updatedLeave.employee_id,
      updatedLeave.leave_type_id,
      updatedLeave.start_date,
      updatedLeave.end_date,
      updatedLeave.avail_till_date,
      updatedLeave.loc_id,
      id,
    ]);
    if (results.affectedRows === 0) {
      throw new Error("Leave not found"); // Handle case where leave wasn't updated (not found)
    }
  } catch (error) {
    console.error("Error updating leave in database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
module.exports = {
  addLeaveToDatabase,
  findLeaveByArmyNo,
  findLeaveById,
  updateLeaveInDatabase,
  getAllLeaves,
  deleteLeave,
  empOnLeave,
};
