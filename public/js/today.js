const today = new Date();
const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: false  }; 

document.getElementById('currentDate').textContent = today.toLocaleDateString(undefined, dateOptions);
document.getElementById('currentTime').textContent = today.toLocaleTimeString(undefined, timeOptions);

//ใน dashboard_day
document.getElementById('day_show').textContent = `วันนี้   ${today.toLocaleDateString('th-TH', dateOptions)}`;
