// Interactive behavior for Personal Site

document.addEventListener('DOMContentLoaded', () => {
  // Update year
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Update live clock
  function updateClock() {
    const liveTimeEl = document.getElementById('live-time');
    if (!liveTimeEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    // Shorten timezone name if possible
    const tzShort = tz.split('/').pop().replace('_', ' ');
    liveTimeEl.textContent = `${hours}:${minutes} (${tzShort})`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Toast notification helper
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimer = null;

  function showToast(message, isSuccess = true) {
    if (!toast) return;

    toastMessage.textContent = message;
    if (isSuccess) {
      toastIcon.className = 'w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs';
      toastIcon.textContent = '✓';
    } else {
      toastIcon.className = 'w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs';
      toastIcon.textContent = '!';
    }

    // Show toast
    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 3200);
  }

  // Copy email functionality
  async function copyEmail(email) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      showToast(`Copied ${email} to clipboard!`, true);
    } catch (err) {
      showToast(`Email: ${email}`, true);
    }
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'hello@matnemati.dev';
      copyEmail(email);
    });
  }

  const cardEmailBtn = document.getElementById('card-email-btn');
  if (cardEmailBtn) {
    cardEmailBtn.addEventListener('click', () => {
      const email = cardEmailBtn.getAttribute('data-email') || 'hello@matnemati.dev';
      copyEmail(email);
    });
  }

  // Handle contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const message = document.getElementById('user-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all fields', false);
        return;
      }

      // Generate mailto link for direct mail client opening
      const recipient = 'hello@matnemati.dev';
      const subject = encodeURIComponent(`Message from ${name} via Personal Site`);
      const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      
      showToast('Thank you! Opening your email client...', true);
      
      setTimeout(() => {
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      }, 700);

      contactForm.reset();
    });
  }

  // Card cursor glow micro-interaction
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
