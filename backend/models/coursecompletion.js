const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a course_completion to the MySQL database
async function addCourseCompletionToDatabase(course_completion) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO course_completion (army_no,course_id,course_serial,course_from,course_to,institution,remarks,course_status,grade) VALUES (?,?,?,?,?,?,?,?,?)`;
        const [results] = await connection.execute(sql, [course_completion.army_no, course_completion.course_id, course_completion.course_serial, course_completion.course_from, course_completion.course_to, course_completion.institution, course_completion.remarks, course_completion.course_status, course_completion.grade]);
        course_completion.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding course_completion to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return course_completion;
};
async function findCourseCompletionByArmyNoAndCourse(army_no, course_id) {
    try {
        const [rows] = await pool.query('SELECT cc.id as id, cc.army_no, cor.id as course_id,cor.name as course_name, cc.course_serial, cc.course_from, cc.course_to, cc.institution, cc.remarks, cc.course_status,cc.grade FROM course_completion as cc join course as cor on cc.course_id=cor.id  WHERE cc.army_no =? and cc.course_id = ? ', [army_no, course_id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by Army no, Course and Rank:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findCourseCompletionById(id) {
    try {
        const [rows] = await pool.query('SELECT cc.id as id, cc.army_no, cor.id as course_id,cor.name as course_name, cc.course_serial, cc.course_from, cc.course_to, cc.institution, cc.remarks, cc.course_status,cc.grade FROM course_completion as cc join course as cor on cc.course_id=cor.id  WHERE cc.id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding Course Completion by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllCourseCompletions() {
    try {
        const [rows] = await pool.query('SELECT cc.id as id, cc.army_no,rk.name as rank,bd.Name as name, cor.id as course_id,cor.name as course_name, cc.course_serial, cc.course_from, cc.course_to, cc.institution, cc.remarks, cc.course_status,cc.grade FROM course_completion as cc join course as cor on cc.course_id=cor.id join bio_data as bd on cc.army_no=bd.Army_No join ranks as rk on bd.Rank=rk.id');
        console.log("fetched course completion");
        return rows;
    } catch (error) {
        console.error('Error fetching all course_completion:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteCourseCompletion(id) {
    try {
        const sql = `DELETE FROM course_completion WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete course_completion

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting course completion:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a course_completion in the MySQL database
async function updateCourseCompletionInDatabase(id, updatedCC) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE course_completion SET army_no  = ?, course_id = ?, course_serial = ?,course_from = ?,course_to = ?,institution = ?,remarks = ?,course_status = ?, grade = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedCC.army_no, updatedCC.course_id, updatedCC.course_serial, updatedCC.course_from, updatedCC.course_to, updatedCC.institution, updatedCC.remarks, updatedCC.course_status, updatedCC.grade, id]);
        if (results.affectedRows === 0) {
            throw new Error('Course Completion not found'); // Handle case where course_completion wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating course_completion in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addCourseCompletionToDatabase, findCourseCompletionByArmyNoAndCourse, findCourseCompletionById, updateCourseCompletionInDatabase, getAllCourseCompletions, deleteCourseCompletion }