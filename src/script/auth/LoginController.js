class LoginController {
  static ERROR_MESSAGES = {
    PHONE_REQUIRED: 'Vui lòng nhập số điện thoại.',
    PHONE_INVALID: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 03, 05, 07, 08 hoặc 09.',
    ACCOUNT_NOT_FOUND: 'Số điện thoại này chưa được đăng ký.',
    PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu.',
    PASSWORD_INCORRECT: 'Mật khẩu không chính xác. Vui lòng kiểm tra và thử lại.',
    SESSION_ERROR: 'Không thể đăng nhập lúc này. Vui lòng thử lại.'
  };

  constructor({ form, phoneInput, passwordInput, fieldErrorOutputs = {}, errorOutput, authService, successUrl = 'user-info.html' }) {
    this._form = form;
    this._phoneInput = phoneInput;
    this._passwordInput = passwordInput;
    this._fieldErrorOutputs = fieldErrorOutputs;
    this._errorOutput = errorOutput;
    this._authService = authService;
    this._successUrl = successUrl;
    if (this._form) {
      this._form.addEventListener('submit', (event) => this._handleSubmit(event));
    }
    this._phoneInput?.addEventListener('input', () => this._clearFieldError('phone'));
    this._passwordInput?.addEventListener('input', () => this._clearFieldError('password'));
  }

  _handleSubmit(event) {
    event.preventDefault();
    this._clearError();
    const phone = this._phoneInput ? this._phoneInput.value.trim() : '';
    const password = this._passwordInput ? this._passwordInput.value : '';
    let firstInvalidInput = null;
    if (!phone) {
      this._showFieldError('phone', 'PHONE_REQUIRED');
      firstInvalidInput = this._phoneInput;
    } else if (!AuthService.isValidPhone(phone)) {
      this._showFieldError('phone', 'PHONE_INVALID');
      firstInvalidInput = this._phoneInput;
    }
    if (!password) {
      this._showFieldError('password', 'PASSWORD_REQUIRED');
      firstInvalidInput ||= this._passwordInput;
    }
    if (firstInvalidInput) {
      firstInvalidInput.focus();
      return;
    }

    const result = this._authService.login(phone, password);
    if (!result.ok) {
      if (result.code === 'ACCOUNT_NOT_FOUND') {
        this._showFieldError('phone', result.code);
        this._phoneInput.focus();
      } else if (result.code === 'PASSWORD_INCORRECT') {
        this._showFieldError('password', result.code);
        this._passwordInput.focus();
      } else {
        this._showError(result.code);
      }
      return;
    }
    window.location.href = this._successUrl;
  }

  _showError(code) {
    if (this._errorOutput) {
      this._errorOutput.textContent = LoginController.ERROR_MESSAGES[code] || LoginController.ERROR_MESSAGES.SESSION_ERROR;
    }
  }

  _showFieldError(field, code) {
    const input = field === 'phone' ? this._phoneInput : this._passwordInput;
    const output = this._fieldErrorOutputs[field];
    input?.setAttribute('aria-invalid', 'true');
    if (output) {
      output.textContent = LoginController.ERROR_MESSAGES[code];
    }
  }

  _clearFieldError(field) {
    const input = field === 'phone' ? this._phoneInput : this._passwordInput;
    const output = this._fieldErrorOutputs[field];
    input?.removeAttribute('aria-invalid');
    if (output) {
      output.textContent = '';
    }
    if (this._errorOutput) {
      this._errorOutput.textContent = '';
    }
  }

  _clearError() {
    this._clearFieldErrorOutput('phone');
    this._clearFieldErrorOutput('password');
    if (this._errorOutput) {
      this._errorOutput.textContent = '';
    }
  }

  _clearFieldErrorOutput(field) {
    const input = field === 'phone' ? this._phoneInput : this._passwordInput;
    const output = this._fieldErrorOutputs[field];
    input?.removeAttribute('aria-invalid');
    if (output) {
      output.textContent = '';
    }
  }
}
