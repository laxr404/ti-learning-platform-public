document.querySelectorAll('.buy-button').forEach(function (button, index) {
    button.addEventListener('click', function () {
        // Updating the URL with a query parameter
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?outOfStock=product' + (index + 1);
            window.history.pushState({ path: newurl }, '', newurl);
        }

        // Hide all messages
        document.querySelectorAll('.stock-message').forEach(function (message) {
            message.style.display = 'none';
        });

        // Show the message for the clicked button
        this.nextElementSibling.style.display = 'block';
    });

});


