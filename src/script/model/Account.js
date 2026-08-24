class Account extends AAccount {
  constructor({ accountId, phone, password, role, createdAt, lastLoginAt = null }) {
    super();
    this._accountId = accountId;
    this._phone = phone;
    this._password = password;
    this._role = role;
    this._createdAt = createdAt;
    this._lastLoginAt = lastLoginAt;
  }

  get accountId() {
    return this._accountId;
  }

  get phone() {
    return this._phone;
  }

  set phone(value) {
    this._phone = value;
  }

  get role() {
    return this._role;
  }

  set role(value) {
    this._role = value;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    this._createdAt = value;
  }

  get lastLoginAt() {
    return this._lastLoginAt;
  }

  set lastLoginAt(value) {
    this._lastLoginAt = value;
  }

  isLogin() {
    try {
      const raw = sessionStorage.getItem('loginInfo');
      if (!raw) {
        return false;
      }
      const payload = JSON.parse(raw);
      return Boolean(payload) && payload.accountId === this._accountId;
    } catch (error) {
      return false;
    }
  }

  login(phone, password) {
    if (phone !== this._phone || password !== this._password) {
      return false;
    }
    const lastLoginAt = new Date().toISOString();
    this._lastLoginAt = lastLoginAt;
    try {
      sessionStorage.setItem('loginInfo', JSON.stringify({
        accountId: this._accountId,
        role: this._role,
        lastLoginAt
      }));
    } catch (error) {
      return false;
    }
    return sessionStorage.getItem('loginInfo') !== null;
  }
}
