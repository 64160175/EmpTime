const Employee = require('../models/employeeModel'); // Adjust path if needed
const multer = require('multer');


// ตั้งค่า Multer สำหรับจัดการไฟล์อัปโหลด
const storage = multer.memoryStorage(); // เก็บรูปภาพในหน่วยความจำชั่วคราว

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // กำหนดขนาดไฟล์สูงสุด (เช่น 5MB)
  }
}).single('profilePicture'); // 'profilePicture' ต้องตรงกับชื่อ input ในฟอร์ม



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

  addEmployee: (req, res) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // เกิดข้อผิดพลาด Multer (เช่น ขนาดไฟล์เกิน)
        return res.status(400).send({ error: err.message });
      } else if (err) {
        // เกิดข้อผิดพลาดอื่นๆ
        return res.status(500).send({ error: 'Error uploading file' });
      }

      const employeeData = req.body;
      let profilePicture = null;

      if (req.file) {
        profilePicture = req.file.buffer; // รับข้อมูลรูปภาพจาก buffer
      }

      Employee.addEmployee(employeeData, profilePicture, (err, result) => {
        if (err) {
          console.error('Error adding employee:', err);
          if (err.message === 'Username already exists') {
            return res.render('employee_record_addemp', { 
              error: 'Username already exists!' 
            });
          } else {
            return res.status(500).send('Error adding employee');
          }
        }
        console.log('Employee added successfully:', result);
        return res.redirect('/employee');
      });
    });
  },




  

  
};

module.exports = employeeController;

