(function () {
  const authService = new AuthService(DEMO_ACCOUNTS, DEMO_USERS);
  const isAuthenticated = authService.isAuthenticated();
  const loginUrl = 'smember-login.html';
  const userUrl = 'user-info.html';

  document.querySelectorAll('[data-auth-link]').forEach((link) => {
    if (link.getAttribute('data-auth-link') === 'account') {
      link.href = isAuthenticated ? userUrl : loginUrl;
    }
  });
})();
