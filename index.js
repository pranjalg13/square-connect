
const squareVersion = '2024-04-17';
const accessToken = 'EAAAl1qYv9TUI-_jEiOIKq130pLG_Odgkw3igvE4lE8cjX4EjsAWp5n99JUIWIX8';

fetch('https://connect.squareupsandbox.com/v2/catalog/list', {
  method: 'GET',
  headers: {
    'Square-Version': squareVersion,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
});

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