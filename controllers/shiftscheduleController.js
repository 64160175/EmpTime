const db = require('../config/database');

exports.getShiftSchedule = (req, res) => {
    const { year, month } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const calendar = createCalendar(currentYear, currentMonth);
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);

    const sql = `
        SELECT s_date, u_name, s_time_in, s_time_out 
        FROM tbl_schedule 
        WHERE s_date BETWEEN ? AND ?
        ORDER BY s_date, s_time_in
    `;

    db.query(sql, [firstDay, lastDay], (err, schedules) => {
        if (err) {
            console.error("Error fetching schedules:", err);
            res.status(500).send("Error fetching schedules");
            return;
        }

        // Group schedules by date
        const schedulesMap = schedules.reduce((acc, schedule) => {
            const dateKey = schedule.s_date.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(schedule);
            return acc;
        }, {});

        // Add schedules to calendar
        calendar.forEach(week => {
            week.forEach(day => {
                if (day.date) {
                    const dateKey = new Date(currentYear, currentMonth - 1, day.date).toISOString().split('T')[0];
                    day.schedules = schedulesMap[dateKey] || [];
                }
            });
        });

        res.render('shift_schedule', {
            calendar,
            year: currentYear,
            month: currentMonth,
            monthName: getMonthName(currentMonth),
            prevMonth: currentMonth === 1 ? 12 : currentMonth - 1,
            prevYear: currentMonth === 1 ? currentYear - 1 : currentYear,
            nextMonth: currentMonth === 12 ? 1 : currentMonth + 1,
            nextYear: currentMonth === 12 ? currentYear + 1 : currentYear
        });
    });
};

function createCalendar(year, month) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendar = [];
    let week = [];

    // เพิ่มวันว่างก่อนวันที่ 1
    for (let i = 0; i < firstDay; i++) {
        week.push({ date: null });
    }

    // เพิ่มวันในเดือน
    for (let day = 1; day <= daysInMonth; day++) {
        week.push({ date: day });
        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    }

    // เพิ่มวันว่างหลังวันสุดท้ายของเดือน
    if (week.length > 0) {
        while (week.length < 7) {
            week.push({ date: null });
        }
        calendar.push(week);
    }

    return calendar;
}

function getMonthName(month) {
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return months[month - 1];
}