class User extends AUser {
  constructor({
    userId,
    accountId,
    displayName,
    gender = '',
    email = '',
    dateOfBirth = '',
    defaultAddress = '',
    totalBought = 0,
    rank = '',
    totalAmount = 0,
    listOfAddresses = []
  }) {
    super();
    this._userId = userId;
    this._accountId = accountId;
    this._displayName = displayName;
    this._gender = gender;
    this._email = email;
    this._dateOfBirth = dateOfBirth;
    this._defaultAddress = defaultAddress;
    this._totalBought = totalBought;
    this._rank = rank;
    this._totalAmount = totalAmount;
    this._listOfAddresses = listOfAddresses;
  }

  get userId() {
    return this._userId;
  }

  get accountId() {
    return this._accountId;
  }

  get displayName() {
    return this._displayName;
  }

  set displayName(value) {
    this._displayName = value;
  }

  get gender() {
    return this._gender;
  }

  set gender(value) {
    this._gender = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  set dateOfBirth(value) {
    this._dateOfBirth = value;
  }

  get defaultAddress() {
    return this._defaultAddress;
  }

  set defaultAddress(value) {
    this._defaultAddress = value;
  }

  get totalBought() {
    return this._totalBought;
  }

  set totalBought(value) {
    this._totalBought = value;
  }

  get rank() {
    return this._rank;
  }

  set rank(value) {
    this._rank = value;
  }

  get totalAmount() {
    return this._totalAmount;
  }

  set totalAmount(value) {
    this._totalAmount = value;
  }

  get listOfAddresses() {
    return this._listOfAddresses;
  }

  set listOfAddresses(value) {
    this._listOfAddresses = value;
  }
}
