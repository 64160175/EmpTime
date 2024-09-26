// dashboardModel.js
const db = require('../config/database');

const getActiveEmployees = async () => {
  try {
    const sql = `
      SELECT f_name, l_name
      FROM tbl_user
      WHERE u_status = 1 AND u_type_name_id = 2;
    `;

    const { rows } = await db.query(sql); // Access rows property
    return rows; 
  } catch (error) {
    console.error('Error fetching active employees:', error);
    throw error;
  }
};

module.exports = {
  getActiveEmployees,
};
