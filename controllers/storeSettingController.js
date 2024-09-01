const Setting = require('../models/storeSettingModel');

exports.getSettings = (req, res) => {
  Setting.getLatest((err, settingData, weekData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.render('store_setting', {
          title: 'ตั้งค่าร้าน',
          setting: null,
          closedDays: [],
          weekData: [],
        });
      } else {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving settings."
        });
      }
    } else {
      const closedDays = weekData
        .filter(day => day.close_res === 0)
        .map(day => day.day_close);

      res.render('store_setting', {
        title: 'ตั้งค่าร้าน',
        setting: settingData,
        closedDays: closedDays,
        weekData: weekData,
      });
    }
  });
};

exports.saveShopSettings = (req, res) => {
  const newSettings = {
    id: req.body.id, // Assuming you have a hidden input field for the ID
    storeName: req.body.storeName,
    hourlyWage: req.body.hourlyWage,
    leaveDays: req.body.leaveDays,
    lateDays: req.body.lateDays,
    absentDays: req.body.absentDays,
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
  };

  // Assuming you're getting openDays as an array of day names (e.g., ["Monday", "Tuesday"])
  const openDays = [
    req.body.openDays && req.body.openDays.includes('Monday'),
    req.body.openDays && req.body.openDays.includes('Tuesday'),
    req.body.openDays && req.body.openDays.includes('Wednesday'),
    req.body.openDays && req.body.openDays.includes('Thursday'),
    req.body.openDays && req.body.openDays.includes('Friday'),
    req.body.openDays && req.body.openDays.includes('Saturday'),
    req.body.openDays && req.body.openDays.includes('Sunday'),
  ];

  Setting.updateSettings(newSettings, openDays, (err, result) => {
    if (err) {
      console.error('Error updating settings:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }

    console.log('Settings updated successfully:', result);
    return res.redirect('/store_setting'); // Redirect back to the settings page
  });
};
