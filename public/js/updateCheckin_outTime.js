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
      let formattedCheckoutTime = data.checkoutTime;
      if (data.checkoutTime && typeof data.checkoutTime === 'string') {
        const [hours, minutes] = data.checkoutTime.split(':');
        formattedCheckoutTime = `${hours}:${minutes}`;
      }
      document.getElementById('checkout-time').textContent = formattedCheckoutTime;
    })
    .catch(error => {
      console.error('Error fetching check-out time:', error);
    });
}

updateCheckoutTime();


  
