(function () {
  const authService = new AuthService(DEMO_ACCOUNTS, DEMO_USERS);
  const isAuthenticated = authService.isAuthenticated();
  // index.html nam o thu muc goc, 2 trang con lai nam trong src/web/
  const loginUrl = 'src/web/smember-login.html';
  const userUrl = 'src/web/user-info.html';

  document.querySelectorAll('[data-auth-link]').forEach((link) => {
    if (link.getAttribute('data-auth-link') === 'account') {
      link.href = isAuthenticated ? userUrl : loginUrl;
    }
  });
})();
