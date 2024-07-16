const today = new Date();
const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
document.getElementById('day_show').textContent = `วันนี้   ${today.toLocaleDateString('th-TH', dateOptions)}`;
