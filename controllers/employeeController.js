const Employee = require('../models/employeeModel'); // Adjust path if needed

const employeeController = {
  showEmployeePage: (req, res) => {
    Employee.getAllEmployees((error, employees) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching employees');
      } else {
        res.render('employee', { employees: employees });
      }
    });
  },


  getEmployeeProfilePicture: (req, res) => {
    const employeeId = req.params.id; // Get employee ID from the route parameter

    Employee.getEmployeeProfilePicture(employeeId, (error, imageData) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching profile picture');
      } else if (imageData) {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // Set the correct content type (adjust if needed)
        res.end(imageData, 'binary');
      } else {
        res.status(404).send('Profile picture not found');
      }
    });
  },

  showEmployeeRecord: (req, res) => {
    const employeeId = req.params.id;

    Employee.getEmployeeById(employeeId, (error, employee) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching employee data');
      } else if (employee) {
        res.render('employee_record', { employee: employee });
      } else {
        res.status(404).send('Employee not found');
      }
    });
  },

  deleteEmployee: (req, res) => {
    const employeeId = req.params.id;

    Employee.updateEmployeeStatus(employeeId, 0, (err) => {
      if (err) {
        console.error('Error updating employee status:', err);
        return res.status(500).json({ message: 'Error deleting employee' });
      } else {
        console.log('Employee status updated successfully');
        return res.status(200).end(); // Send success response
      }
    });
  },

  

  
};

module.exports = employeeController;

