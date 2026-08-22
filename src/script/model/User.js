class User extends AUser {
  constructor(
    userID, accountID, displayName,
    gender = '', email = '', dateOfBirth = '', defaultAddress = '',
    totalBought = 0, rank = '', totalAmount = 0, listOfAddresses = []
  ) {
    super(userID, accountID, displayName);
    this._gender = gender;
    this._email = email;
    this._dateOfBirth = dateOfBirth;
    this._defaultAddress = defaultAddress;
    this._totalBought = totalBought;
    this._rank = rank;
    this._totalAmount = totalAmount;
    this._listOfAddresses = listOfAddresses;
  }

  get gender() { return this._gender; }
  set gender(v) { this._gender = v; }

  get email() { return this._email; }
  set email(v) { this._email = v; }

  get dateOfBirth() { return this._dateOfBirth; }
  set dateOfBirth(v) { this._dateOfBirth = v; }

  get defaultAddress() { return this._defaultAddress; }
  set defaultAddress(v) { this._defaultAddress = v; }

  get totalBought() { return this._totalBought; }
  set totalBought(v) { this._totalBought = v; }

  get rank() { return this._rank; }
  set rank(v) { this._rank = v; }

  get totalAmount() { return this._totalAmount; }
  set totalAmount(v) { this._totalAmount = v; }

  get listOfAddresses() { return this._listOfAddresses; }
  set listOfAddresses(v) { this._listOfAddresses = v; }
}
