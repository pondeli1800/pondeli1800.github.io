// js/form.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = new FormData(form);

        // Honeypot check
        if (data.get('website')) return; // spam detected, silently ignore

        // Prepare payload for Apps Script
        const payload = {
            email: data.get('email').trim(),
            message: data.get('message').trim(),
            website: data.get('website') // honeypot
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzot1ZEPWTXLatMMqZB93oTaKeIYS0zZ9vMBlywLY3-vrJl7rITU51EwxEGkX2j6ufBGg/exec', { // <-- replace with your deployment URL
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === "success") {
                feedback.textContent = "Vzkaz odeslán!";
                feedback.style.color = "#0eefff";
                form.reset();
            } else if (result.status === "spam") {
                feedback.textContent = "Spam detekován, zpráva nebyla odeslána.";
                feedback.style.color = "#ff5555";
            } else {
                feedback.textContent = "Chyba při odesílání: " + result.message;
                feedback.style.color = "#ff5555";
            }
        } catch (err) {
            console.error(err);
            feedback.textContent = "Chyba při spojení se serverem.";
            feedback.style.color = "#ff5555";
        }
    });
});