(function () {
  const form = document.querySelector('[data-login-form]');
  const phoneInput = document.querySelector('[data-login-field="phone"]');
  const passwordInput = document.querySelector('[data-login-field="password"]');
  const phoneErrorOutput = document.querySelector('[data-login-field-error="phone"]');
  const passwordErrorOutput = document.querySelector('[data-login-field-error="password"]');
  const errorOutput = document.querySelector('[data-login-error]');
  const passwordToggle = document.querySelector('[data-password-toggle]');
  const capsWarning = document.querySelector('[data-password-caps]');

  if (!form || !phoneInput || !passwordInput || !phoneErrorOutput || !passwordErrorOutput || !errorOutput || !passwordToggle || !capsWarning) {
    return;
  }

  const authService = new AuthService(DEMO_ACCOUNTS, DEMO_USERS);

  if (authService.isAuthenticated()) {
    window.location.replace('user-info.html');
    return;
  }

  passwordToggle.addEventListener('click', () => {
    const shouldShow = passwordInput.type === 'password';
    passwordInput.type = shouldShow ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', String(shouldShow));
    passwordToggle.setAttribute('aria-label', shouldShow ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    passwordInput.focus();
  });

  const updateCapsWarning = (event) => {
    capsWarning.textContent = event.getModifierState('CapsLock') ? 'Caps Lock đang bật.' : '';
  };
  passwordInput.addEventListener('keydown', updateCapsWarning);
  passwordInput.addEventListener('keyup', updateCapsWarning);
  passwordInput.addEventListener('blur', () => {
    capsWarning.textContent = '';
  });

  new LoginController({
    form,
    phoneInput,
    passwordInput,
    fieldErrorOutputs: {
      phone: phoneErrorOutput,
      password: passwordErrorOutput
    },
    errorOutput,
    authService,
    successUrl: 'user-info.html'
  });
})();
