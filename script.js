// script.js — unobtrusive behaviors for jan-jona site

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for RSVP button
  const rsvpButton = document.getElementById('rsvpButton');
  if (rsvpButton) {
    rsvpButton.addEventListener('click', function () {
      const rsvpSection = document.getElementById('rsvp');
      if (rsvpSection) rsvpSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // RSVP form handling
  const rsvpForm = document.getElementById('rsvpForm');
  const thankyou = document.getElementById('thankyou');

  if (rsvpForm && thankyou) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation (HTML required attributes already present)
      const name = rsvpForm.querySelector('input[type="text"]');
      const email = rsvpForm.querySelector('input[type="email"]');
      const select = rsvpForm.querySelector('select');

      if (!name || !email || !select) return;
      if (!name.value.trim() || !email.value.trim() || !select.value) {
        // Minimal user feedback
        alert('Please complete all fields before submitting.');
        return;
      }

      // Simulate successful submit: reveal thank you message and clear the form
      thankyou.classList.remove('hidden');
      rsvpForm.reset();

      // Optionally hide the message after a short time
      setTimeout(() => thankyou.classList.add('hidden'), 10000);
    });
  }
});
