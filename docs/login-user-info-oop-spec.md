# Login and User Info OOP Specification

## 1. Muc tieu

Trien khai JavaScript OOP cho luong dang nhap va trang thong tin nguoi dung:

- Dang nhap bang so dien thoai va mat khau.
- Luu phien dang nhap trong `sessionStorage`.
- Khong cho truy cap `user-info.html` neu khong co session hop le.
- Render dung thong tin cua User lien ket voi Account dang dang nhap.
- Tao mot so Account/User mau de worker va giao dien co the kiem thu.
- Tuan thu thiet ke abstract hien co, khong tao model Account/User song song.

## 2. Quyet dinh da chot

| Noi dung | Quyet dinh |
| --- | --- |
| Trang dang nhap | `smember-login.html` |
| Trang sau khi dang nhap | `user-info.html` |
| Credential | So dien thoai va mat khau |
| Dinh dang so dien thoai | 10 chu so Viet Nam, bat dau bang `03`, `05`, `07`, `08` hoac `09` |
| Session key | `loginInfo` |
| Loi dang nhap cong khai | `Sai so dien thoai hoac mat khau dang nhap` |
| PII tren user info | Hien thi day du phone, email va ngay sinh cua du lieu mau |
| Quan he model | `User.accountId === Account.accountId` |
| Cach load JavaScript | Classic scripts voi `defer`, khong them framework hoac bundler |

## 3. Nguyen tac abstract bat buoc

Hai file sau la tang thiet ke da duoc phe duyet va phai giu nguyen:

- `src/script/model/AAccount.js`
- `src/script/model/AUser.js`

Worker khong duoc:

- Sua field, constructor, accessor hay abstract method trong hai file tren.
- Them logic session, DOM, redirect hoac validation vao abstract class.
- Thay abstract class bang interface/model moi.
- Tao mot he thong Account/User khac nam song song voi model hien tai.

Concrete class phai ke thua va hien thuc contract hien co:

```text
AAccount -> Account
AUser    -> User
User.accountId -> Account.accountId
```

`Account` duoc phep them cac getter/setter concrete can thiet ngoai contract abstract, nhung khong duoc yeu cau sua `AAccount`. Tuong tu voi `User` va `AUser`.

## 4. Kien truc trien khai

Bo sung cac tang theo thu tu phu thuoc:

```text
Abstract model (giu nguyen)
        |
Concrete model
        |
Demo data
        |
Auth service
        |
Login controller / page entry
        |
DOM cua smember-login.html va user-info.html
```

Trach nhiem phai tach biet:

| Tang | Trach nhiem |
| --- | --- |
| Abstract model | Dinh nghia contract, khong sua |
| Concrete model | Luu state va implement abstract members |
| Demo data | Tao cac instance Account/User mau |
| Auth service | Validate credential, session, resolve current user, logout |
| Login controller | Ket noi form login voi AuthService |
| Page entry | Guard, redirect va render DOM cua tung trang |

Khong dua DOM selector vao model. Khong dua Account/User fixture vao controller.

## 5. Pham vi file

### File duoc sua

- `src/script/model/Account.js`
- `src/script/model/User.js`
- `index.html`
- `user-info.html`

### File duoc them

- `src/script/data/demo-data.js`
- `src/script/auth/AuthService.js`
- `src/script/auth/LoginController.js`
- `src/script/page/main-auth.js`
- `src/script/page/smember-login.js`
- `src/script/page/user-info.js`

### File chi duoc doc, khong sua

- `src/script/model/AAccount.js`
- `src/script/model/AUser.js`

### Ngoai pham vi

- Khong tao hoac thiet ke lai HTML/CSS cho `smember-login.html` trong task nay.
- Khong them backend, API hoac database.
- Khong trien khai dang ky, quen mat khau, doi mat khau hoac sua profile.
- Khong them framework, bundler hay dependency.
- Khong xem client-side demo authentication la giai phap bao mat production.

## 6. Account concrete model

`Account` phai `extends AAccount` va implement day du contract hien tai ma khong sua `AAccount`.

Constructor de xuat:

```js
new Account({
  accountId,
  phone,
  password,
  role,
  createdAt,
  lastLoginAt
});
```

| Thuoc tinh | Kieu |
| --- | --- |
| `accountId` | string |
| `phone` | string |
| `password` | string |
| `role` | string |
| `createdAt` | ISO-8601 string |
| `lastLoginAt` | ISO-8601 string hoac `null` |

Yeu cau:

