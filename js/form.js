document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const iframe = document.querySelector("iframe[name='hidden_iframe']");

  if (!form || !iframe || !feedback) return;

  // When the iframe loads after form submission
  iframe.addEventListener("load", () => {
    // Show success message
    feedback.textContent = "Zpráva se nemusela poslat! Případně použijte email uvedený v kontaktech";
    feedback.style.color = "#0eefff";

    // Clear the form inputs
    form.reset();
  });

  // Optional: clear feedback if the user starts typing again
  form.addEventListener("input", () => {
    feedback.textContent = "";
  });
});