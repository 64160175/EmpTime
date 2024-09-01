const Setting = require('../models/storeSettingModel');

exports.getSettings = (req, res) => {
    Setting.getLatest((err, settingData) => {
      if (err) {
        if (err.kind === "not_found") {
          res.render('store_setting', {
            title: 'ตั้งค่าร้าน',
            setting: null, // Pass null if no settings found
            closedDays: [] // Pass empty array for closedDays if no settings
          });
        } else {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving settings."
          });
        }
      } else {
        // Fetch closed days after getting settings
        Setting.getClosedDays((err, closedDaysData) => {
          if (err) {
            // Handle error for getting closed days (e.g., log the error)
            console.error('Error fetching closed days:', err);
            closedDaysData = []; // Set to empty array if error
          } 
          res.render('store_setting', {
            title: 'ตั้งค่าร้าน',
            setting: settingData,
            closedDays: closedDaysData 
          });
        });
      }
    });
};



// เพิ่มฟังก์ชันสำหรับบันทึกข้อมูลการตั้งค่าร้าน
exports.saveShopSettings = (req, res) => {
  const newSettings = req.body;

  // Validate input data here 
  // Check if required fields are empty
  if (!newSettings.storeName || !newSettings.hourlyWage) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  // Check if hourlyWage is a valid number
  if (isNaN(newSettings.hourlyWage) || newSettings.hourlyWage <= 0) {
    return res.status(400).json({ message: 'อัตราค่าจ้าง/ชั่วโมง ไม่ถูกต้อง' });
  }

  // Convert openDays array to comma-separated string for database storage
  if (Array.isArray(newSettings.openDays)) {
    newSettings.openDays = newSettings.openDays.join(',');
  } else {
    newSettings.openDays = ''; // Or handle the case where it's not an array
  }

  Setting.updateSettings(newSettings, (err, result) => {
    if (err) {
      console.error('Error updating settings:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }

    console.log('Settings updated successfully:', result);
    return res.status(200).json({ message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
  });
};