- Goi `super()` va tu gan cac backing field trong concrete constructor.
- Dung duy nhat `accountId`, khong dung `accountID`.
- Chuan hoa ten `createAt` thanh `createdAt` trong concrete model.
- `lastLoginAt` mac dinh la `null`, khong tao timestamp trong constructor.
- Implement `accountId`, password setter, role getter/setter, `isLogin()` va `login()` theo contract abstract hien tai.
- Concrete class co the them password getter va cac accessor can thiet ma khong sua abstract class.
- Khong ghi password vao session, DOM, URL hoac console.

### Account login behavior

`Account.login(phone, password)` chi thanh cong khi phone va password khop Account hien tai.

Thu tu bat buoc:

1. Kiem tra phone va password.
2. Neu sai, tra ve `false` va khong thay doi `lastLoginAt`.
3. Neu dung, tao timestamp ISO.
4. Cap nhat `lastLoginAt`.
5. Ghi session `loginInfo`.
6. Chi tra ve `true` neu session da ghi thanh cong.

Session payload:

```js
{
  accountId: "account-001",
  role: "customer",
  lastLoginAt: "2026-08-23T10:30:00.000Z"
}
```

Session tuyet doi khong chua `password`.

## 7. User concrete model

`User` phai `extends AUser`, implement nguyen ven contract hien tai va bo sung cac field nghiep vu:

```js
new User({
  userId,
  accountId,
  displayName,
  gender,
  email,
  dateOfBirth,
  defaultAddress,
  totalBought,
  rank,
  totalAmount,
  listOfAddresses
});
```

| Thuoc tinh | Kieu |
| --- | --- |
| `userId` | string |
| `accountId` | string |
| `displayName` | string |
| `gender` | string |
| `email` | string |
| `dateOfBirth` | string |
| `defaultAddress` | string |
| `totalBought` | number |
| `rank` | string |
| `totalAmount` | number |
| `listOfAddresses` | array |

Invariant:

- Moi `User.accountId` phai khop dung mot `Account.accountId`.
- `totalBought` va `totalAmount` la number khong am.
- `listOfAddresses` luon la array.
- Neu `defaultAddress` co gia tri, no phai khop field `address` cua mot item trong `listOfAddresses`.
- Khong nhung toan bo Account object vao User vi abstract model da chon lien ket bang `accountId`.

## 8. Demo data

Trong `src/script/data/demo-data.js`, tao it nhat ba cap Account/User bang concrete constructors, khong dung object literal thay model.

Du lieu mau phai gom:

- Mot user co day du profile va nhieu dia chi.
- Mot user chua co gender de kiem tra alert.
- Mot user khong co dia chi de kiem tra empty state.
- ID Account/User duy nhat.
- Role mac dinh `customer`.
- Phone dung dinh dang da chot.
- Du lieu hoan toan synthetic, khong dung PII that.
- Comment ghi ro demo credentials de kiem thu local.

Bo credential de xuat:

| Phone | Password |
| --- | --- |
| `0901234567` | `User@123` |
| `0387654321` | `Demo@456` |
| `0791122334` | `Test@789` |

Demo data khong duoc tu ghi vao `sessionStorage`. Session chi duoc tao sau login thanh cong.

## 9. AuthService

`src/script/auth/AuthService.js` chiu trach nhiem:

- Nhan collection Account va User.
- Validate phone/password.
- Tim Account theo phone.
- Goi concrete `Account.login(phone, password)`.
- Doc va validate session.
- Resolve current Account/User.
- Guard trang.
- Logout.

### Phone validation

Phone hop le khi khop:

```regex
^(03|05|07|08|09)\d{8}$
```

Khong chap nhan `+84`, khoang trang, dau gach, chu cai hoac chuoi khong du 10 chu so.

### Login validation errors

Prototype hien thong bao rieng tai field de nguoi dung biet cach sua:

- Phone rong: yeu cau nhap so dien thoai.
- Password rong: yeu cau nhap mat khau.
- Phone sai format: neu ro quy tac 10 chu so va dau so hop le.
- Phone khong ton tai: thong bao tai field phone.
- Password sai: thong bao tai field password.
- Loi ghi session: hien thong bao chung va de nghi thu lai.

Field sai phai co `aria-invalid="true"`, loi phai duoc lien ket bang
`aria-describedby`, va focus duoc dua toi field sai dau tien sau submit.

### Session validation

Session chi hop le khi:

- `loginInfo` ton tai va parse JSON thanh cong.
- Payload co `accountId`, `role` va `lastLoginAt`.
- Account tuong ung con ton tai.
- User lien ket voi Account ton tai.
- Role trong session khop role cua Account.
- `lastLoginAt` la timestamp hop le.

