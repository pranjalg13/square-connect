event_dates = ["2024-05-10"];

// Function to generate UUID (RFC4122 version 4)
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function makeServerAlive() {
  fetch("https://square-hack-backend.onrender.com/get-catalog", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      document.getElementById("loader").style.display = "none";
      console.error("There was a problem with the fetch operation:", error);
    });
}

function eventBuyFunction() {
  // Fetch payment link when "Buy Tickets" button is clicked
  fetch("https://square-hack-backend.onrender.com/payment-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idempotencyKey: generateUUID(),
      quickPay: {
        name: event.eventName + " Ticket", // Use event name in ticket name
        priceMoney: {
          amount: parseInt(event.ticketPrice) * 100, // Convert price to cents
          currency: "USD",
        },
        locationId: "LB2W4A7DASQ8S",
      },
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Redirect to the URL received in the response
      window.location.href = data.url;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function eventFirstBuyFunction() {
  // Generate idempotency key (UUID)
  var idempotencyKey = generateUUID();

  // Fetch payment link when "Buy Tickets" button is clicked
  fetch("https://square-hack-backend.onrender.com/payment-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idempotencyKey: idempotencyKey,
      quickPay: {
        name: "Ticket ",
        priceMoney: {
          amount: 1600,
          currency: "USD",
        },
        locationId: "LB2W4A7DASQ8S",
      },
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response from the payment link API
      console.log(data);
      // Redirect to the URL received in the response
      window.location.href = data.url;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth", // Change the initial view as needed
    // Add more configuration options as needed
    events: [
      // Define your events here
      {
        title: "Community Cleanup",
        start: "2024-05-10", // Date of the event
        description:
          "Join us for a community cleanup event to help keep our neighborhood clean and green. The total sales 10% would be donated to cancer hospitals.",
      },
      // Add more events as needed
    ],
  });

  calendar.render();

  // Handle the "Buy Tickets" button for the first constant event
  var firstEventBuyTickets = document.querySelector(
    '.btn-buy-tickets[data-event-id="1"]'
  );
  firstEventBuyTickets.addEventListener("click", eventFirstBuyFunction);

  // Retrieve existing events from local storage
  if (typeof Storage !== "undefined") {
    var events = JSON.parse(localStorage.getItem("events")) || [];
    console.log(events);

    // Check if there are any events stored
    if (events.length > 0) {
      // Get the container where event cards will be appended
      var eventContainer = document.querySelector(".card-body");

      // Render event cards for each event
      events.forEach(function (event, index) {
        // Skip the first event (already displayed)
        if (index >= 0) {
          // Format the event date
          var eventDate = new Date(event.eventDate);
          var monthName = eventDate.toLocaleString("default", {
            month: "long",
          });
          var formattedDateCalender = eventDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          var formattedDate =
            monthName +
            " " +
            eventDate.getDate() +
            ", " +
            eventDate.getFullYear();

          // Create event card elements
          var eventCard = document.createElement("div");
          eventCard.classList.add("event-card", "mb-3");

          var title = document.createElement("h5");
          title.classList.add("event-title");
          title.textContent = event.eventName;
          eventCard.appendChild(title);

          var date = document.createElement("p");
          date.classList.add("event-date");
          date.innerHTML =
            '<span class="badge badge-dark">' +
            formattedDate +
            " || $" +
            event.ticketPrice +
            " per person</span>";
          eventCard.appendChild(date);

          var description = document.createElement("p");
          description.classList.add("event-description");
          description.textContent = event.eventDescription;
          eventCard.appendChild(description);

          var buyTickets = document.createElement("a");
          buyTickets.classList.add("btn", "btn-primary", "btn-buy-tickets");
          buyTickets.href = "#";
          buyTickets.textContent = "Buy Tickets";
          eventCard.appendChild(buyTickets);

          // // Check if this button is disabled for the current user
          // var disabledButtons = JSON.parse(localStorage.getItem('disabledButtons')) || [];
          // if (disabledButtons.includes(index.toString())) {
          //     buyTickets.classList.add('disabled'); // Add the 'disabled' class
          // }

          // Add event listener to handle button click
          buyTickets.addEventListener("click", eventBuyFunction);

          // Append event card to the container
          eventContainer.appendChild(eventCard);
        }
      });
    }
  } else {
    console.error("Local storage is not supported in this browser.");
  }
});

makeServerAlive();