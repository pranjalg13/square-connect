event_dates = ["2024-05-10"]

// Function to generate UUID (RFC4122 version 4)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function eventBuyFunction() {
  // Fetch payment link when "Buy Tickets" button is clicked
  fetch('https://square-hack-backend.onrender.com/payment-link', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "idempotencyKey": generateUUID(),
          "quickPay": {
              "name": event.eventName + " Ticket", // Use event name in ticket name
              "priceMoney": {
                  "amount": parseInt(event.ticketPrice) * 100, // Convert price to cents
                  "currency": "USD"
              },
              "locationId": "LB2W4A7DASQ8S"
          }
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Redirect to the URL received in the response
      window.location.href = data.url;
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
}

function eventFirstBuyFunction() {
  // Generate idempotency key (UUID)
  var idempotencyKey = generateUUID();
  
  // Fetch payment link when "Buy Tickets" button is clicked
  fetch('https://square-hack-backend.onrender.com/payment-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "idempotencyKey": idempotencyKey,
      "quickPay": {
        "name": "Ticket ",
        "priceMoney": {
          "amount": 1600,
          "currency": "USD"
        },
        "locationId": "LB2W4A7DASQ8S"
      }
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Handle the response from the payment link API
    console.log(data);
    // Redirect to the URL received in the response
    window.location.href = data.url;
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}


document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth', // Change the initial view as needed
    // Add more configuration options as needed
    events: [
      // Define your events here
      {
        title: 'Community Cleanup',
        start: '2024-05-10', // Date of the event
        description: 'Join us for a community cleanup event to help keep our neighborhood clean and green. The total sales 10% would be donated to cancer hospitals.',
      },
      // Add more events as needed
    ]
  });

  calendar.render();  

  // Handle the "Buy Tickets" button for the first constant event
  var firstEventBuyTickets = document.querySelector('.btn-buy-tickets[data-event-id="1"]');
  firstEventBuyTickets.addEventListener('click', eventFirstBuyFunction)

  // Retrieve existing events from local storage
  if (typeof(Storage) !== "undefined") {
    var events = JSON.parse(localStorage.getItem('events')) || [];
    console.log(events);

    // Check if there are any events stored
    if (events.length > 0) {
      // Get the container where event cards will be appended
      var eventContainer = document.querySelector('.card-body');

      // Render event cards for each event
      events.forEach(function(event, index) {
        // Skip the first event (already displayed)
        if (index >= 0) {
          // Format the event date
          var eventDate = new Date(event.eventDate);
          var monthName = eventDate.toLocaleString('default', { month: 'long' });
          var formattedDateCalender = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          var formattedDate = monthName + " " + eventDate.getDate() + ", " + eventDate.getFullYear();

          // Create event card elements
          var eventCard = document.createElement('div');
          eventCard.classList.add('event-card', 'mb-3');

          var title = document.createElement('h5');
          title.classList.add('event-title');
          title.textContent = event.eventName;
          eventCard.appendChild(title);

          var date = document.createElement('p');
          date.classList.add('event-date');
          date.innerHTML = '<span class="badge badge-dark">' + formattedDate + ' || $' + event.ticketPrice + ' per person</span>';
          eventCard.appendChild(date);

          var description = document.createElement('p');
          description.classList.add('event-description');
          description.textContent = event.eventDescription;
          eventCard.appendChild(description);

          var buyTickets = document.createElement('a');
          buyTickets.classList.add('btn', 'btn-primary', 'btn-buy-tickets');
          buyTickets.href = '#';
          buyTickets.textContent = 'Buy Tickets';
          eventCard.appendChild(buyTickets);

          // // Check if this button is disabled for the current user
          // var disabledButtons = JSON.parse(localStorage.getItem('disabledButtons')) || [];
          // if (disabledButtons.includes(index.toString())) {
          //     buyTickets.classList.add('disabled'); // Add the 'disabled' class
          // }

          // Add event listener to handle button click
          buyTickets.addEventListener('click', eventBuyFunction);

          // Append event card to the container
          eventContainer.appendChild(eventCard);
        }
      });
    }
  } 
  else {
    console.error('Local storage is not supported in this browser.');
  }

});


