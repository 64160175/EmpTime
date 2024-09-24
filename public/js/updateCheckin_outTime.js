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


function updateCheckoutTime() {
  fetch('/get-checkout-time')
    .then(response => response.json())
    .then(data => {
      document.getElementById('checkout-time').textContent = data.checkoutTime; // แสดงเวลา check-out รวมวินาที
    })
    .catch(error => {
      console.error('Error fetching check-out time:', error);
    });
}

updateCheckoutTime();


  
