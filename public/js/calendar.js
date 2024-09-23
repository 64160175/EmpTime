document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
        "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
        "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    function getThaiDate() {
      const date = new Date();
      const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
      };
      return date.toLocaleDateString('th-TH', options); 
  }
  // Update the content of the <p> tag with the current date
  document.getElementById('currentDate').textContent = getThaiDate();


    function generateCalendar(year, month) {
        const firstDay = (new Date(year, month)).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        const calendarEl = document.getElementById('calendar');
        calendarEl.innerHTML = '';

        const calendarHeader = document.createElement('div');
        calendarHeader.classList.add('calendar-header');
        calendarHeader.innerHTML = `
        <h2>${months[month]} ${year}</h2>
        <div class="calendar-nav">
          <button id="prevMonth" class="calendar-btn">&lt;</button>
          <button id="nextMonth" class="calendar-btn">&gt;</button>
        </div>
      `;
        calendarEl.appendChild(calendarHeader);

        const calendarTable = document.createElement('table');
        calendarTable.classList.add('calendar-table');
        let tableContent = '<tr><th>อา.</th><th>จ.</th><th>อ.</th><th>พ.</th><th>พฤ.</th><th>ศ.</th><th>ส.</th></tr>';

        let dayCounter = 1;
        let date = 1;
        for (let i = 0; i < 5; i++) {
            tableContent += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    tableContent += '<td></td>';
                } else if (dayCounter > daysInMonth) {
                    tableContent += '<td></td>';
                } else {
                    tableContent += `
              <td data-day="${dayCounter}">
                <div class="day-container">
                  <span class="day-number">${date}</span>
                  <div class="event-container" id="event-container-${date}"></div> 
                </div>
              </td>
            `;
                    dayCounter++;
                    date++;
                }
            }
            tableContent += '</tr>';
        }
        calendarTable.innerHTML = tableContent;
        calendarEl.appendChild(calendarTable);

        // Fetch events for the month from the server
        fetch(`/getEvents?year=${year}&month=${month + 1}`)
            .then(response => response.json())
            .then(events => {
                events.forEach(event => {
                    const eventDate = new Date(event.event_date);
                    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
                        const day = eventDate.getDate();
                        const eventContainer = document.getElementById(`event-container-${day}`);
                        if (eventContainer) {
                            const eventElement = document.createElement('div');
                            eventElement.classList.add('event');
                            eventElement.textContent = event.event_title;
                            eventContainer.appendChild(eventElement);
                        }
                    }
                });
            });

        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');

        prevMonthBtn.addEventListener('click', () => {
            if (month === 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
            generateCalendar(year, month);
        });

        nextMonthBtn.addEventListener('click', () => {
            if (month === 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
            generateCalendar(year, month);
        });
    }

    generateCalendar(currentYear, currentMonth);
});

generateCalendar(currentYear, currentMonth);