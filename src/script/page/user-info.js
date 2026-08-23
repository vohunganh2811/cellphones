(function () {
  const authService = new AuthService(DEMO_ACCOUNTS, DEMO_USERS);

  const current = authService.resolveCurrentUser();
  if (!current) {
    window.location.replace('smember-login.html');
    return;
  }

  renderUserInfo(current.account, current.user);
  bindLogout(authService);

  function renderUserInfo(account, user) {
    setUserField('displayName', user.displayName);
    setUserField('rank', user.rank);
    setAccountField('phone', account.phone);
    setUserField('totalBought', `${user.totalBought} đơn`);
    setUserField('totalAmount', formatVND(user.totalAmount));
    setUserField('gender', user.gender);
    setUserField('dateOfBirth', formatDate(user.dateOfBirth));
    setUserField('email', user.email);
    setUserField('defaultAddress', user.defaultAddress);

    const genderAlert = document.querySelector('[data-user-gender-alert]');
    if (genderAlert) {
      genderAlert.hidden = Boolean(user.gender);
      genderAlert.style.display = user.gender ? 'none' : '';
    }

    renderAddresses(user);
  }

  function setUserField(field, value) {
    document.querySelectorAll(`[data-user-field="${field}"]`).forEach((node) => {
      node.textContent = value;
    });
  }

  function setAccountField(field, value) {
    document.querySelectorAll(`[data-account-field="${field}"]`).forEach((node) => {
      node.textContent = value;
    });
  }

  function formatVND(value) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  }

  function formatDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    return match ? `${match[3]}/${match[2]}/${match[1]}` : 'Chưa cập nhật';
  }

  function renderAddresses(user) {
    const container = document.querySelector('[data-user-addresses]');
    if (!container) {
      return;
    }
    const addresses = user.listOfAddresses || [];
    if (addresses.length === 0) {
      return;
    }
    container.replaceChildren();
    const list = document.createElement('ul');
    list.className = 'address-card__list';
    addresses.forEach((address) => {
      const item = document.createElement('li');
      item.className = 'address-card__item';

      const heading = document.createElement('div');
      heading.className = 'address-card__item-heading';
      const label = document.createElement('strong');
      label.className = 'address-card__item-label';
      label.textContent = address.label;
      heading.appendChild(label);

      if (address.isDefault) {
        const badge = document.createElement('span');
        badge.className = 'address-card__item-badge';
        badge.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4v-8.5Z"/></svg>';
        const badgeText = document.createElement('span');
        badgeText.textContent = address.label;
        badge.appendChild(badgeText);
        heading.appendChild(badge);
      }

      const recipient = document.createElement('p');
      recipient.className = 'address-card__item-recipient';
      const recipientName = document.createElement('span');
      recipientName.textContent = address.recipientName;
      const separator = document.createElement('span');
      separator.className = 'address-card__item-separator';
      separator.setAttribute('aria-hidden', 'true');
      const phone = document.createElement('span');
      phone.textContent = address.phone;
      recipient.append(recipientName, separator, phone);

      const addressText = document.createElement('p');
      addressText.className = 'address-card__item-text';
      addressText.textContent = address.address;

      const actions = document.createElement('div');
      actions.className = 'address-card__item-actions';
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'address-card__item-action address-card__item-action--delete';
      deleteButton.textContent = 'Xóa';
      const updateButton = document.createElement('button');
      updateButton.type = 'button';
      updateButton.className = 'address-card__item-action';
      updateButton.textContent = 'Cập nhật';
      actions.append(deleteButton, updateButton);

      item.append(heading, recipient, addressText, actions);
      list.appendChild(item);
    });
    container.appendChild(list);
  }

  function bindLogout(authServiceRef) {
    document.querySelectorAll('[data-auth-action="logout"]').forEach((button) => {
      button.addEventListener('click', () => {
        authServiceRef.logout();
        window.location.replace('smember-login.html');
      });
    });
  }
})();
