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

      // Send RSVP data to Google Apps Script endpoint for email notification
      const rsvpData = {
        name: name.value.trim(),
        email: email.value.trim(),
        attending: select.value
      };

  fetch('https://script.google.com/macros/s/AKfycbzK1ENbn5nnQJvZ33CzmMr-PMrETNJbq8HjtRZpHre_wZDo9fuEcu9LglBCJbBX6rup/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData)
      })
      .then(res => {
        thankyou.classList.remove('hidden');
        rsvpForm.reset();
        setTimeout(() => thankyou.classList.add('hidden'), 10000);
      })
      .catch(() => {
        alert('RSVP could not be sent. Please try again later.');
      });
    });
  }
});

// GCash donation helpers
document.addEventListener('DOMContentLoaded', function () {
  const copyBtn = document.getElementById('copyGcash');
  const gcashNumberEl = document.getElementById('gcashNumber');

  // create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = 'toast';
  toast.textContent = 'Copied to clipboard';
  document.body.appendChild(toast);

  function showToast(msg = 'Copied') {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  if (copyBtn && gcashNumberEl) {
    copyBtn.addEventListener('click', async function () {
      const text = gcashNumberEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast('GCash number copied');
      } catch (err) {
        // fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast('GCash number copied');
        } catch (e) {
          alert('Copy failed — please copy the number manually: ' + text);
        }
        textarea.remove();
      }
    });
  }
});

