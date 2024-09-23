const db = require('../config/database'); // Assuming you have a database connection setup

const CalendarModel = {
  getEventsForMonth: (year, month, callback) => {
    // Construct your SQL query to fetch events for the given year and month
    const sql = `
      SELECT event_id, event_title, event_date 
      FROM events 
      WHERE YEAR(event_date) = ? AND MONTH(event_date) = ?
    `;

    // Execute the query
    db.query(sql, [year, month], (err, results) => {
      if (err) {
        console.error("Error fetching events:", err);
        callback(err, null); // Pass the error to the callback
      } else {
        callback(null, results); // Pass the results to the callback
      }
    });
  }
};

module.exports = CalendarModel;