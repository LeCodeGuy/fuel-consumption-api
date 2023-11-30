

// Automatically remove flash messages after 3 seconds
setTimeout(() => {
    const flashMessages = document.querySelectorAll(".message");
    flashMessages.forEach((message) => {
        message.remove();
    });
}, 3000);