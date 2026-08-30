# SMEMBER Login — Code Fixes Spec

> Base branch: `main` · v1.0 · 2026-08-30
> Phạm vi: refactor + sửa bug nhỏ cho luồng login đang chạy. Không thay đổi UX/layout, không thêm framework/dependency.

---

## 1. Bối cảnh

Nhìn lại `smember-login.html`, `AuthService.js`, `LoginController.js`, `Account.js`, `smember-login.js`, `smember-login.css`, reviewer chỉ ra 6 vấn đề về logic sai, trùng code, magic string và dead code. Spec này chốt cách sửa từng vấn đề.

## 2. Nguyên tắc bắt buộc

- Không sửa `src/script/model/AAccount.js` và `src/script/model/AUser.js` (tầng abstract đã được duyệt).
- Không thêm framework, bundler, dependency; vẫn dùng classic scripts với `defer`.
- Giữ nguyên BEM classes và `data-*` hooks đang có trên HTML (chỉ sửa cách khai báo nội dung lặp, không đổi tên hook).
- Đảo ngược quyết định trước đó ở commit `8961dd4` một phần: phân tách rõ `PASSWORD_INCORRECT` khỏi lỗi ghi session thay vì map mọi `false` sang `PASSWORD_INCORRECT`.

## 3. File bị ảnh hưởng

| File | Thay đổi |
| --- | --- |
| `src/script/auth/LoginErrorCode.js` | **Thêm mới** — enum dùng chung cho các mã lỗi |
| `src/script/model/Account.js` | Sửa — `login()` trả kết quả phân biệt lỗi (Fix 1) |
| `src/script/auth/AuthService.js` | Sửa — map code từ `Account.login()` + dùng enum (Fix 1, 4) |
| `src/script/auth/LoginController.js` | Sửa — gộp 2 method clear + dùng enum (Fix 3, 4) |
| `src/script/page/smember-login.js` | Sửa — gom selector, báo thiếu hook rõ ràng (Fix 6) |
| `src/web/smember-login.html` | Sửa — sprite SVG dùng chung + load `LoginErrorCode.js` (Fix 2, 4) |
| `src/style/smember-login.css` | Sửa — xoá dead CSS (Fix 5) |

---

## 4. Fix 1 — Phân biệt sai mật khẩu với lỗi ghi session

### Vấn đề

`Account.login()` trả `false` ở **2 trường hợp khác nhau**:

```js
// src/script/model/Account.js:61-77
login(phone, password) {
  if (phone !== this._phone || password !== this._password) {
    return false;                      // (a) sai mật khẩu
  }
  ...
  try {
    sessionStorage.setItem('loginInfo', JSON.stringify({ ... }));
  } catch (error) {
    return false;                      // (b) sessionStorage bị chặn/lỗi
  }
  return sessionStorage.getItem('loginInfo') !== null;
}
```

`AuthService.login()` không phân biệt được nên luôn map sang `PASSWORD_INCORRECT`:

```js
// src/script/auth/AuthService.js:40-42
if (!account.login(trimmedPhone, password)) {
  return { ok: false, code: 'PASSWORD_INCORRECT' };
}
```

⇒ Người dùng bị chặn sessionStorage vẫn thấy "Mật khẩu không chính xác" — thông báo sai nguyên nhân.

### Giải pháp

`Account.login()` trả kết quả dạng `{ ok, code }` — cùng shape với `AuthService.login()` hiện có:

| Tình huống | Trả về |
| --- | --- |
| Sai phone/password | `{ ok: false, code: LoginErrorCode.PASSWORD_INCORRECT }` |
| Ghi `loginInfo` thất bại (setItem throw hoặc getItem không thấy) | `{ ok: false, code: LoginErrorCode.SESSION_WRITE_FAILED }` |
| Thành công | `{ ok: true }` |

`AAccount.login()` là abstract method không khai báo kiểu trả về nên **không cần sửa tầng abstract**.

`AuthService.login()` đổi thành:

```js
const result = account.login(trimmedPhone, password);
if (!result.ok) {
  return { ok: false, code: result.code };
}
return { ok: true };
```

`LoginController._handleSubmit()` không cần sửa logic nhánh: `SESSION_WRITE_FAILED` rơi vào nhánh `else` → `_showError(result.code)` → tra bảng `ERROR_MESSAGES`.

> Lưu ý: `docs/login-user-info-oop-spec.md §6` từng chốt `Account.login` trả boolean ("Chi trả true nếu session đã ghi thành công"). Spec này sửa đổi hợp đồng đó; cập nhật lại tài liệu cũ nếu cần.

