document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const iframe = document.querySelector("iframe[name='hidden_iframe']");

  // Listen for iframe load (form submitted)
  iframe.addEventListener("load", function() {
    // If the form still exists (prevent multiple triggers)
    if (!form) return;

    // Simple heuristic: if email & message are not empty, assume success
    const emailFilled = form.querySelector("[name='email']").value.trim() !== "";
    const messageFilled = form.querySelector("[name='message']").value.trim() !== "";

    if (emailFilled && messageFilled) {
      // Hide the form and show success
      form.style.display = "none";
      feedback.textContent = "Zpráva poslána!";
      feedback.style.color = "#0eefff";
    } else {
      feedback.textContent = "Objevil se problém, zkuste prosím jiný prohlížeč nebo použijte uvedený email.";
      feedback.style.color = "#ff5555";
    }
  });
});
