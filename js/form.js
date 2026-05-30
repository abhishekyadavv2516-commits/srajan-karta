/* =============================================
   SRAJAN KARTA — Contact Form
   Floating Labels · Validation · Honeypot Spam Prevention
   ============================================= */

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;

    this.submitBtn = this.form.querySelector('.form-submit');
    this.successMsg = this.form.querySelector('.form-success');
    this.formFields = this.form.querySelectorAll('.form-input');

    this.validators = {
      name: {
        validate: (value) => value.trim().length >= 2,
        message: 'Please enter your full name (at least 2 characters)'
      },
      email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
      },
      phone: {
        validate: (value) => {
          if (!value.trim()) return true; // Phone is optional
          return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(value.trim());
        },
        message: 'Please enter a valid phone number'
      },
      service: {
        validate: (value) => value.trim().length > 0,
        message: 'Please select a service you\'re interested in'
      },
      message: {
        validate: (value) => value.trim().length >= 10,
        message: 'Please enter a message (at least 10 characters)'
      }
    };

    this.init();
  }

  init() {
    // Real-time validation on blur
    this.formFields.forEach(field => {
      field.addEventListener('blur', () => {
        this.validateField(field);
      });

      // Clear error on input
      field.addEventListener('input', () => {
        this.clearFieldError(field);
      });
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  validateField(field) {
    const fieldId = field.id;
    const validator = this.validators[fieldId];

    if (!validator) return true;

    const value = field.value;
    const isValid = validator.validate(value);

    if (!isValid) {
      this.showFieldError(field, validator.message);
      return false;
    } else {
      this.clearFieldError(field);
      return true;
    }
  }

  showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const errorEl = formGroup.querySelector('.form-error');
    field.classList.add('error');

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const errorEl = formGroup.querySelector('.form-error');
    field.classList.remove('error');

    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  }

  handleSubmit() {
    // Check honeypot
    const honeypot = this.form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      // Bot detected — silently fail
      this.showSuccess();
      return;
    }

    // Validate all fields
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('.form-input[required]');

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Also validate optional fields that have values
    const optionalFields = this.form.querySelectorAll('.form-input:not([required])');
    optionalFields.forEach(field => {
      if (field.value.trim() && !this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = this.form.querySelector('.form-input.error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // Show loading state
    this.submitBtn.classList.add('loading');
    this.submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      this.showSuccess();
    }, 1500);
  }

  showSuccess() {
    // Hide form fields
    const formGroups = this.form.querySelectorAll('.form-group, .form-row, .form-submit');
    formGroups.forEach(group => {
      group.style.display = 'none';
    });

    // Show success message
    if (this.successMsg) {
      this.successMsg.classList.add('visible');
    }

    // Reset form after delay
    setTimeout(() => {
      this.resetForm();
    }, 5000);
  }

  resetForm() {
    this.form.reset();

    const formGroups = this.form.querySelectorAll('.form-group, .form-row, .form-submit');
    formGroups.forEach(group => {
      group.style.display = '';
    });

    if (this.successMsg) {
      this.successMsg.classList.remove('visible');
    }

    if (this.submitBtn) {
      this.submitBtn.classList.remove('loading');
      this.submitBtn.disabled = false;
    }

    // Clear all errors
    this.formFields.forEach(field => this.clearFieldError(field));
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});
