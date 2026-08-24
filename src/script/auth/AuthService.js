class AuthService {
  static PHONE_PATTERN = /^(03|05|07|08|09)\d{8}$/;

  constructor(accounts, users) {
    this._accounts = accounts;
    this._users = users;
  }

  static isValidPhone(phone) {
    return AuthService.PHONE_PATTERN.test(String(phone));
  }

  findAccountByPhone(phone) {
    return this._accounts.find((account) => account.phone === phone) || null;
  }

  findAccountById(accountId) {
    return this._accounts.find((account) => account.accountId === accountId) || null;
  }

  findUserByAccountId(accountId) {
    return this._users.find((user) => user.accountId === accountId) || null;
  }

  login(phone, password) {
    const trimmedPhone = String(phone || '').trim();
    if (!trimmedPhone) {
      return { ok: false, code: 'PHONE_REQUIRED' };
    }
    if (!password) {
      return { ok: false, code: 'PASSWORD_REQUIRED' };
    }
    if (!AuthService.isValidPhone(trimmedPhone)) {
      return { ok: false, code: 'PHONE_INVALID' };
    }
    const account = this.findAccountByPhone(trimmedPhone);
    if (!account) {
      return { ok: false, code: 'ACCOUNT_NOT_FOUND' };
    }
    if (!account.login(trimmedPhone, password)) {
      return { ok: false, code: 'PASSWORD_INCORRECT' };
    }
    return { ok: true };
  }

  getSession() {
    let raw;
    try {
      raw = sessionStorage.getItem('loginInfo');
    } catch (error) {
      return null;
    }
    if (!raw) {
      return null;
    }
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (error) {
      this.logout();
      return null;
    }
    if (!payload || typeof payload !== 'object') {
      this.logout();
      return null;
    }
    if (
      typeof payload.accountId !== 'string' || !payload.accountId ||
      typeof payload.role !== 'string' || !payload.role ||
      typeof payload.lastLoginAt !== 'string' || !payload.lastLoginAt
    ) {
      this.logout();
      return null;
    }
    if (!Number.isFinite(Date.parse(payload.lastLoginAt))) {
      this.logout();
      return null;
    }
    const account = this.findAccountById(payload.accountId);
    if (!account) {
      this.logout();
      return null;
    }
    if (account.role !== payload.role) {
      this.logout();
      return null;
    }
    if (!this.findUserByAccountId(account.accountId)) {
      this.logout();
      return null;
    }
    return payload;
  }

  isAuthenticated() {
    return this.getSession() !== null;
  }

  resolveCurrentUser() {
    const session = this.getSession();
    if (!session) {
      return null;
    }
    const account = this.findAccountById(session.accountId);
    const user = account ? this.findUserByAccountId(account.accountId) : null;
    if (!account || !user) {
      this.logout();
      return null;
    }
    return { account, user, session };
  }

  logout() {
    sessionStorage.removeItem('loginInfo');
  }
}