---

## 5. Fix 2 — SVG benefit icon dùng lại 1 định nghĩa

### Vấn đề

`smember-login.html` copy nguyên xi 1 SVG icon (quà tặng) **7 lần** ở các dòng 58, 64, 70, 76, 82, 88, 94. Mỗi lần ~600 ký tự path ⇒ phình HTML, sửa icon phải sửa 7 chỗ, dễ lệch nhau.

### Giải pháp

Dùng `SVG <symbol>` + `<use>`: khai báo icon **1 lần** trong sprite ẩn, các item reference bằng `href="#..."`.

Khai báo sprite ngay sau `<body>` (hoặc trước danh sách benefits), `aria-hidden` để loại khỏi accessibility tree:

```html
<svg class="login__icon-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
     style="display:none">
  <symbol id="icon-benefit" viewBox="0 0 24 24" fill="currentColor">
    <path d="<...path icon quà tặng hiện tại...>"/>
  </symbol>
</svg>
```

Mỗi item chỉ còn:

```html
<li class="login__promo-benefits-items">
  <span class="login__promo-benefit-item-icon" aria-hidden="true">
    <svg class="login__promo-benefit-item-svg"><use href="#icon-benefit"></use></svg>
  </span>
  <span class="login__promo-benefit-item-text">...</span>
</li>
```

CSS hiện có `.login__promo-benefit-item-icon svg { width: 24px; height: 24px; }` vẫn áp dụng cho thẻ `<svg>` mới ⇒ không cần đổi CSS. Icon 7 chỗ giống hệt nhau nên chắc chắn reuse được (xác nhận: 7 path giống hệt nhau, không có biến thể).

> Chọn `href` (SVG2) thay vì `xlink:href` — hỗ trợ đầy đủ trên trình duyệt hiện đại. Không dùng file `.svg` ngoài vì phụ thuộc CORS + không cần thiết.

---

## 6. Fix 3 — Gộp `_clearFieldError` và `_clearFieldErrorOutput`

### Vấn đề

`LoginController.js` có 2 method gần như giống hệt nhau:

- `_clearFieldError(field)` — dòng 79-89: xoá field **+ xoá `_errorOutput`**
- `_clearFieldErrorOutput(field)` — dòng 99-106: xoá field, **không** đụng `_errorOutput`

Chỉ khác đúng 1 hành vi (có xoá global error hay không). `_clearError()` gọi `_clearFieldErrorOutput` 2 lần rồi tự xoá `_errorOutput`.

### Giải pháp

Gộp thành 1 method duy nhất với option:

```js
_clearFieldError(field, { clearGlobalError = false } = {}) {
  const input = field === 'phone' ? this._phoneInput : this._passwordInput;
  const output = this._fieldErrorOutputs[field];
  input?.removeAttribute('aria-invalid');
  if (output) {
    output.textContent = '';
  }
  if (clearGlobalError && this._errorOutput) {
    this._errorOutput.textContent = '';
  }
}
```

Cập nhật các điểm gọi:

```js
// input listeners (constructor)
this._phoneInput?.addEventListener('input', () => this._clearFieldError('phone'));
this._passwordInput?.addEventListener('input', () => this._clearFieldError('password'));

// _clearError()
_clearError() {
  this._clearFieldError('phone', { clearGlobalError: true });
  this._clearFieldError('password');
}
```

Xoá hẳn `_clearFieldErrorOutput`.

---

## 7. Fix 4 — Enum dùng chung cho mã lỗi

### Vấn đề

Các mã lỗi `'PHONE_REQUIRED'`, `'PASSWORD_INCORRECT'`, `'ACCOUNT_NOT_FOUND'`, ... là magic string lặp ở 2 file (hiện tại) và sẽ còn tăng khi thêm page:

- `AuthService.js`: 28, 31, 34, 38, 41
- `LoginController.js`: 3-8 (key của `ERROR_MESSAGES`), 33, 36, 40, 50, 53, 66

Sai chính tả một chữ ⇒ error message không hiện (rơi vào `SESSION_ERROR` fallback) mà không ai bắt được.

### Giải pháp

Thêm file `src/script/auth/LoginErrorCode.js` — class chứa static constants (cùng style `class ... { static }` đang dùng trong repo):

