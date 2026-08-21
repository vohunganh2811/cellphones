class Account extends AAccount {
    constructor(accountID, password, role, phone = '') {
        super(accountID, password, role);
        this._phone = phone;
        this._lastLoginAt = new Date();
        this._createAt = new Date();
    }

    // Getter / Setter
    get phone() { return this._phone; }
    set phone(value) { this._phone = value; }

    get lastLoginAt() { return this._lastLoginAt; }
    set lastLoginAt(value) { this._lastLoginAt = value; }

    get createAt() { return this._createAt; }
    set createAt(value) { this._createAt = value; }

    // Overide login
    login(phone, password, role) {
        if (phone === this.phone && password === this.password && role === this.role) {
            sessionStorage.setItem('loginInfo', JSON.stringify({
                accountID: this.accountID,
                role: this.role,
                lastLoginAt: new Date().toISOString()
            }));
            return true;
        }
        return false;
    }

    isLogin() {
        return sessionStorage.getItem('loginInfo') !== null;
    }
}