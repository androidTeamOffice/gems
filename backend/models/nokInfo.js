const pool = require("../db/db"); // Assuming the file is named db.js

async function addNokInfo(nokData) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO nok_info (army_no,name,relation,address,contact_no)VALUES (?, ?, ?, ?, ?)`;
        const [results] = await connection.execute(sql, [
            nokData.army_no, nokData.name, nokData.relation, nokData.address, nokData.contact_no,]);
    } catch (error) {
        console.error('Error adding NOK info:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
}

async function findNokInfoByArmyNo(armyNo) {
    try {
        const [rows] = await pool.query('SELECT emp.id as id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, emp.Army_No,ni.name as ni_name, ni.relation,ni.address,ni.contact_no FROM nok_info as ni join employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id where ni.army_no = ?', [armyNo]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding NOK info by army No:', error);
        // You can also throw a specific error here for handling in the route handler
    }
}

async function findNokInfoByArmyNoAndName(armyNo, nok_name) {
    try {
        const [rows] = await pool.query('SELECT emp.id as id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, emp.Army_No,ni.name as ni_name, ni.relation,ni.address,ni.contact_no FROM nok_info as ni join employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id where ni.army_no = ? and ni.name=?', [armyNo, nok_name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding NOK info by army No:', error);
        // You can also throw a specific error here for handling in the route handler
    }
}

async function findNokInfoById(id) {
    try {
        const [rows] = await pool.query('SELECT emp.id as id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, emp.Army_No,ni.name as ni_name, ni.relation,ni.address,ni.contact_no FROM nok_info as ni join employees as emp  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id  WHERE ni.id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding NOK info by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
}

async function updateNokInfo(id, updatedNokInfo) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE nok_info SET army_no = ?,name = ?,relation = ?,address = ?,contact_no = ? WHERE id = ?`;
        await connection.execute(sql, [
            updatedNokInfo.army_no, updatedNokInfo.name, updatedNokInfo.relation, updatedNokInfo.address, updatedNokInfo.contact_no, id,
        ]);
    } catch (error) {
        console.error('Error updating NOK info:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
}

async function deleteNokInfo(id) {
    const connection = await pool.getConnection();
    try {
        const sql = `DELETE FROM nok_info WHERE id = ?`;
        const [result] = await connection.execute(sql, [id]);
        return result.affectedRows > 0; // Return true if a row was deleted
    } catch (error) {
        console.error('Error deleting NOK info:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
}

async function getAllNokInfos() {
    try {
        const [rows] = await pool.query('SELECT emp.id as id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, emp.Army_No,ni.name as ni_name,bt.id as bty_id,bt.name as bty, ni.relation,ni.address,ni.contact_no FROM nok_info as ni join employees as emp on ni.army_no=emp.Army_No  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id  join bio_data as bd on ni.army_no=bd.Army_No join batteries as bt on bd.bty_id=bt.id');
        console.log("fetched NokInfos");
        return rows;
    } catch (error) {
        console.error('Error fetching all Nok Infos:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllNokInfosByArmyNos(armyNos) {
    try {
        const [rows] = await pool.query('SELECT emp.id as id, emp.name as name, cd.id as cadre_id, cd.name as cadre_name, rk.id as rank_id,rk.name as rank_name, emp.Army_No,ni.name as ni_name,bt.id as bty_id,bt.name as bty, ni.relation,ni.address,ni.contact_no FROM nok_info as ni join employees as emp on ni.army_no=emp.Army_No  join ranks as rk on emp.rank_id = rk.id join cadres as cd on emp.cadre_id = cd.id  join bio_data as bd on ni.army_no=bd.Army_No join batteries as bt on bd.bty_id=bt.id where emp.Army_No in (?) ', [armyNos]);
        console.log("fetched NokInfos");
        return rows;
    } catch (error) {
        console.error('Error fetching all Nok Infos:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};

module.exports = {
    addNokInfo,
    findNokInfoByArmyNo,
    findNokInfoById,
    updateNokInfo,
    deleteNokInfo,
    findNokInfoByArmyNoAndName,
    getAllNokInfos,
    getAllNokInfosByArmyNos,
};