```js
class LoginErrorCode {
  static PHONE_REQUIRED = 'PHONE_REQUIRED';
  static PHONE_INVALID = 'PHONE_INVALID';
  static PASSWORD_REQUIRED = 'PASSWORD_REQUIRED';
  static ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';
  static PASSWORD_INCORRECT = 'PASSWORD_INCORRECT';
  static SESSION_WRITE_FAILED = 'SESSION_WRITE_FAILED';   // mới — Fix 1
  static SESSION_ERROR = 'SESSION_ERROR';
}
```

Thay toàn bộ literal trong `AuthService.js` và `LoginController.js`:

```js
return { ok: false, code: LoginErrorCode.PHONE_REQUIRED };

// LoginController.js
static ERROR_MESSAGES = {
  [LoginErrorCode.PHONE_REQUIRED]: '...',
  ...
  [LoginErrorCode.SESSION_ERROR]: '...'
};
...
if (result.code === LoginErrorCode.ACCOUNT_NOT_FOUND) { ... }
```

Thêm `SESSION_WRITE_FAILED` vào bảng `ERROR_MESSAGES`:

```js
[LoginErrorCode.SESSION_WRITE_FAILED]: 'Không thể đăng nhập lúc này. Trình duyệt đang chặn lưu phiên. Vui lòng thử lại.',
```

`smember-login.html` load file enum **trước** `AuthService.js` trong dependency order:

```html
<script defer src="../script/auth/LoginErrorCode.js"></script>
<script defer src="../script/auth/AuthService.js"></script>
```

---

## 8. Fix 5 — Xoá dead CSS `login__form-field--error` (và `--valid`)

### Vấn đề

`smember-login.css` có các rule cho modifier không bao giờ được dùng:

- Dòng 235-236: `.login__form-field--error .login__form-field-input { border-color: #EF4444; }` (+ `:focus`)
- Dòng 239: `.login__form-field--error .login__form-field-message { display: block; }`
- Dòng 237: `.login__form-field--valid .login__form-field-input { border-color: #10B981; }`

Trạng thái lỗi thực tế do `LoginController` điều khiển bằng `aria-invalid="true"` trên input và `textContent` trên message — CSS đã có sẵn bộ rule này ở dòng 243-245:

```css
.login__form-field-input[aria-invalid="true"],
.login__form-field-input[aria-invalid="true"]:focus { border-color: #EF4444; }
.login__form-field-message:not(:empty) { display: block; }
```

Grep xác nhận không nơi nào trong HTML/JS gán class `login__form-field--error` hay `login__form-field--valid`.

### Giải pháp

Xoá 4 rule dòng 235-239 (235, 236, 237, 239), giữ lại:
- Dòng 238 `.login__form-field-message { display: none; ... }` (vẫn dùng, kết hợp `:not(:empty)` ở 245)
- Khối 243-245 (cơ chế trạng thái hiện tại)

**Xoá kèm** (cùng loại dead code, phát hiện khi kiểm tra): các rule `.is-visible` ở dòng 269-272 + comment dòng 268 — không code nào set class `is-visible` nữa; script chỉ set `aria-pressed`.

> Nếu sau này thực sự cần class-based state thì mới thêm lại — đừng giữ CSS chết "để dành".

---

## 9. Fix 6 — Selector gom 1 chỗ, thiếu thì báo rõ

### Vấn đề

`smember-login.js` dòng 1-13: 8 `querySelector` rải rác, nếu thiếu bất kỳ cái nào thì `return;` **im lặng** — trang login không chạy mà console không có gì. Một bạn trong nhóm đổi `data-login-field="phone"` → người kiểm thử mở trang thấy form bất tử nhưng không biết thiếu selector nào; lâu lắm mới truy ra.

### Giải pháp

1. **Gom 8 selector vào 1 bảng khai báo duy nhất** (single source of truth cho DOM contract).
2. **Query từng cái, thu danh sách thiếu**, nếu thiếu thì `console.error` liệt kê đủ selector + tên hook rồi mới `return`.

```js
(function () {
  const hooks = {
    form: '[data-login-form]',
    phone: '[data-login-field="phone"]',
    password: '[data-login-field="password"]',
    phoneError: '[data-login-field-error="phone"]',
    passwordError: '[data-login-field-error="password"]',
    error: '[data-login-error]',
    passwordToggle: '[data-password-toggle]',
    capsWarning: '[data-password-caps]'
  };

  const nodes = {};
  const missing = [];
  for (const [name, selector] of Object.entries(hooks)) {
    const node = document.querySelector(selector);
    if (node) {
      nodes[name] = node;
    } else {
      missing.push(`${selector} (${name})`);
    }
  }

  if (missing.length > 0) {
    console.error(
      '[smember-login] Thiếu DOM hook — trang đăng nhập KHÔNG được khởi tạo.\n' +
      'Nếu bạn vừa sửa HTML, hãy kiểm tra các selector sau:\n- ' + missing.join('\n- ')
    );
    return;
  }
  ...
})();
```

