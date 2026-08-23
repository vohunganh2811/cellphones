// Demo data - 100% synthetic, khong chua PII that.
// Chi dung de kiem thu local, khong bao gio dua vao production.
//
// Demo credentials:
//   Phone: 0901234567 | Password: User@123
//   Phone: 0387654321 | Password: Demo@456
//   Phone: 0791122334 | Password: Test@789
//
// Demo data khong tu ghi vao sessionStorage; session chi duoc tao
// sau khi login thanh cong qua Account.login().

const DEMO_ACCOUNTS = [
  new Account({
    accountId: 'account-001',
    phone: '0901234567',
    password: 'User@123',
    role: 'customer',
    createdAt: '2024-01-15T08:00:00.000Z',
    lastLoginAt: null
  }),
  new Account({
    accountId: 'account-002',
    phone: '0387654321',
    password: 'Demo@456',
    role: 'customer',
    createdAt: '2024-03-02T10:30:00.000Z',
    lastLoginAt: null
  }),
  new Account({
    accountId: 'account-003',
    phone: '0791122334',
    password: 'Test@789',
    role: 'customer',
    createdAt: '2024-05-20T14:45:00.000Z',
    lastLoginAt: null
  })
];

const DEMO_USERS = [
  new User({
    userId: 'user-001',
    accountId: 'account-001',
    displayName: 'Nguyễn Văn An',
    gender: 'Nam',
    email: 'nguyenvanan.demo@example.com',
    dateOfBirth: '1990-08-15',
    defaultAddress: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    totalBought: 12,
    rank: 'Silver',
    totalAmount: 18500000,
    listOfAddresses: [
      {
        label: 'Nhà',
        recipientName: 'Nguyễn Văn An',
        phone: '0901234567',
        address: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        isDefault: true
      },
      {
        label: 'Văn phòng',
        recipientName: 'Nguyễn Văn An',
        phone: '0901234567',
        address: '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        isDefault: false
      },
      {
        label: 'Nhà',
        recipientName: 'Nguyễn Văn An',
        phone: '0901234567',
        address: 'Số 7 Trần Hưng Đạo, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh',
        isDefault: false
      }
    ]
  }),
  new User({
    userId: 'user-002',
    accountId: 'account-002',
    displayName: 'Trần Thị Bích',
    gender: '',
    email: 'tranthibich.demo@example.com',
    dateOfBirth: '1995-12-03',
    defaultAddress: '88 Cộng Hòa, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh',
    totalBought: 5,
    rank: 'Bronze',
    totalAmount: 7200000,
    listOfAddresses: [
      {
        label: 'Nhà',
        recipientName: 'Trần Thị Bích',
        phone: '0387654321',
        address: '88 Cộng Hòa, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh',
        isDefault: true
      }
    ]
  }),
  new User({
    userId: 'user-003',
    accountId: 'account-003',
    displayName: 'Lê Minh Cường',
    gender: 'Nam',
    email: 'leminhcuong.demo@example.com',
    dateOfBirth: '1988-04-22',
    defaultAddress: '',
    totalBought: 0,
    rank: 'New',
    totalAmount: 0,
    listOfAddresses: []
  })
];
