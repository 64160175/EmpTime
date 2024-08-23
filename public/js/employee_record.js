
  document.getElementById('confirmDelete').addEventListener('click', function() {
    const employeeId = this.dataset.employeeId;

    fetch(`/employee/delete/${employeeId}`, { 
      method: 'DELETE' 
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/employee';
      } else {
        // Handle errors, e.g., display an error message
        console.error('Error deleting employee');
      }
    })
    .catch(error => {
      console.error('Error deleting employee:', error);
    });
  });
