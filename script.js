/* ==========================================================================
   Krynex Systems — Site Scripts
   - Reveal-on-scroll
   - Interactive workflow demo
   - Contact form (Web3Forms-ready)
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
   * 1. Reveal-on-scroll
   * --------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ----------------------------------------------------------------
   * 2. Interactive workflow demo
   * --------------------------------------------------------------- */
  (function initDemo() {
    const TOTAL = 6;
    const STEP_MS = 3800;   // time per step
    const PAUSE_MS = 4200;  // pause after completion before loop

    const demoCard = document.getElementById('demo');
    if (!demoCard) return;

    const steps = document.querySelectorAll('.demo-step');
    const panes = document.querySelectorAll('.demo-pane');
    const line = document.getElementById('demo-line');
    const progress = document.getElementById('demo-progress');
    const statusEl = document.getElementById('demo-status');
    const statusText = document.getElementById('demo-status-text');
    const replayBtn = document.getElementById('demo-replay');

    if (!steps.length || !panes.length || !line || !progress || !statusEl || !statusText) return;

    let index = 0;
    let timer = null;
    let started = false;

    function render(i) {
      steps.forEach(function (el, k) {
        el.classList.remove('pending', 'active', 'completed');
        if (k < i) el.classList.add('completed');
        else if (k === i) el.classList.add('active');
        else el.classList.add('pending');
      });
      panes.forEach(function (el, k) {
        el.classList.toggle('visible', k === i);
      });
      const pct = ((i + 1) / TOTAL) * 100;
      line.style.setProperty('--progress', pct + '%');
      progress.style.width = pct + '%';
    }

    function complete() {
      steps.forEach(function (el) {
        el.classList.remove('active', 'pending');
        el.classList.add('completed');
      });
      statusEl.classList.add('complete');
      statusText.textContent = 'COMPLETE';
      line.style.setProperty('--progress', '100%');
      progress.style.width = '100%';
    }

    function step() {
      render(index);
      index++;
      if (index < TOTAL) {
        timer = setTimeout(step, STEP_MS);
      } else {
        timer = setTimeout(function () {
          complete();
          timer = setTimeout(restart, PAUSE_MS);
        }, STEP_MS);
      }
    }

    function restart() {
      index = 0;
      statusEl.classList.remove('complete');
      statusText.textContent = 'RUNNING';
      step();
    }

    function start() {
      if (started) return;
      started = true;
      step();
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', function () {
        if (timer) clearTimeout(timer);
        started = false;
        index = 0;
        statusEl.classList.remove('complete');
        statusText.textContent = 'RUNNING';
        start();
      });
    }

    // Auto-start when scrolled into view
    const demoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          start();
          demoObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });
    demoObserver.observe(demoCard);

    render(0);
  })();

  /* ----------------------------------------------------------------
   * 3. Contact form — Web3Forms integration
   * ---------------------------------------------------------------
   * The form POSTs to https://api.web3forms.com/submit as JSON.
   * Access key is read from the hidden <input name="access_key"> in
   * the markup — you set it once in index.html (no key lives here).
   * --------------------------------------------------------------- */
  (function initContactForm() {
    const form = document.getElementById('contact-form');
    const card = document.getElementById('contact-card');
    const errorEl = document.getElementById('form-error');
    if (!form || !card) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    function showError(message) {
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.hidden = false;
    }

    function hideError() {
      if (errorEl) errorEl.hidden = true;
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (el) {
        const value = el.value.trim();
        if (!value) {
          el.style.borderColor = 'rgba(255, 107, 107, 0.5)';
          valid = false;
        } else if (el.type === 'email' && !isValidEmail(value)) {
          el.style.borderColor = 'rgba(255, 107, 107, 0.5)';
          valid = false;
        } else {
          el.style.borderColor = '';
        }
      });
      return valid;
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideError();

      if (!validate()) {
        showError('Please fill in the required fields with valid details.');
        return;
      }

      // Read access key from the hidden field
      const accessKey = form.querySelector('input[name="access_key"]');
      if (!accessKey || !accessKey.value || accessKey.value === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        showError('Form not yet configured. Please email hello@krynexsystems.com directly.');
        return;
      }

      // Build payload
      const formData = new FormData(form);
      const data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending&hellip;';
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          card.classList.add('submitted');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error((result && result.message) || 'Submission failed');
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
        showError('Something went wrong. Please email hello@krynexsystems.com directly.');
      }
    });

    // Clear error styling and message as the user fixes inputs
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        el.style.borderColor = '';
        hideError();
      });
    });
  })();

})();
