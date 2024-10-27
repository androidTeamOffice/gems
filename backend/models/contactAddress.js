const pool = require("../db/db"); // Assuming the file is named db.js

async function addContactAddress(contactAddressData) {
  const connection = await pool.getConnection();
  try {
    const sql = `INSERT INTO contact_address (soldier_id,Vill,P_O,Teh,Dist,Contact_No)VALUES (?, ?, ?, ?, ?, ?)`;
    const [results] = await connection.execute(sql, [
      contactAddressData.soldier_id,
      contactAddressData.Vill,
      contactAddressData.P_O,
      contactAddressData.Teh,
      contactAddressData.Dist,
      contactAddressData.Contact_No,
    ]);
  } catch (error) {
    console.error("Error adding contact address:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}

async function findContactAddressBySoldierId(soldierId) {
  try {
    const [rows] = await pool.query(
      "SELECT emp.id as emp_id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, ca.soldier_id,ca.Vill,ca.P_O,ca.Teh,ca.Dist,ca.Contact_No FROM contact_address as ca join employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id where ca.soldier_id=?",
      [soldierId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding contact address by soldier ID:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

// Assuming you don't need separate update and delete functions for individual fields
// You can update the entire contact address for a soldier
async function updateContactAddress(soldierId, updatedContactAddress) {
  const connection = await pool.getConnection();
  try {
    const sql = `UPDATE contact_address SET Vill = ?,P_O = ?,Teh = ?,Dist = ?,Contact_No = ? WHERE soldier_id = ?`;
    await connection.execute(sql, [
      updatedContactAddress.Vill,
      updatedContactAddress.P_O,
      updatedContactAddress.Teh,
      updatedContactAddress.Dist,
      updatedContactAddress.Contact_No,
      soldierId,
    ]);
  } catch (error) {
    console.error("Error updating contact address:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
async function deleteContactAddress(id) {
  const connection = await pool.getConnection();
  try {
    const sql = `DELETE FROM contact_address WHERE soldier_id = ?`;
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows > 0; // Return true if a row was deleted
  } catch (error) {
    console.error("Error deleting contact address:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
async function getAllContacts() {
  try {
    const [rows] = await pool.query("SELECT emp.id as emp_id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, ca.soldier_id,bt.id as bty_id,bt.name as bty,ca.Vill,ca.P_O,ca.Teh,ca.Dist,ca.Contact_No FROM contact_address as ca join employees as emp on ca.soldier_id=emp.Army_No join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id join bio_data as bd on ca.soldier_id=bd.Army_No join batteries as bt on bd.bty_id=bt.id");
    console.log("fetched contacts");
    return rows;
  } catch (error) {
    console.error("Error fetching all contacts:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getAllContactsByArmyNos(armyNos) {
  try {
    const [rows] = await pool.query("SELECT emp.id as emp_id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, ca.soldier_id,bt.id as bty_id,bt.name as bty,ca.Vill,ca.P_O,ca.Teh,ca.Dist,ca.Contact_No FROM contact_address as ca join employees as emp on ca.soldier_id=emp.Army_No join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id join bio_data as bd on ca.soldier_id=bd.Army_No join batteries as bt on bd.bty_id=bt.id where emp.Army_No in (?)", [armyNos]);
    console.log("fetched contacts");
    return rows;
  } catch (error) {
    console.error("Error fetching all contacts:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

module.exports = {
  addContactAddress,
  findContactAddressBySoldierId,
  updateContactAddress,
  getAllContacts,
  deleteContactAddress,
  getAllContactsByArmyNos,
};