Session malformed, fabricated hoac stale phai bi xoa truoc khi redirect.

## 10. LoginController

`LoginController` phai san sang tich hop voi `smember-login.html` sau nay va khong hard-code selector cua HTML chua ton tai.

Contract de xuat:

```js
new LoginController({
  form,
  phoneInput,
  passwordInput,
  errorOutput,
  authService,
  successUrl: "user-info.html"
});
```

Submit flow:

1. `preventDefault()`.
2. Xoa loi cu.
3. Doc phone va password.
4. Goi AuthService.
5. Neu sai, hien loi cu the gan field va focus field sai dau tien.
6. Neu dung, redirect toi `user-info.html`.

Yeu cau cho HTML login sau nay:

- Entry script cua `smember-login.html` se truyen DOM elements vao controller.
- Error output can co `role="alert"` hoac `aria-live="polite"`.
- Credentials khong duoc dua vao query string.
- Controller khong tu bootstrap neu chua duoc cung cap DOM elements.

### Login page entry va DOM contract

`src/script/page/smember-login.js` la entry script san sang cho HTML login duoc bo sung sau. File nay query cac semantic hook roi truyen element vao `LoginController`; business logic van nam trong controller/service.

HTML `smember-login.html` sau nay phai cung cap:

```text
data-login-form
data-login-field="phone"
data-login-field="password"
data-login-field-error="phone"
data-login-field-error="password"
data-login-error
```

Entry script phai:

- Khoi tao controller khi du cac hook.
- Khong throw neu script duoc load khi markup chua hoan thien; return ro rang neu thieu DOM contract.
- Neu da co valid session va truy cap lai trang login, redirect toi `user-info.html`.
- Khong chua demo credentials hoac duplicate validation logic.

## 11. Main page navigation

Them hook on dinh vao cac link account/login hien co trong `index.html`, vi du:

```html
<a data-auth-link="account">...</a>
```

`main-auth.js` phai xu ly:

- Khong co session hop le: link account/login tro toi `smember-login.html`.
- Co session hop le: link account tro toi `user-info.html`.
- Khong cho main page dan thang toi user page neu chua qua session validation.
- Khong chi kiem tra session key co ton tai hay khong.

Navigation tren main page khong thay the guard cua `user-info.html`.

## 12. User info guard va render

`src/script/page/user-info.js` phai guard truoc khi render:

1. Doc va validate `loginInfo`.
2. Neu invalid, xoa session.
3. Redirect toi `smember-login.html`.
4. Return ngay, khong render fixture/user cu.
5. Neu valid, tim Account theo `session.accountId`.
6. Tim User theo `User.accountId === Account.accountId`.
7. Render dung Account/User do.
8. Bind logout.

Khong duoc mac dinh render user dau tien trong demo data.

## 13. User info DOM contract

Them `data-*` hooks vao node hien co trong `user-info.html`, giu nguyen BEM classes:

```text
data-user-field="displayName"
data-user-field="rank"
data-account-field="phone"
data-user-field="totalBought"
data-user-field="totalAmount"
data-user-field="gender"
data-user-field="dateOfBirth"
data-user-field="email"
data-user-field="defaultAddress"
data-user-addresses
data-user-gender-alert
data-auth-action="logout"
```

Mot field co the xuat hien o nhieu node, vi du display name va phone.

Khong duoc:

- Dung `nth-child` de tim field.
- Tim field dua vao text label.
- Doi BEM class chi de JavaScript query de hon.
- Dung `innerHTML` de render du lieu user.

## 14. Mapping thong tin

| Model | UI |
| --- | --- |
| `User.displayName` | Overview name va ho ten ca nhan |
| `User.rank` | Badge hang |
| `Account.phone` | Overview phone va so dien thoai ca nhan |
| `User.totalBought` | Tong so don |
| `User.totalAmount` | Tong tien da mua |
| `User.gender` | Gioi tinh |
| `User.dateOfBirth` | Ngay sinh |
| `User.email` | Email |
| `User.defaultAddress` | Dia chi mac dinh |
| `User.listOfAddresses` | Danh sach dia chi |

Phone, email va ngay sinh phai hien thi day du theo quyet dinh da chot.

Tong tien format bang:

```js
new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});
```

Gender behavior:

- Gender rong: hien canh bao bo sung gioi tinh.
- Gender co gia tri: an canh bao.

Address behavior:

