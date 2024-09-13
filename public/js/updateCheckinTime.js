function updateCheckinTime() {
    fetch('/get-checkin-time')
      .then(response => response.json())
      .then(data => {
        document.getElementById('checkin-time' ).textContent = data.checkinTime;
      })
      .catch(error => {
        console.error('Error fetching check-in time:', error);
      });
  }
  
updateCheckinTime();

  
