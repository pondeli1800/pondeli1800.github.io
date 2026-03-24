document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get("website")) return;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new URLSearchParams(formData)
      });

      const text = await response.text();

      if (text === "success") {
        feedback.textContent = "Zpráva poslána!";
        feedback.style.color = "#0eefff";
        form.reset(); // clears all inputs
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