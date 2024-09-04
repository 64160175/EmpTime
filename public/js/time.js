function displayTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('current-time').textContent = timeString;
  }
  
  displayTime(); // Display time on page load
  setInterval(displayTime, 1000); // Update time every second