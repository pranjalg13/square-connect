document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('createEventForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        var eventName = document.getElementById('eventName').value;
        var eventDate = document.getElementById('eventDate').value;
        var ticketPrice = document.getElementById('ticketPrice').value;
        var eventDescription = document.getElementById('eventDescription').value;

        // Create JSON object
        var eventData = {
            "eventName": eventName,
            "eventDate": eventDate,
            "ticketPrice": ticketPrice,
            "eventDescription": eventDescription
        };

        // Check if local storage is available
        if (typeof(Storage) !== "undefined") {
            // Retrieve existing events array from local storage or create a new one
            var events = JSON.parse(localStorage.getItem('events')) || [];
            console.log(events);
            // Add new event data to the array
            events.push(eventData);

            // Store the updated events array back into local storage
            localStorage.setItem('events', JSON.stringify(events));

            console.log('Event data saved locally.');
        } else {
            console.error('Local storage is not supported in this browser.');
        }

        // Optionally, you can redirect or display a confirmation message here
    });
});