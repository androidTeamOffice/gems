const pool = require("../db/db"); // Assuming the file is named db.js
async function addBioDataToDatabase1() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bio_data "
    );
    rows.map(async (bioData) => {
      const sqlEmp = `INSERT INTO employees(name, cadre_id, rank_id, Army_No) VALUES (?,?,?,?)`;

      const [resultsEmp] = await connection.execute(sqlEmp, [
        bioData.Name,
        bioData.Trade,
        bioData.Rank,
        bioData.Army_No,
      ]);
    });

  } catch (error) {
    console.error("Error adding bio data to database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
// Function to add a BioData to the MySQL database
async function addBioDataToDatabase(bioData) {
  const connection = await pool.getConnection();
  try {
    const sql = `
      INSERT INTO bio_data (Army_No,Rank,Trade,Name,CNIC_Indl,Father_Name,Med_Cat,Bdr_Dist,Sect,Md_Unmd,Blood_Gp,Cl_Cast,Svc_Bkt_Years,Total_Svc,
        Remaining_Svc,DOB,DOE,DOPR,TOS,SOS,Civ_Edn,qual_unqual,bty_id,image,lve_circle,district)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)
    `;
    const sqlEmp = `INSERT INTO employees(name, cadre_id, rank_id, Army_No) VALUES (?,?,?,?)`;

    const [results] = await connection.execute(sql, [
      bioData.Army_No,
      bioData.Rank,
      bioData.Trade,
      bioData.Name,
      bioData.CNIC_Indl,
      bioData.Father_Name,
      bioData.Med_Cat,
      bioData.Bdr_Dist,
      bioData.Sect,
      bioData.Md_Unmd,
      bioData.Blood_Gp,
      bioData.Cl_Cast,
      bioData.Svc_Bkt_Years,
      bioData.Total_Svc,
      bioData.Remaining_Svc,
      bioData.DOB,
      bioData.DOE,
      bioData.DOPR,
      bioData.TOS,
      bioData.SOS,
      bioData.Civ_Edn,
      bioData.qual_unqual,
      bioData.bty_id,
      bioData.image,
      bioData.lve_circle_id,
      bioData.district,
    ]);
    bioData.id = results.insertId; // Set the generated ID on the bioData object
    const [resultsEmp] = await connection.execute(sqlEmp, [
      bioData.Name,
      bioData.Trade,
      bioData.Rank,
      bioData.Army_No,
    ]);
  } catch (error) {
    console.error("Error adding bio data to database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
  return bioData;
}

async function findBioDataByName(name) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bio_data WHERE Army_No = ?",
      [name]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding BioData by name:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findBioDataByArmyNo(armyNo) {
  try {
    const [rows] = await pool.query(
      "SELECT bd.Army_No, rk.id as rank_id, rk.name as rank, cd.id as cadre_id,cd.name as Trade,bt.id as bty_id,bt.name as bty,lvc.id as lve_circle_id, lvc.name as lveCircle,bd.qual_unqual as qual_unqual,bd.Name,bd.CNIC_Indl, bd.Father_Name, MS.id AS medical_status_id, ms.name as Med_Cat, bd.Bdr_Dist, bd.Sect, bd.Md_Unmd, bd.Blood_Gp, bd.Cl_Cast, bd.Svc_Bkt_Years, bd.Total_Svc, bd.Remaining_Svc, bd.DOB,bd.DOE, bd.DOPR, bd.TOS, bd.SOS, bd.Civ_Edn , bd.image FROM bio_data as bd join ranks as rk on bd.Rank = rk.id join cadres as cd on bd.Trade = cd.id join medicalstatuses as ms on bd.Med_Cat = ms.id join batteries as bt on bd.bty_id=bt.id join lve_circles as lvc on bd.lve_circle=lvc.id WHERE Army_No = ?",
      [armyNo]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding bio data by Army No:", error);
    // You can also throw a specific error here for handling in the route handler
  }
} async function SearchData(
  indlName,
  rank,
  trade,
  medicalCategory,
  martialStatus,
  bloodGp,
  clCast,
  qualStatus,
  bty_id
) {
  try {
    let sql = `
      SELECT 
        bd.Army_No,
        bd.Rank,
        bd.Trade,
        bd.Name,
        bd.CNIC_Indl,
        bd.Father_Name,
        bd.Med_Cat,
        bd.Bdr_Dist,
        bd.Sect,
        bd.Md_Unmd,
        bd.Blood_Gp,
        bd.Cl_Cast,
        bd.Svc_Bkt_Years,
        bd.Total_Svc,
        bd.Remaining_Svc,
        bd.DOB,
        bd.DOE,
        bd.DOPR,
        bd.TOS,
        bd.SOS,
        bd.Civ_Edn,
        bd.qual_unqual,
        bd.bty_id,
        bd.image
      FROM bio_data as bd
    `;

    const conditions = [];
    if (indlName) conditions.push(`bd.Name LIKE CONCAT('%', '${indlName}', '%')`);
    if (rank) conditions.push(`bd.Rank = '${rank}'`);
    if (trade) conditions.push(`bd.Trade = '${trade}'`);
    if (medicalCategory) conditions.push(`bd.Med_Cat = ${medicalCategory}`);
    if (martialStatus) conditions.push(`bd.Md_Unmd = '${martialStatus}'`);
    if (bloodGp) conditions.push(`bd.Blood_Gp = '${bloodGp}'`);
    if (clCast) conditions.push(`bd.Cl_Cast = '${clCast}'`);
    if (qualStatus) conditions.push(`bd.qual_unqual = '${qualStatus}'`);
    if (bty_id) conditions.push(`bd.bty_id = ${bty_id}`);

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    console.log("sql: " + sql);
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error("Error finding bio data:", error);
    throw error;
  }
}


async function LeaveReport(bty_id, start_date, end_date) {
  console.log("startDate" + start_date);
  console.log("end_date" + end_date);
  console.log("end_date" + bty_id);
  try {
    const [rows] = await pool.query(
      "SELECT bd.Army_No,rk.name AS rankName,bd.Name AS indlName,bt.name AS btyName,loc.name AS locName,bd.district AS District,lvc.name AS LveCircle,lvc.distance AS Distance,lvc.lveGt AS LveGrant,lv.avail_till_date AS lastLve,CONCAT(CASE WHEN FLOOR(DATEDIFF(CURRENT_DATE(), lv.avail_till_date) / 30) = 1 THEN '1 month ' WHEN FLOOR(DATEDIFF(CURRENT_DATE(), lv.avail_till_date) / 30) > 1 THEN CONCAT(FLOOR(DATEDIFF(CURRENT_DATE(), lv.avail_till_date) / 30), ' months ') ELSE '' END, CASE WHEN MOD(DATEDIFF(CURRENT_DATE(), lv.avail_till_date), 30) = 1 THEN '1 day' WHEN MOD(DATEDIFF(CURRENT_DATE(), lv.avail_till_date), 30) > 1 THEN CONCAT(MOD(DATEDIFF(CURRENT_DATE(), lv.avail_till_date), 30), ' days') ELSE '' END ) AS duration, GROUP_CONCAT(CONCAT('(',ltx.name, ',',locx.name,   ',',        lv.start_date, ',' ,lv.end_date, ',',DATEDIFF(lv.end_date, lv.start_date) + 1, ')') ORDER BY lv.start_date SEPARATOR ', ') AS leaveDetails FROM leaves lv JOIN employees emp ON lv.employee_id = emp.id left JOIN bio_data bd ON emp.Army_No=bd.Army_No left JOIN ranks rk ON bd.Rank = rk.id  left JOIN batteries bt ON bd.bty_id = bt.id left JOIN locations loc ON emp.loc_id = loc.id left JOIN lve_circles lvc ON bd.lve_circle = lvc.id left JOIN leavetypes ltx ON lv.leave_type_id = ltx.id left JOIN locations locx ON lv.loc_id = locx.id WHERE  /*lv.avail_till_date = (SELECT MAX(lv1.avail_till_date) FROM leaves as lv1 WHERE lv1.avail_till_date <= CURRENT_DATE()        ORDER BY ABS(DATEDIFF(lv1.avail_till_date, CURRENT_DATE())) LIMIT 1) AND*/ lv.start_date >= ? AND lv.end_date <= ? AND bd.bty_id=? GROUP BY bd.Army_No;",
      [start_date, end_date, bty_id]
    );
    return rows || null;
  } catch (error) {
    console.error("Error finding bio data by Army No:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getAllBioData() {
  try {
    const [rows] = await pool.query(
      "SELECT bd.Army_No, rk.id as rank_id, rk.name as rank, cd.id as cadre_id,cd.name as Trade,bt.id as bty_id,bt.name as bty,lvc.id as lve_circle_id, lvc.name as lveCircle,bd.qual_unqual as qual_unqual,bd.Name,bd.CNIC_Indl, bd.Father_Name, MS.id AS medical_status_id, ms.name as Med_Cat, bd.Bdr_Dist, bd.Sect, bd.Md_Unmd, bd.Blood_Gp, bd.Cl_Cast, bd.Svc_Bkt_Years, bd.Total_Svc, bd.Remaining_Svc, bd.DOB,bd.DOE, bd.DOPR, bd.TOS, bd.SOS, bd.Civ_Edn , bd.image , bd.district FROM bio_data as bd join ranks as rk on bd.Rank = rk.id join cadres as cd on bd.Trade = cd.id join medicalstatuses as ms on bd.Med_Cat = ms.id join batteries as bt on bd.bty_id=bt.id join lve_circles as lvc on bd.lve_circle=lvc.id ORDER by rk.id ASC"
    );
    return rows;
  } catch (error) {
    console.error("Error fetching all bio data:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function deleteBioData(armyNo) {
  try {
    const sql = `DELETE FROM bio_data WHERE Army_No = ?`;
    const result = await pool.execute(sql, [armyNo]); // Delete bio data

    if (result[0].affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting bio data:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

// Function to update a BioData in the MySQL database
async function updateBioDataInDatabase(armyNo, updatedBioData) {
  const connection = await pool.getConnection();
  try {
    const sql = `UPDATE bio_data SET Rank = ?,Trade = ?,Name = ?,CNIC_Indl = ?,Father_Name = ?,Med_Cat = ?,Bdr_Dist = ?,Sect = ?,
        Md_Unmd = ?,Blood_Gp = ?,Cl_Cast = ?,Svc_Bkt_Years = ?,Total_Svc = ?,Remaining_Svc = ?,DOB = ?,DOE = ?,DOPR = ?,TOS = ?,SOS = ?,Civ_Edn = ?,
        qual_unqual = ?,bty_id = ?, image=?, lve_circle=?,district=? 
      WHERE Army_No = ?
    `;
    const [results] = await connection.execute(sql, [
      updatedBioData.Rank,
      updatedBioData.Trade,
      updatedBioData.Name,
      updatedBioData.CNIC_Indl,
      updatedBioData.Father_Name,
      updatedBioData.Med_Cat,
      updatedBioData.Bdr_Dist,
      updatedBioData.Sect,
      updatedBioData.Md_Unmd,
      updatedBioData.Blood_Gp,
      updatedBioData.Cl_Cast,
      updatedBioData.Svc_Bkt_Years,
      updatedBioData.Total_Svc,
      updatedBioData.Remaining_Svc,
      updatedBioData.DOB,
      updatedBioData.DOE,
      updatedBioData.DOPR,
      updatedBioData.TOS,
      updatedBioData.SOS,
      updatedBioData.Civ_Edn,
      updatedBioData.qual_unqual,
      updatedBioData.bty_id,
      updatedBioData.image,
      updatedBioData.lve_circle_id,
      updatedBioData.district,

      armyNo,
    ]);
    if (results.affectedRows === 0) {
      throw new Error("Bio data not found"); // Handle case where bio data wasn't updated (not found)
    }
  } catch (error) {
    console.error("Error updating bio data in database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}

module.exports = {
  addBioDataToDatabase,
  findBioDataByName,
  findBioDataByArmyNo,
  updateBioDataInDatabase,
  getAllBioData,
  deleteBioData,
  SearchData,
  LeaveReport,
  addBioDataToDatabase1,
};
