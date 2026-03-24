document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const iframe = document.querySelector("iframe[name='hidden_iframe']");

  // Listen for iframe load (form submitted)
  iframe.addEventListener("load", function() {
    if (!form) return;

    // Optional: reset the form fields
    form.reset();

    // Hide the form and show success message
    form.style.display = "none";
    feedback.textContent = "Zpráva poslána!";
    feedback.style.color = "#0eefff";
  });

  // Clear feedback if user edits the form again
  form.addEventListener("input", () => {
    feedback.textContent = "";
  });
});