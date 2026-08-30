(function () {
  const UNSET_LABEL = 'Chưa cập nhật';

  function orUnset(value) {
    const text = String(value || '').trim();
    return text || UNSET_LABEL;
  }

  const authService = new AuthService(DEMO_ACCOUNTS, DEMO_USERS);

  const current = authService.resolveCurrentUser();
  if (!current) {
    window.location.replace('smember-login.html');
    return;
  }

  renderUserInfo(current.account, current.user);
  bindPhoneVisibility(current.account.phone);
  bindBrandSwitch();
  bindLogout(authService);

  function renderUserInfo(account, user) {
    setUserField('displayName', user.displayName);
    setUserField('rank', user.rank);
    setAccountField('phone', account.phone);
    setUserField('totalBought', `${user.totalBought}`);
    setUserField('totalAmount', formatVND(user.totalAmount));
    setUserField('gender', orUnset(user.gender));
    setUserField('dateOfBirth', formatDate(user.dateOfBirth));
    setUserField('email', user.email);
    setUserField('defaultAddress', orUnset(user.defaultAddress));

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
    return match ? `${match[3]}/${match[2]}/${match[1]}` : UNSET_LABEL;
  }

  function renderAddresses(user) {
    const container = document.querySelector('[data-user-addresses]');
    if (!container) {
      return;
    }
    const addresses = user.listOfAddresses || [];
    container.replaceChildren();
    if (addresses.length === 0) {
      container.append(createEmptyAddressState());
      return;
    }
    container.appendChild(createAddressList(addresses));
  }

  function createAddressList(addresses) {
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
    return list;
  }

  function createEmptyAddressState() {
    const media = document.createElement('div');
    media.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.src = '../../assets/user-info/empty.f8088c4d.png';
    img.alt = '';
    img.width = 140;
    img.height = 104;
    media.appendChild(img);
    const text = document.createElement('p');
    text.className = 'address-card__empty';
    text.textContent = 'Bạn chưa có địa chỉ nào được tạo';
    const fragment = document.createDocumentFragment();
    fragment.append(media, text);
    return fragment;
  }

  function maskPhone(phone) {
    const s = String(phone || '').replace(/\D/g, '');
    if (s.length < 6) {
      return s;
    }
    return `${s.slice(0, 3)}${'*'.repeat(s.length - 5)}${s.slice(-2)}`;
  }

  function bindPhoneVisibility(phone) {
    const valueNode = document.querySelector('[data-user-phone-overview]');
    const button = document.querySelector('.member-card__phone-toggle');
    if (!valueNode || !button) {
      return;
    }
    const masked = maskPhone(phone);
    const full = String(phone || '');
    let visible = false;

    function apply() {
      valueNode.textContent = visible ? full : masked;
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', visible ? 'Ẩn số điện thoại' : 'Hiện số điện thoại');
    }

    apply();

    button.addEventListener('click', () => {
      visible = !visible;
      apply();
    });
  }

  function bindBrandSwitch() {
    const toggle = document.querySelector('.brand-switch__toggle');
    const listbox = document.querySelector('.brand-switch__listbox');
    if (!toggle || !listbox) {
      return;
    }
    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    if (options.length === 0) {
      return;
    }
    const labelNode = toggle.querySelector('[data-brand-switch-label]');

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function selectedOption() {
      return options.find((o) => o.getAttribute('aria-selected') === 'true') || options[0];
    }

    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      listbox.hidden = false;
      selectedOption().focus();
    }

    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      listbox.hidden = true;
    }

    function select(option) {
      const value = option.getAttribute('data-brand-switch-option');
      options.forEach((o) => {
        o.setAttribute('aria-selected', o === option ? 'true' : 'false');
      });
      if (labelNode) {
        labelNode.textContent = value;
      }
      toggle.setAttribute('aria-label', `Kênh ưu đãi hiện tại ${value}`);
      close();
      toggle.focus();
    }

    function focusOption(current, step) {
      const index = options.indexOf(current);
      const nextIndex = (index + step + options.length) % options.length;
      options[nextIndex].focus();
    }

    toggle.addEventListener('click', () => {
      if (isOpen()) {
        close();
      } else {
        open();
      }
    });

    toggle.addEventListener('keydown', (event) => {
      if (isOpen()) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        open();
      }
    });

    listbox.addEventListener('keydown', (event) => {
      const current = document.activeElement;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusOption(current, 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusOption(current, -1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        options[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        options[options.length - 1].focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (current && current.getAttribute('role') === 'option') {
          select(current);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close();
        toggle.focus();
      } else if (event.key === 'Tab') {
        close();
      }
    });

    options.forEach((option) => {
      option.addEventListener('click', () => select(option));
    });

    document.addEventListener('click', (event) => {
      if (!isOpen()) {
        return;
      }
      if (!toggle.contains(event.target) && !listbox.contains(event.target)) {
        close();
      }
    });
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
