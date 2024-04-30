// Function to generate UUID (RFC4122 version 4)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

fetch('https://square-hack-backend.onrender.com/get-catalog', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  // Get the container element where the cards will be appended
  const container = document.querySelector('.row.mt-4');
  
  // Iterate over each product in the data array
  data.forEach(product => {
    // Create a new column for each product
    const column = document.createElement('div');
    column.classList.add('col-md-4');
    column.classList.add('mb-4'); // Add margin-bottom for spacing
    
    // Create a new card element for each product
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.border = '1px solid #ddd'; // Add border
    
    // Create card content
    card.innerHTML = `
      <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">${product.description}</p>
        <p class="card-text">Price: $${product.price}</p>
        <div class="form-group">
          <label for="quantity${product.id}">Quantity:</label>
          <input type="number" class="form-control" id="quantity${product.id}" value="1">
        </div>
        <button class="btn btn-primary" onclick="eventBuyFunction(${product.id}, '${product.name}', ${product.price})">Buy Now</button> <!-- Buy Now button -->
      </div>
    `;
    
    // Append the card to the column
    column.appendChild(card);
    
    // Append the column to the container
    container.appendChild(column);
  });
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});

function eventBuyFunction(productId, productName, productPrice) {
  const quantity = document.getElementById(`quantity${productId}`).value;

    // Add default price if productPrice is null or undefined
    if (!productPrice) {
        productPrice = 10; // Default price
    }
  // Fetch payment link when "Buy Now" button is clicked
  fetch('https://square-hack-backend.onrender.com/payment-link', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "idempotencyKey": generateUUID(),
          "quickPay": {
              "name": productName + " Ticket", // Use product name in ticket name
              "priceMoney": {
                  "amount": parseInt(productPrice) * parseInt(quantity) * 100, // Convert total price to cents
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
