(function () {
  const hooks = {
    form: '[data-login-form]',
    phone: '[data-login-field="phone"]',
    password: '[data-login-field="password"]',
    phoneError: '[data-login-field-error="phone"]',
    passwordError: '[data-login-field-error="password"]',
    error: '[data-login-error]',
    passwordToggle: '[data-password-toggle]',
    capsWarning: '[data-password-caps]'
  };

  const nodes = {};
  const missing = [];
  for (const [name, selector] of Object.entries(hooks)) {
    const node = document.querySelector(selector);
    if (node) {
      nodes[name] = node;
    } else {
      missing.push(`${selector} (${name})`);
    }
  }

  if (missing.length > 0) {
    console.error(
      '[smember-login] Thiếu DOM hook — trang đăng nhập KHÔNG được khởi tạo.\n' +
      'Nếu bạn vừa sửa HTML, hãy kiểm tra các selector sau:\n- ' + missing.join('\n- ')
    );
    return;
  }

  const { form, phone: phoneInput, password: passwordInput, phoneError: phoneErrorOutput, passwordError: passwordErrorOutput, error: errorOutput, passwordToggle, capsWarning } = nodes;

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
