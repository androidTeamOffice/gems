const pool = require("../db/db");

async function addEmployee(employeeData) {
  const connection = await pool.getConnection();
  try {
    const sql = `
      INSERT INTO employees (name, cadre_id, rank_id, medical_status_id, Army_No,loc_id,available,remarks)
      VALUES (?, ?, ?, ?, ?,?,?,?)
    `;
    const [results] = await connection.execute(sql, [
      employeeData.employee_name,
      employeeData.cadreId,
      employeeData.rankId,
      employeeData.medicalStatusId,
      employeeData.armyNo,
      employeeData.loc_id,
      employeeData.available,
      employeeData.remarks,
    ]);
    return results.insertId; // Return the newly inserted ID
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}

async function findEmployeeById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT emp.id as id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name,ms.id as medical_status_id,ms.name as medical_status_name, emp.Army_No,locs.id as loc_id,locs.name as loc_name, emp.available as available,emp.remarks as remarks FROM employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id left join medicalstatuses as ms on emp.medical_status_id = ms.id left join locations as locs on emp.loc_id=locs.id WHERE emp.id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding employee by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

async function findEmployeeByNameAndArmyNo(name, armyNo) {
  try {
    const [rows] = await pool.query(
      "SELECT emp.id as id, emp.name as name, cd.id as cadre_id,emp.remarks as remarks, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name,ms.id as medical_status_id,ms.name as medical_status_name, emp.Army_No, emp.available as available FROM employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id join medicalstatuses as ms on emp.medical_status_id = ms.id WHERE emp.name = ? and emp.Army_No = ?",
      [name, armyNo]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding employee by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

async function findEmployees() {
  try {
    const [rows] = await pool.query(
      "SELECT emp.id as id, emp.name as name, cd.id as cadre_id,emp.remarks as remarks, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name,bt.id as bty_id,bt.name as bty,ms.id as medical_status_id,ms.name as medical_status_name, emp.Army_No,locs.id as loc_id,locs.name as loc_name , emp.available as available FROM employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id left join medicalstatuses as ms on emp.medical_status_id = ms.id left join locations as locs on emp.loc_id=locs.id join bio_data as bd on emp.Army_No=bd.Army_No join batteries as bt on bd.bty_id=bt.id ORDER by rk.id ASC"
    );
    return rows;
  } catch (error) {
    console.error("Error finding employees:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findAvailableEmployees() {
  try {
    const [rows] = await pool.query(
      "SELECT emp.id as id, emp.name as name, cd.id as cadre_id,emp.remarks as remarks, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, rk.duty_appt as duty_appt,bt.id as bty_id,bt.name as bty,ms.id as medical_status_id,ms.name as medical_status_name, emp.Army_No,locs.id as loc_id,locs.name as loc_name , emp.available as available FROM employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id left join medicalstatuses as ms on emp.medical_status_id = ms.id left join locations as locs on emp.loc_id=locs.id join bio_data as bd on emp.Army_No=bd.Army_No join batteries as bt on bd.bty_id=bt.id WHERE emp.available in ('y','Y') ORDER by rk.id ASC"
    );
    return rows;
  } catch (error) {
    console.error("Error finding employees:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

async function updateEmployee(id, updatedEmployeeData) {
  const connection = await pool.getConnection();
  try {
    // const sql = `UPDATE employees SET name = ?, cadre_id = ?, rank_id = ?, medical_status_id = ?, Army_No = ?, loc_id=?, available=?, remarks = ? WHERE id = ?`;
    const sql = `UPDATE employees SET medical_status_id = ?, loc_id=?, available=?, remarks = ? WHERE id = ?`;
    const [results] = await connection.execute(sql, [
      // updatedEmployeeData.employee_name,
      // updatedEmployeeData.cadreId,
      // updatedEmployeeData.rankId,
      updatedEmployeeData.medicalStatusId,
      // updatedEmployeeData.armyNo,
      updatedEmployeeData.loc_id,
      updatedEmployeeData.available,
      updatedEmployeeData.remarks,
      id,
    ]);
    return results.affectedRows === 1; // Return true if 1 row updated
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}

async function deleteEmployee(id) {
  const connection = await pool.getConnection();
  try {
    const sql = `DELETE FROM employees WHERE id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows === 1; // Return true if 1 row deleted
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}

module.exports = {
  addEmployee,
  findEmployeeById,
  findEmployees,
  updateEmployee,
  deleteEmployee,
  findEmployeeByNameAndArmyNo,
  findAvailableEmployees,
};