// fetch('https://connect.squareupsandbox.com/v2/catalog/list', {
//   method: 'GET',
//   headers: {
//     'Square-Version': squareVersion,
//     'Authorization': `Bearer ${accessToken}`,
//     'Content-Type': 'application/json',
//     'Accept': '*/*'
//   }
// })
// .then(response => response.json())
// .then(data => {
//   console.log(data);
// })
// .catch(error => {
//   console.error('Error:', error);
// });

// // Initialize the Square SDK with your application ID
// const squareApplicationId = 'YOUR_SQUARE_APPLICATION_ID';
// const squareClient = square.client({
//   applicationId: squareApplicationId,
//   accessToken: 'YOUR_SQUARE_ACCESS_TOKEN'
// });

// // Function to handle ticket purchases
// async function purchaseTickets(eventId, quantity) {
//   try {
//     // Use the Invoices API to create an invoice
//     const invoice = await squareClient.invoices.create({
//       idempotencyKey: `event-${eventId}-tickets`,
//       invoice: {
//         lineItems: [
//           {
//             name: `Event Tickets - ${eventId}`,
//             quantity: `${quantity}`,
//             basePriceMoney: {
//               amount: 1000, // Assuming $10 per ticket
//               currency: 'USD'
//             }
//           }
//         ],
//         paymentRequests: [
//           {
//             requestType: 'BALANCE',
//             dueDate: new Date().toISOString().slice(0, 10), // Set the due date to today
//             reminders: []
//           }
//         ]
//       }
//     });

//     // Redirect the user to the Square Checkout page to complete the payment
//     window.location.href = invoice.paymentUrl;
//   } catch (error) {
//     console.error('Error creating invoice:', error);
//     // Handle the error and display an appropriate message to the user
//   }
// }

// // Function to fetch and display related products and services
// async function displayRelatedProducts(eventId) {
//   try {
//     // Use the Catalog API to retrieve the related products and services
//     const productCatalog = await squareClient.catalog.list({
//       types: 'ITEM'
//     });

//     // Filter the catalog items to find the ones related to the event
//     const relatedProducts = productCatalog.objects.filter((item) => {
//       // Add your logic to determine which items are related to the event
//       return item.itemData.name.toLowerCase().includes('cleanup') || item.itemData.name.toLowerCase().includes('artisan');
//     });

//     // Clear the existing product grid
//     const productGrid = document.querySelector('.product-grid');
//     productGrid.innerHTML = '';

//     // Display the related products and services
//     relatedProducts.forEach((product) => {
//       const productElement = document.createElement('div');
//       productElement.classList.add('product-card', 'mb-3');

//       productElement.innerHTML = `
//         <h6>${product.itemData.name}</h6>
//         <p>${product.itemData.description}</p>
//         <p>Price: ${formatMoney(product.itemData.variations[0].itemVariationData.priceMoney)}</p>
//         <button class="btn btn-primary btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
//       `;

//       productGrid.appendChild(productElement);
//     });
//   } catch (error) {
//     console.error('Error fetching related products:', error);
//     // Handle the error and display an appropriate message to the user
//   }
// }

// // Function to format money values
// function formatMoney(money) {
//   return `$${(money.amount / 100).toFixed(2)}`;
// }

// // Add event listeners to the "Buy Tickets" buttons
// document.querySelectorAll('.btn-buy-tickets').forEach((button) => {
//   button.addEventListener('click', (event) => {
//     const eventId = event.target.dataset.eventId;
//     const quantity = 1; // You can allow the user to input the quantity
//     purchaseTickets(eventId, quantity);
//   });
// });

// // Add event listener to the event details section
// document.querySelectorAll('.event-title').forEach((title) => {
//   title.addEventListener('click', (event) => {
//     const eventId = event.target.dataset.eventId;
//     displayRelatedProducts(eventId);
//   });
// });

// // Calendar functionality using FullCalendar.js
// document.addEventListener('DOMContentLoaded', function() {
//   var calendarEl = document.getElementById('calendar');
//   var calendar = new FullCalendar.Calendar(calendarEl, {
//     initialView: 'dayGridMonth',
//     events: [
//       {
//         title: 'Community Cleanup',
//         start: '2024-04-20',
//         url: '#' // Add the event details page URL here
//       },
//       {
//         title: 'Local Artisan Market',
//         start: '2024-05-15',
//         url: '#' // Add the event details page URL here
//       }
//       // Add more events here
//     ]
//   });
//   calendar.render();
// });