// getting elements from HTML
const button = document.getElementById("showEventBtn");
const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const output = document.getElementById("eventOutput");
const loader = document.getElementById("loader");
const YEAR_LIMIT=2006;
const anotherBtn= document.getElementById("anotherEventBtn");

monthSelect.addEventListener("change",function(){
    const month=parseInt(monthSelect.value);
    daySelect.innerHTML='<option value="">--Day--</option>';
    if(!month) return;
    const daysInMonth={
        1:31,
        2:29,
        3:31,
        4:30,
        5:31,
        6:30,
        7:31,
        8:31,
        9:30,
        10:31,
        11:30,
        12:31,
    };
    for(let day = 1; day<=daysInMonth[month]; day++){
        const option = document.createElement("option");
        option.value=day;
        option.textContent=day;
        daySelect.appendChild(option);
    }
});

button.addEventListener("click", function () {

    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);

    // Validation
    if (!day || !month) {
        output.textContent = "Uh-oh! Select both day and month.";
        alert("Enter Both Day And Month !");
        return;
    }

    // Format to two digits
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");

    const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${formattedMonth}/${formattedDay}`;

    loader.classList.remove("hidden");
    output.textContent = "";


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loader.classList.add("hidden");

            if (data.events && data.events.length > 0) {
                const event = data.events.find(e=>e.year<YEAR_LIMIT);


                let html = `<strong>${event.year}</strong>: ${event.text}`;

                // Add Learn More link if available
                if (event.pages && event.pages.length > 0) {
                    const wikiLink = event.pages[0].content_urls.desktop.page;
                    html += `<br><a href="${wikiLink}" target="_blank" rel="noopener noreferrer">Learn more</a>`;
                }

                output.innerHTML = html;
            } else {
                output.textContent = "No historical events found for this date.";
            }
        })
        .catch(error => {
            loader.classList.add("hidden");
            output.textContent = "Could not fetch historical event.";
            console.error(error);
        });
});
