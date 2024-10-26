const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a course to the MySQL database
async function addCourseToDatabase(course) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO course (name,for_cadre,details) VALUES (?,?,?)`;
        const [results] = await connection.execute(sql, [course.name, course.for_cadre, course.details]);
        course.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding course to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return course;
};
async function findCourseByName(name) {
    try {
        const [rows] = await pool.query('SELECT cr.id as id, cr.name as name, cd.id as for_cadre,cd.name as for_cadre_name, cr.details FROM course as cr join cadres as cd on cr.for_cadre=cd.id WHERE cr.name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findCourseById(id) {
    try {
        const [rows] = await pool.query('SELECT cr.id as id, cr.name as name, cd.id as for_cadre,cd.name as for_cadre_name, cr.details FROM course as cr join cadres as cd on cr.for_cadre=cd.id WHERE cr.id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding course by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllCourses() {
    try {
        const [rows] = await pool.query('SELECT cr.id as id, cr.name as name, cd.id as for_cadre,cd.name as for_cadre_name, cr.details FROM course as cr join cadres as cd on cr.for_cadre=cd.id');
        console.log("fetched course");
        return rows;
    } catch (error) {
        console.error('Error fetching all course:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteCourse(id) {
    try {
        const sql = `DELETE FROM course WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete course

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting course:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a course in the MySQL database
async function updateCourseInDatabase(id, updatedCourse) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE course SET name = ?,for_cadre = ?,details = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedCourse.name, updatedCourse.for_cadre, updatedCourse.details, id]);
        if (results.affectedRows === 0) {
            throw new Error('Course not found'); // Handle case where course wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating course in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addCourseToDatabase, findCourseByName, findCourseById, updateCourseInDatabase, getAllCourses, deleteCourse }