3. Đổi các tham chiếu phía dưới sang `nodes.*` (`nodes.form`, `nodes.phone`, `nodes.phoneError`, ...).

### Kết quả mong muốn (góc độ nhóm)

- Bạn sửa HTML đổi `data-login-field` → mở DevTools là thấy ngay `[smember-login] Thiếu DOM hook ... [data-login-field="phone"]`.
- Không còn "trang chết im lặng" vô thời hạn; thời gian phát hiện giảm từ "không biết khi nào" xuống "ngay lần mở console đầu tiên".
- Bảng `hooks` là nơi duy nhất phải sync khi HTML đổi hook (có thể kèm comment tham chiếu tới DOM contract ở `docs/login-user-info-oop-spec.md §10`).

---

## 10. Acceptance criteria

- [ ] `AAccount.js` và `AUser.js` không thay đổi.
- [ ] `Account.login()` trả `{ ok, code }`; sai mật khẩu → `PASSWORD_INCORRECT`, lỗi sessionStorage → `SESSION_WRITE_FAILED`.
- [ ] `AuthService.login()` không tự map code; nhận code trực tiếp từ `Account.login()`.
- [ ] Giao diện hiện đúng 2 thông báo khác nhau cho 2 trường hợp trên (sai mật khẩu hiện ở field password; lỗi session hiện ở vùng error chung).
- [ ] SVG icon quà tặng chỉ khai báo 1 lần dạng `<symbol>`, 7 item dùng `<use href="#icon-benefit">`.
- [ ] Không còn copy-paste path SVG lặp; render hiển thị giống hệt trước khi sửa.
- [ ] `LoginController` chỉ còn 1 method clear field error, `_clearFieldErrorOutput` bị xoá.
- [ ] Mọi mã lỗi trong `AuthService.js` và `LoginController.js` dùng `LoginErrorCode.*`, không còn magic string.
- [ ] `smember-login.html` load `LoginErrorCode.js` trước `AuthService.js`.
- [ ] Rule `.login__form-field--error`, `.login__form-field--valid` và `.is-visible` bị xoá khỏi CSS.
- [ ] Trạng thái lỗi field vẫn hiển thị đúng qua `aria-invalid` + `:not(:empty)`.
- [ ] 8 selector trong `smember-login.js` nằm trong 1 bảng `hooks`; thiếu cái nào console.error liệt kê đủ cái đó kèm tên hook.
- [ ] Xoá bớt 1 hook thử nghiệm trong DevTools → trang vẫn an toàn (không throw), console báo rõ hook thiếu.
- [ ] Luồng login chuẩn không đổi: login đúng → `user-info.html`; sai → thông báo đúng field.
- [ ] Không thêm framework, bundler, dependency.

## 11. Verification

Kiểm tra syntax:

```powershell
Get-ChildItem .\src\script -Recurse -Filter *.js |
  ForEach-Object { node --check $_.FullName }
```

Chạy static server:

```powershell
py -m http.server 8000
```

Browser scenarios (đảm bảo DevTools mở console):

1. Mở `smember-login.html` với đủ hooks: không có console error, form hoạt động.
2. Tạm sửa `data-login-field="phone"` → `data-login-field="phone-x"`: console báo thiếu `[data-login-field="phone"] (phone)`, trang không khởi tạo nhưng không throw.
3. Login sai mật khẩu: message ở field password = "Mật khẩu không chính xác".
4. Simulate lỗi sessionStorage (override `Storage.prototype.setItem` để throw): message ở vùng error chung = message `SESSION_WRITE_FAILED`.
5. Login đúng cả 3 demo account: vào `user-info.html`, hiển thị đúng user.
6. Kiểm tra 7 icon benefit render giống hệt nhau (kích thước 24×24, màu accent).
7. Bật/tắt mật khẩu bằng toggle: vẫn hoạt động dù đã bỏ `.is-visible`.
8. Console không có JavaScript error; layout/BEM không regression.

---

*SMEMBER Login Code Fixes Spec · v1.0 · 2026-08-30*
