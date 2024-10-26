const { pool } = require("../db/db"); // Assuming the file is named db.js

async function addPromotionStatus(promotionStatusData) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO promotion_status (army_no,trade_cl,other_trade_cl,mr,estm_i,estm_ii,estm_adv,bcc,blc,jnc,pc,jncoc,jnac,fceic,
        commic,ogmic,jnmt,jnbic,jlc,jla,snc,allc,adm_course,qual_course,other_adventure_course,lacking_cl,qual_unqual,financial_disc,ere_att_dates,
        red_ink_entry,indl_sign,date_prom_postinf_sos,unit_comd_sign)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [results] = await connection.execute(sql, [
            promotionStatusData.army_no, promotionStatusData.trade_cl, promotionStatusData.other_trade_cl, promotionStatusData.mr, promotionStatusData.estm_i,
            promotionStatusData.estm_ii, promotionStatusData.estm_adv, promotionStatusData.bcc, promotionStatusData.blc, promotionStatusData.jnc,
            promotionStatusData.pc, promotionStatusData.jncoc, promotionStatusData.jnac, promotionStatusData.fceic, promotionStatusData.commic,
            promotionStatusData.ogmic, promotionStatusData.jnmt, promotionStatusData.jnbic, promotionStatusData.jlc, promotionStatusData.jla,
            promotionStatusData.snc, promotionStatusData.allc, promotionStatusData.adm_course, promotionStatusData.qual_course, promotionStatusData.other_adventure_course,
            promotionStatusData.lacking_cl, promotionStatusData.qual_unqual, promotionStatusData.financial_disc, promotionStatusData.ere_att_dates, promotionStatusData.red_ink_entry,
            promotionStatusData.indl_sign, promotionStatusData.date_prom_postinf_sos, promotionStatusData.unit_comd_sign,]);
    } catch (error) {
        console.error('Error adding promotion status:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
}

async function findPromotionStatusByArmyNo(armyNo) {
    try {
        const [rows] = await pool.query('SELECT * FROM promotion_status WHERE army_no = ?', [armyNo]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding promotion status by army No:', error);
        // You can also throw a specific error here for handling in the route handler
    }
}

async function findPromotionStatusById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM promotion_status WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding promotion status by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
}

async function updatePromotionStatus(id, updatedPromotionStatus) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE promotion_status SET army_no = ?,trade_cl = ?,other_trade_cl = ?,mr = ?,estm_i = ?,estm_ii = ?,estm_adv = ?,bcc = ?,
        blc = ?,jnc = ?,pc = ?,jncoc = ?,jnac = ?,fceic = ?,commic = ?,ogmic = ?,jnmt = ?,jnbic = ?,jlc = ?,jla = ?,snc = ?,allc = ?,adm_course = ?,
        qual_course = ?,other_adventure_course = ?,lacking_cl = ?,qual_unqual = ?,financial_disc = ?,ere_att_dates = ?,red_ink_entry = ?,indl_sign = ?,
        date_prom_postinf_sos = ?,unit_comd_sign = ?WHERE id = ?`;
        const [results] = await connection.execute(sql, [
            updatedPromotionStatus.army_no, updatedPromotionStatus.trade_cl, updatedPromotionStatus.other_trade_cl, updatedPromotionStatus.mr,
            updatedPromotionStatus.estm_i, updatedPromotionStatus.estm_ii, updatedPromotionStatus.estm_adv, updatedPromotionStatus.bcc, updatedPromotionStatus.blc,
            updatedPromotionStatus.jnc, updatedPromotionStatus.pc, updatedPromotionStatus.jncoc, updatedPromotionStatus.jnac, updatedPromotionStatus.fceic, updatedPromotionStatus.commic,
            updatedPromotionStatus.ogmic, updatedPromotionStatus.jnmt, updatedPromotionStatus.jnbic, updatedPromotionStatus.jlc, updatedPromotionStatus.jla, updatedPromotionStatus.snc,
            updatedPromotionStatus.allc, updatedPromotionStatus.adm_course, updatedPromotionStatus.qual_course, updatedPromotionStatus.other_adventure_course, updatedPromotionStatus.lacking_cl,
            updatedPromotionStatus.qual_unqual, updatedPromotionStatus.financial_disc, updatedPromotionStatus.ere_att_dates, updatedPromotionStatus.red_ink_entry, updatedPromotionStatus.indl_sign,
            updatedPromotionStatus.date_prom_postinf_sos, updatedPromotionStatus.unit_comd_sign, id,]);
    } catch (error) {
        console.error('Error updating promotion status:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
}
async function deletePromotionStatus(id) {
    const connection = await pool.getConnection();
    try {
        const sql = `DELETE FROM promotion_status WHERE id = ?`;
        const [result] = await connection.execute(sql, [id]);
        return result.affectedRows === 1; // Return true if 1 row deleted
    } catch (error) {
        console.error('Error deleting promotion status:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
}


module.exports = {
    addPromotionStatus,
    findPromotionStatusByArmyNo,
    findPromotionStatusById,
    updatePromotionStatus,
    deletePromotionStatus,
};