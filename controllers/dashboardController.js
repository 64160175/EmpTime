// dashboardController.js
const dashboardModel = require('../models/dashboardModel');
const Employee = require('../models/employeeModel'); // Make sure this path is correct

// ... rest of your controller code ... 


const getDashboardDay = async (req, res) => {
  try {
    // 1. ดึงข้อมูลพนักงานจากฐานข้อมูล
    Employee.getAllEmployees((error, employees) => { // Corrected to use callback
      if (error) {
        console.error(error);
        return res.status(500).send('Error fetching employee data');
      }

      // 2. ดึงข้อมูลพนักงานที่ active
      dashboardModel.getActiveEmployees()
        .then(activeEmployees => {
          // 3. ส่งข้อมูลไปยัง template 'dashboard_day'
          res.render('dashboard_day', { employees: employees, activeEmployees: activeEmployees });
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Error fetching active employee data');
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching employee data');
  }
};

module.exports = {
  getDashboardDay,
};
