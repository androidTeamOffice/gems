const pool = require('../db/db'); // Assuming the file is named db.js


async function fetchAppointmentSlots(currentDay) {
    const connection = await pool.getConnection();
    try {
    const sql = `
    SELECT Appointment_Time, COUNT(*) as bookings 
    FROM civdatas 
    WHERE Appointment_Day = ? 
    GROUP BY Appointment_Time
`;

const [rows] = await pool.query(sql, [currentDay]);
return rows || null;
} catch (error) {
    console.error('Error fetching appointment time slots from database:', error);
    throw error; // Re-throw the error for handling in the API route
} finally {
    connection.release();
}
};
// Function to add a civData to the MySQL database

async function addCivDataToDatabase(civData) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO civdatas(
            \`name\`,\`userId\`, \`cnic\`, \`occupation\`, \`category\`, \`type\`, \`status\`, \`remarks\`,
            \`Card_Duration\`, \`Vehicle_Registration_No\`, \`Mobile_no\`, \`Home_phone_no\`,
            \`FCNIC\`, \`Father_Husband_Name\`, \`Gaurdian_Contact\`, \`Gaurdian_CNIC\`, 
            \`Gaurdian_Occupation\`,  \`Present_Address\`, 
            \`Permanent_Address\`, \`Profile_Picture\`, \`Disability\`, \`Description\`, 
            \`Vehicle_Make\`, \`Vehicle_Model\`, \`Vehicle_Type\`, \`Previous_Card_Picture\`, \`BCNIC\`, \`Vehicle_Documents\`,
            \`Police_Verification_Document\`, \`Appointment_Day\`, \`Appointment_Time\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        const [results] = await connection.execute(sql, [civData.name, civData.userid, civData.cnic, civData.occupation, civData.category, civData.type,
             "New", civData.remarks, civData.Card_Duration, civData.Vehicle_Registration_No, civData.Mobile_no,
              civData.Home_phone_no, civData.fCNIC, civData.Father_Husband_Name, civData.Gaurdian_Contact, civData.Gaurdian_CNIC,
               civData.Gaurdian_Occupation,   civData.Present_Address, civData.Permanent_Address, civData.Profile_Picture,
                civData.Disability, civData.Description, civData.Vehicle_Make, civData.Vehicle_Model, civData.Vehicle_Type, 
                civData.Previous_Card_Picture, civData.bCNIC,
            civData.Vehicle_Documents, civData.Police_Verification_Document, civData.Appointment_Day, civData.Appointment_Time]);
        civData.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding civData to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return civData;
};
const saveDisabledDatesToDatabase = async (dates) => {
    try {
      // Use parameterized query to avoid SQL injection
      const values = dates.map(() => "?").join(",");
      const query = `INSERT INTO disabled_dates (date) VALUES (${values})`;
      console.log("value : ", values);
      console.log("query : ", query);
      // Execute the query with date values as parameters
      await pool.query(query, dates);
    } catch (error) {
      console.error("Database error while saving dates:", error);
      throw new Error("Database error while saving dates");
    }
  };
  
async function findCivDataByCNIC(cnic) {
    try {
        const [rows] = await pool.query('SELECT * FROM civdatas WHERE cnic = ?', [cnic]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by cnic:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findCivDataById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM civdatas WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding civData by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllCivDatas() {
    try {
        const [rows] = await pool.query("SELECT * FROM civdatas where status = 'New'");
        console.log("fetched civDatas");
        return rows;
    } catch (error) {
        console.error('Error fetching all civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllDisabledDates() {
    try {
        const [rows] = await pool.query("SELECT * FROM disabled_dates");
        console.log("fetched disabled dates.");
        return rows;
    } catch (error) {
        console.error('Error fetching all civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllVerifiedCivDatas() {
    try {
        const [rows] = await pool.query("SELECT * FROM civdatas where status <> 'New'");
        console.log("fetched civDatas");
        return rows;
    } catch (error) {
        console.error('Error fetching all civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteCivData(id) {
    try {
        const sql = `DELETE FROM civdatas WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete civData

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function rejectCivData(id,remarks) {
    try {
        const sql = `update civdatas set status='Rejected' , remarks=? WHERE id = ?`;
        const result = await pool.execute(sql, [remarks,id]); // Delete civData

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function verifyCivData(id) {
    try {
        const sql = `update civdatas set status='Verified', remarks='' WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete civData

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error verifyCivData civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};

async function verifyStatus(id) {
    try {
        const sql = `SELECT status FROM civdatas WHERE user_cnic = ? ORDER BY Appointment_Day DESC LIMIT 1`;

        const result = await pool.execute(sql, [id]); // Delete civData

       
        return result;
    } catch (error) {
        console.error('Error status civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a civData in the MySQL database
async function updateCivDataInDatabase(id, updatedCivData) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE civdatas SET name = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedCivData.name, id]);
        if (results.affectedRows === 0) {
            throw new Error('CivData not found'); // Handle case where civData wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating civData in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addCivDataToDatabase, saveDisabledDatesToDatabase, findCivDataByCNIC, findCivDataById, updateCivDataInDatabase, getAllCivDatas, getAllVerifiedCivDatas, deleteCivData, rejectCivData,verifyCivData ,verifyStatus,getAllDisabledDates,fetchAppointmentSlots}
