const Employee = require('../models/employeeModel'); // Adjust path if needed

const employeeController = {
  showEmployeePage: (req, res) => {
    Employee.getAllEmployees((error, employees) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching employees');
      } else {
        res.render('employee', { employees: employees }); // Send all employees to the view
      }
    });
  }
};

module.exports = employeeController;
