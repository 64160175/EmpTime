// Global variables
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let month;
let year;

// Function to generate the calendar grid
function generateCalendar(y, m) {
  year = y || new Date().getFullYear();
  month = m || new Date().getMonth();

  const calendarEl = document.getElementById('calendar');
  const monthYearEl = document.getElementById('month-year');
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  const firstDay = (new Date(year, month)).getDay();
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  let calendarHTML = '<tr>';
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 7; i++) {
    calendarHTML += `<th>${daysOfWeek[i]}</th>`;
  }
  calendarHTML += '</tr>';

  let date = 1;
  for (let i = 0; i < 6; i++) {
    calendarHTML += '<tr>';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        calendarHTML += '<td></td>';
      } else if (date > daysInMonth) {
        break;
      } else {
        if (date === currentDate && month === currentMonth && year === currentYear) {
          calendarHTML += `<td data-date="${year}-${month + 1}-${date}" onclick="handleDayClick(this)" style="background-color: lightgray;">${date}</td>`;
        } else {
          calendarHTML += `<td data-date="${year}-${month + 1}-${date}" onclick="handleDayClick(this)">${date}</td>`;
        }
        date++;
      }
    }
    calendarHTML += '</tr>';
  }

  calendarEl.innerHTML = calendarHTML;
}

// Function to handle day click
function handleDayClick(cell) {
  const date = cell.dataset.date;
  const cellDate = new Date(date); // Create a Date object from the cell's date
  const today = new Date(); // Get today's date

  // Allow click only if the date is today or later
  if (cellDate >= today) {
    const imageUrl = getImageForDate(date);

    document.getElementById("popupDate").innerText =
      `${parseInt(date.split('-')[2])} ${monthNames[month]} ${year}`;
    document.getElementById("popupImage").src = imageUrl;

    document.getElementById('dateInput').value = date;
    document.getElementById("eventPopup").style.display = "block";
  }
}

function closePopup() {
  document.getElementById("eventPopup").style.display = "none";
}

document.getElementById('saveButton').addEventListener('click', function () {
  const date = document.getElementById('dateInput').value;  // Get date from popup
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  // Basic validation (You can enhance this)
  if (!startTime || !endTime) {
    alert("Please enter both start and end times.");
    return;
  }
  // Save the event data (using local storage for this example)
  saveEvent(date, startTime, endTime);

  // Update the calendar display to show the saved times
  updateCalendarWithEvent(date, startTime, endTime);

  // Close the popup
  closePopup();

  // Extract year and month from the date
  const year = parseInt(date.split('-')[0]);
  const month = parseInt(date.split('-')[1]) - 1; // Month is 0-indexed
  
  generateCalendar(year, month);
});

function updateCalendarWithEvent(date, startTime, endTime) {
  const cell = document.querySelector(`#calendar td[data-date="${date}"]`);
  if (cell) {
    // Display the saved times in the cell
    cell.innerHTML = `${parseInt(date.split('-')[2])}<br>${startTime} - ${endTime}`; 
  }
}

// Function to save event data (replace with your preferred storage method)
function saveEvent(date, startTime, endTime) {
  // Example using local storage:
  let events = JSON.parse(localStorage.getItem('events') || '{}');
  events[date] = { start: startTime, end: endTime };
  localStorage.setItem('events', JSON.stringify(events));
}

// Function to update the calendar display with the saved event
function updateCalendarWithEvent(date, startTime, endTime) {
  const cell = document.querySelector(`#calendar td[data-date="${date}"]`);
  if (cell) {
    cell.innerHTML = `${parseInt(date.split(' ')[0])}<br>${startTime} - ${endTime}`;
  }
}


function getImageForDate(date) {
  // Replace this with your actual logic to get the image URL
  if (date === '2024-4-10') {
    return '/images/example.jpg';
  } else {
    return '/images/default.jpg';
  }
}

// Generate the calendar on page load
generateCalendar();