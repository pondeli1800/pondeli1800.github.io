document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = new FormData(form);

    // Honeypot check
    if (data.get("website")) return;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: JSON.stringify({
          email: data.get("email").trim(),
          message: data.get("message").trim(),
          website: data.get("website").trim()
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const text = await response.text();

      if (text === "success") {
        // ✅ Do NOT hide the form
        form.reset(); // clear inputs
        feedback.textContent = "Zpráva poslána!";
        feedback.style.color = "#0eefff";
      } else if (text === "spam") {
        feedback.textContent = "Spam detekován, zpráva nebyla odeslána.";
        feedback.style.color = "#ff5555";
      } else {
        feedback.textContent = "Objevil se problém, zkuste prosím jiný prohlížeč nebo použijte uvedený email.";
        feedback.style.color = "#ff5555";
      }
    } catch (err) {
      feedback.textContent = "Objevil se problém, zkuste prosím jiný prohlížeč nebo použijte uvedený email.";
      feedback.style.color = "#ff5555";
      console.error(err);
    }
  });
});