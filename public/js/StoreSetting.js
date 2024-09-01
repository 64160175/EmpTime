fetch('/api/settings/latest')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(setting => {
    // Update your HTML elements with the setting data
    document.getElementById('hourlyWage').textContent = setting.rate_hr;
    document.getElementById('leaveDays').textContent = setting.leave_part;
    // ... update other elements similarly
  })
  .catch(error => {
    console.error('Error fetching setting:', error);
    // Handle error, e.g., display an error message to the user
  });