- Array rong: giu empty state hien tai.
- Co dia chi: render bang DOM nodes va `textContent`.
- Danh dau dia chi mac dinh bang text, khong chi bang mau.

Khong map `lastLoginAt` vao ngay cap nhat profile hoac ngay cap nhat mat khau vi sai nghia nghiep vu.

## 15. Logout

Nut logout tren `user-info.html` phai:

1. Xoa `loginInfo`.
2. Redirect toi `smember-login.html`.

Sau logout, refresh hoac Back roi reload `user-info.html` phai bi guard va redirect ve login.

## 16. Script loading

Script phai dung `defer` va dung dependency order:

```html
<script defer src="src/script/model/AAccount.js"></script>
<script defer src="src/script/model/Account.js"></script>
<script defer src="src/script/model/AUser.js"></script>
<script defer src="src/script/model/User.js"></script>
<script defer src="src/script/data/demo-data.js"></script>
<script defer src="src/script/auth/AuthService.js"></script>
<script defer src="src/script/page/user-info.js"></script>
```

`index.html` load `main-auth.js` thay cho `user-info.js`. `smember-login.html` sau nay load them `LoginController.js` va `src/script/page/smember-login.js` sau cac dependencies chung.

Khong chen inline business logic vao HTML.

## 17. Acceptance criteria

- [ ] `src/script/model/AAccount.js` khong thay doi.
- [ ] `src/script/model/AUser.js` khong thay doi.
- [ ] `new AAccount()` va `new AUser()` van throw.
- [ ] `Account` va `User` implement day du abstract contract hien co.
- [ ] Khong con dung lan `accountID` va `accountId`.
- [ ] Concrete Account dung `createdAt` va nullable `lastLoginAt`.
- [ ] User co day du cac field nghiep vu duoc yeu cau.
- [ ] Moi User lien ket dung Account qua `accountId`.
- [ ] Co it nhat ba cap Account/User mau.
- [ ] Login chi yeu cau phone va password.
- [ ] Phone phai dung format 10 chu so Viet Nam da chot.
- [ ] Moi invalid credential hien dung cung mot public error.
- [ ] Login sai khong tao session va khong doi `lastLoginAt`.
- [ ] Login dung cap nhat `lastLoginAt` truoc redirect.
- [ ] Session dung key `loginInfo` va khong chua password.
- [ ] Main page tro toi `smember-login.html` neu chua co session hop le.
- [ ] Login controller va `smember-login.js` san sang ket noi bang semantic `data-*` hooks.
- [ ] Truy cap truc tiep `user-info.html` khong co session hop le bi redirect toi `smember-login.html`.
- [ ] Session malformed/stale bi xoa.
- [ ] Valid session render dung User lien ket, khong luon render user dau tien.
- [ ] Phone, email va ngay sinh hien thi day du.
- [ ] Total orders, total amount, rank, gender va addresses render dung.
- [ ] Empty/non-empty address states deu hoat dong.
- [ ] Logout xoa session va khoa lai user page.
- [ ] Runtime data duoc render bang `textContent`.
- [ ] BEM va giao dien user info hien tai khong bi pha.
- [ ] Khong them framework, bundler hoac dependency.

## 18. Verification

Kiem tra syntax:

```powershell
Get-ChildItem .\src\script -Recurse -Filter *.js |
  ForEach-Object { node --check $_.FullName }
```

Chay static server:

```powershell
py -m http.server 8000
```

Browser scenarios:

1. Xoa session va mo `user-info.html`: redirect toi `smember-login.html`.
2. Dat JSON loi vao `loginInfo`: session bi xoa va redirect.
3. Thu phone rong, password rong, phone sai format, phone khong ton tai va password sai: cung mot message.
4. Login lan luot bang ba demo account: moi account hien dung User lien ket.
5. Xac nhan session khong chua password.
6. Xac nhan `lastLoginAt` la ISO timestamp va chi doi khi login dung.
7. Reload user page trong cung tab: van hien dung user.
8. Mo user page trong tab khong co session: bi redirect.
9. Logout, sau do Back/Reload: khong vao lai user page.
10. Kiem tra ca user co dia chi va khong co dia chi.
11. Kiem tra console khong co JavaScript error.
12. Kiem tra layout/BEM user info khong bi regression.

## 19. Luu y bao mat

Day la client-side prototype voi demo data. Password plaintext trong source chi chap nhan cho bai tap/frontend demo. Neu dua vao production, authentication phai chuyen sang backend, password phai hash va session phai duoc server quan ly.
