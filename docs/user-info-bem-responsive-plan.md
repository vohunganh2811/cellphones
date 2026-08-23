---
title: "Kế hoạch BEM User Info và responsive mobile fidelity"
status: implemented
date: 2026-08-22
sources:
  - `C:\Users\trmin\Downloads\BEM_UserProfile_Desktop.xml`
  - `C:\Users\trmin\Downloads\BEM_UserProfile_Mobile.xml`
  - `https://smember.com.vn/user-info`
---

# Final Specification — User Info BEM Migration & Responsive Mobile Fidelity

> **Trạng thái:** Plan/spec only; không chỉnh sửa file.  
> **Thay thế hoàn toàn:** Tài liệu này supersede mọi draft và Revision 2 trước đó.  
> **Worktree:** `E:\SET-2026\cellphoneS\cellphones-user-info-icons`

---

## 1. Mục tiêu và phạm vi

### 1.1 Mục tiêu

Worker cần:

1. Chuyển markup và selector trang `user-info` sang hệ tên BEM authoritative.
2. Giữ đúng topology desktop:
   - Một surface overview dùng chung.
   - Ba block semantic sibling bên trong.
   - Giữ visible red separators.
3. Bổ sung mobile layout trung thực:
   - Mobile header.
   - Content stack đúng thứ tự.
   - Password section dù Mobile XML bỏ sót.
   - Fixed bottom navigation gồm bốn mục đã khóa nhãn/thứ tự.
4. Sửa các defect hiện tại:
   - Desktop shell quá rộng.
   - Rows/actions tiến sát mép card.
   - Action bị vẽ như outlined button.
   - Không có mobile fidelity.
   - BEM có element-of-element, state class và mixed block sai vị trí.

### 1.2 File boundary

Chỉ được thay đổi:

- `user-info.html`
- `user-info.css`
- `assets/user-info/`

Không sửa:

- `styles.css`
- `index.html`
- Trang hoặc asset directory khác
- Build/tooling/config của repository

### 1.3 Non-goals

- Không thêm JavaScript, API hoặc authentication flow.
- Không thay đổi nghiệp vụ hoặc copy ngoài các giá trị đã xác minh.
- Không redesign thương hiệu CellphoneS.
- Không tạo component framework/design system mới.
- Không thêm control chỉ vì XML đặt tên nếu visual authority không hiển thị.
- Không chuyển XML coordinates thành CSS pixel values.
- Không tạo bản sao desktop/mobile của cùng account content.

---

## 2. Thứ tự nguồn thẩm quyền

Khi có xung đột:

1. Screenshot gốc do người dùng cung cấp.
2. Live original `https://smember.com.vn/user-info`, chỉ dùng visual/Elements/public static assets.
3. Desktop XML:
   - `C:\Users\trmin\Downloads\BEM_UserProfile_Desktop.xml`
4. Mobile XML:
   - `C:\Users\trmin\Downloads\BEM_UserProfile_Mobile.xml`
5. Clone hiện tại chỉ là nguồn content và implementation evidence.

### Phân vai nguồn

- Screenshot/live original: hình học, kích thước, khoảng cách, màu, visibility và visual treatment.
- XML: tên class và topology BEM.
- Current clone: nội dung, semantic elements hiện có và asset candidates.

Không diễn giải một frame/sibling trong XML thành visual card độc lập nếu screenshot không chứng minh điều đó.

---

## 3. Privacy và security constraints

Khi kiểm tra live original:

- Không sao chép hoặc ghi lại:
  - Họ tên thật.
  - Số điện thoại/email/địa chỉ thật.
  - Đơn hàng, membership ID hoặc account ID.
  - Cookie, access token, refresh token.
  - Local/session storage.
  - Authenticated API payload.
- Không dùng authenticated API để lấy asset.
- Không gửi cookie hoặc authorization header khi download public asset.
- Không lưu screenshot live có PII.
- Screenshot QA phải dùng dữ liệu đã che.
- Không commit screenshot chứa account thật.
- Không để URL remote runtime trong HTML/CSS.

Nếu cần kiểm tra Elements, chỉ ghi nhận non-PII facts và URL static công khai.

---

## 4. Canonical BEM policy

### 4.1 Tập class được phép

Mọi class trong `user-info.html` phải thuộc:

1. Exact union của Desktop XML và Mobile XML.
2. Base class bắt buộc được suy ra từ modifier trong XML.
3. Hai a11y utility được allowlist:
   - `.skip-link`
   - `.sr-only`

Ví dụ inferred bases hợp lệ:

- XML có `.header__nav-item--store` nên `.header__nav-item` là inferred base.
- XML có `.app-promo__badge--google` nên `.app-promo__badge` là inferred base.
- Modifier luôn phải đi cùng base trên cùng element.

### 4.2 Semantic wrappers không class

Strict XML union khả thi bằng cách để các wrapper sau không có class:

- Mobile header title.
- Linked provider name/state.
- Address illustration wrapper.
- App-store badge grouping wrapper.
- Incidental layout wrappers không có XML authority.

Có thể style thông qua canonical parent và semantic child selector.

Nếu worker cho rằng cần class ngoài union, phải dừng và yêu cầu explicit allowlist amendment. Không tự tạo class mới.

### 4.3 Naming rules

- Block: `.block`
- Element: `.block__element`
- Modifier: `.block--modifier` hoặc `.block__element--modifier`
- Modifier phải có base.
- Cấm `block__element__child`.

Ví dụ:

- Sai: `.header__nav-item__icon`
- Đúng: `.header__nav-item-icon`

### 4.4 State rules

Nếu XML không có modifier state, dùng attribute:

- Current page: `aria-current="page"`
- Expanded: `aria-expanded`
- Disabled: native `disabled` hoặc `aria-disabled`
- Hidden: native `hidden` hoặc responsive CSS

Không dùng:

- `.active`
- `.is-active`
- `.account-nav-item--active`
- `.mobile-only`
- `.desktop-only`
- State utility tự đặt khác

### 4.5 CSS coverage

Structural authority class không bắt buộc có CSS declaration riêng.

Static check không được fail chỉ vì một authority class hợp lệ không có dedicated CSS rule.

---

## 5. Canonical topology

### 5.1 Desktop overview — một shared surface duy nhất

```text
.member-overview
  .member-overview__cards
    .member-card
    .stat-card
    .brand-switch
  .member-tabs
```

Visual model:

- `.member-overview__cards` là một white rounded/shadowed surface duy nhất.
- Background, outer radius, shadow và clipping thuộc wrapper này.
- `.member-card`, `.stat-card`, `.brand-switch` là ba semantic/BEM regions sibling.
- Ba child block phải:
  - có background transparent;
  - không có independent shadow;
  - không có independent outer radius;
  - không có gaps khiến chúng trông như ba card rời.
- Giữ red separators nhìn thấy giữa ba vùng:
  - dùng border của sibling; hoặc
  - unclassed structural separator nếu cần.
- Separator phải khớp vị trí, chiều cao, thickness và inset của original.

Acceptance riêng:

- Chỉ nhìn thấy một outer overview surface.
- Ba canonical sibling blocks nằm bên trong.
- Red separators vẫn hiện diện.
- Child computed backgrounds transparent.
- Child blocks không có independent shadow/outer corner treatment.

### 5.2 Desktop account

```text
.account-layout
  .account-sidebar
    .account-nav-item × N
    .account-nav__divider
    .app-promo
  .account-content
    .account-content__header
    .info-card
    .address-card
    .account-content__row
      .password-card
      .linked-accounts
```

- Sidebar và app promo chỉ desktop.
- Account content được tái sử dụng trên mobile.
- `.account-content__row` là two-column desktop wrapper; mobile chuyển thành một cột.
- Không duplicate cards theo breakpoint.

### 5.3 Mobile topology đã xác minh

```text
.header
  .header__back
  unclassed heading: "Tài khoản"
  .header__actions

.account-content
  .account-content__header
  .info-card
  .address-card
  .account-content__row
    .password-card
    .linked-accounts

.bottom-nav
  .bottom-nav__item: "Tổng quan"
  .bottom-nav__item: "Lịch sử"
  .bottom-nav__item: "Ưu đãi"
  .bottom-nav__item: "Tài khoản" [aria-current="page"]
```

Thứ tự content bắt buộc:

1. Alert/account-content header
2. Personal information
3. Address
4. Password
5. Linked accounts
6. Fixed bottom navigation

Mobile title tại verified state là **“Tài khoản”**.

---

## 6. Complete class migration matrix

### 6.1 Page và header

| Current selector | Target | Hành động |
|---|---|---|
| `.page` | `.user` | Rename trên `<body>`. |
| `.skip-link` | cùng tên | Giữ theo allowlist. |
| `.sr-only` | cùng tên | Giữ theo allowlist. |
| `.header` | cùng tên | Giữ, shared shell. |
| `.header__inner` | cùng tên | Giữ. |
| `.header__logo` | cùng tên | Giữ, desktop visible. |
| `.header__search` | cùng tên | Giữ, desktop visible. |
| `.header__search-btn` | cùng tên | Giữ. |
| `.header__nav` | cùng tên | Giữ, desktop visible. |
| `.header__nav-item` | cùng tên | Giữ/inferred base. |
| `.header__nav-item--store` | cùng tên + base | Giữ. |
| `.header__nav-item--hotline` | cùng tên + base | Giữ. |
| `.header__nav-item__icon` | `.header__nav-item-icon` | Rename toàn bộ. |
| `.header__nav-item__label` | `.header__nav-item-label` | Rename toàn bộ. |
| `.header__cart` | `.header__nav-item` | Cart vẫn là cart; không áp `--phone`. |
| `.header__cart__icon` | `.header__nav-item-icon` | Rename. |
| `.header__cart__label` | `.header__nav-item-label` | Rename. |
| `.header__account` trên overview avatar | `.member-card__avatar` | Gỡ `.header__account` khỏi avatar. |
| Actual desktop account control | `.header__account` | Chỉ đặt trên control thật khi visible reference xác nhận. |
| Missing mobile back | `.header__back` | Thêm theo visible reference. |
| Missing mobile actions | `.header__actions` | Thêm group; không tự suy ra control con từ XML. |
| Missing mobile title class | Không thêm class | Dùng heading semantic unclassed: “Tài khoản”. |

Quyết định khóa:

- `.header__account` không mix với `.member-card__avatar`.
- Cart dùng `.header__nav-item`, `.header__nav-item-icon`, `.header__nav-item-label`.
- Không gắn `.header__nav-item--phone` lên cart.
- Không thêm desktop account control nếu visual authority không có.

### 6.2 Shared overview surface

| Current selector | Target | Hành động |
|---|---|---|
| `.member-overview` | cùng tên | Giữ, desktop-only. |
| `.overview-card` | `.member-overview__cards` | Rename thành outer shared surface. |
| `.overview-card__main` | Unclassed wrapper hoặc bỏ | Không tạo class ngoài authority. |
| `.overview-card__profile` | `.member-card` | Rename thành transparent first region. |
| `.overview-card__avatar` | `.member-card__avatar` | Rename. |
| `.overview-card__profile__info` | `.member-card__info` | Rename. |
| `.overview-card__name-row` | Unclassed wrapper | Bỏ class. |
| `.overview-card__name` | `.member-card__name` | Rename. |
| `.overview-card__badge` | `.member-card__badge` | Rename. |
| `.overview-card__meta` | `.member-card__info-row` | Rename. |
| `.overview-card__divider` | Không có target class | Bỏ class cũ nhưng giữ visible red separators bằng canonical sibling border/unclassed markup. |
| `.overview-card__stats-block` | `.stat-card` | Rename thành transparent middle region. |
| `.overview-card__stats` | `.stat-card__list` | Rename. |
| `.overview-card__stat` | `.stat-card__item` | Rename. |
| `.overview-card__stat__icon` | `.stat-card__item-icon` | Rename. |
| `.overview-card__stat__text` | `.stat-card__item-content` | Rename. |
| `.overview-card__stat__label` | `.stat-card__item-label` | Rename. |
| `.overview-card__stat__value` | `.stat-card__item-value` | Rename. |
| Missing bar | `.stat-card__item-bar` | Chỉ render nếu original có visible bar. |
| Missing secondary text | `.stat-card__item-sub` | Chỉ render nếu original có. |
| `.overview-card__note` | `.stat-card__footer` | Rename. |
| Missing footer icon | `.stat-card__footer-icon` | Chỉ thêm nếu original có. |
| `.overview-card__channel` | `.brand-switch` | Rename thành transparent third region. |
| `.overview-card__channel__label` | `.brand-switch__header` | Rename. |
| Missing wrapper | `.brand-switch__body` | Thêm nếu topology cần. |
| `.overview-card__channel__tile` | `.brand-switch__logo` | Rename. |
| Missing wrapper | `.brand-switch__actions` | Thêm. |
| `.overview-card__channel__domain` | `.brand-switch__action-row` hoặc unclassed text | Chọn theo topology visual. |
| `.overview-card__channel__toggle` | `.brand-switch__toggle` | Rename. |
| `.overview-card__channel__control` | `.brand-switch__toggle-label` | Rename. |
| `.overview-card__channel__icon` | `.brand-switch__toggle-icon` | Rename. |

### 6.3 Member tabs

| Current | Target | Hành động |
|---|---|---|
| `.member-shortcut` | `.member-tabs` | Rename; desktop-only. |
| `.member-shortcut__item` | `.member-tabs__item` | Rename. |
| `.member-shortcut__icon` | `.member-tabs__item-icon` | Rename. |
| `.member-shortcut__label` | `.member-tabs__item-label` | Rename. |

Không hiển thị `.member-tabs` ở mobile verified state.

### 6.4 Account sidebar

| Current | Target | Hành động |
|---|---|---|
| `.account-layout` | cùng tên | Giữ. |
| `.account-sidebar` | cùng tên | Giữ, desktop-only. |
| `.account-content` | cùng tên | Giữ, shared. |
| `.account-nav-item` | cùng tên | Giữ. |
| `.account-nav-item__icon` | cùng tên | Giữ. |
| `.account-nav-item__label` | cùng tên | Giữ. |
| `.account-sidebar__separator` | `.account-nav__divider` | Rename. |
| `.account-nav-item--active` | Không dùng | Xóa; dùng `[aria-current="page"]`. |
| `.account-nav-item--button` | Không dùng | Xóa; native `<button>` xác định behavior. |
| `.account-content__row` | cùng tên | Giữ; two-column desktop, single-column mobile. |

### 6.5 App promo

| Current | Target | Hành động |
|---|---|---|
| `.app-promo` | cùng tên | Giữ, desktop-only. |
| `.app-promo__content` | cùng tên | Giữ. |
| `.app-promo__badges` | cùng tên | Giữ. |
| `.app-promo__badge--qrcode` | Unclassed wrapper | Xóa class; XML không có QR badge role. |
| `.app-promo__badge--link` | Unclassed wrapper | Xóa class. |
| `.app-promo__badge__ggplay` | `.app-promo__badge app-promo__badge--google` | Rename; base inferred bắt buộc. |
| `.app-promo__badge__appstore` | `.app-promo__badge app-promo__badge--appstore` | Rename; base inferred bắt buộc. |
| Whole official badge image | Không bắt buộc decomposition | Giữ nguyên nếu text đã nằm trong image. |
| Decomposed logo | `.app-promo__badge-logo` | Chỉ dùng nếu DOM thật sự tách logo. |
| Decomposed text | `.app-promo__badge-text` | Chỉ dùng nếu DOM thật sự tách text. |

### 6.6 Account-content header/alert

| Current | Target | Hành động |
|---|---|---|
| `.account-alert` | `.account-content__header` | Rename. |
| `.account-alert__icon` | `.account-content__header-icon` | Rename. |
| `.account-alert__text` | `.account-content__header-title` | Rename. |
| `.account-alert__action` | `.account-content__header-action` | Rename. |

Giữ `role="note"` nếu đây là static advisory message.

### 6.7 Personal information

```text
.info-card
  .info-card__header
    .info-card__title
    .info-card__action
  .info-card__body
    .info-card__field-group
      .info-card__field
        .info-card__field-label
        .info-card__field-value
```

| Current | Target | Hành động |
|---|---|---|
| `.info-card` | cùng tên | Giữ. |
| `.info-card__header` | cùng tên | Giữ. |
| `.info-card__title` | cùng tên | Giữ. |
| `.info-card__action` | cùng tên | Giữ naming; sửa visual treatment. |
| `.info-card__list` | `.info-card__body` | Rename. |
| Missing groups | `.info-card__field-group` | Thêm hai group. |
| `.info-card__row` | `.info-card__field` | Rename. |
| `.info-card__row__label` | `.info-card__field-label` | Rename. |
| `.info-card__row__value` | `.info-card__field-value` | Rename. |

Grouping:

- Group 1: Họ tên, Giới tính, Ngày sinh.
- Group 2: Số điện thoại, Email, Địa chỉ mặc định.

Xóa semantic logic dựa trên `.info-card__row:nth-child(-n+4)`.

### 6.8 Address

| Current | Target | Hành động |
|---|---|---|
| `.address-card` | cùng tên | Giữ. |
| `.address-card__header` | cùng tên | Giữ. |
| `.address-card__title` | cùng tên | Giữ. |
| `.address-card__action` | cùng tên | Giữ action duy nhất ở header. |
| `.address-card__body` | cùng tên | Giữ. |
| `.address-card__illustration` | Unclassed wrapper | Xóa class. |
| `.address-card__empty` | cùng tên | Giữ. |
| `.address-card__add-btn` | Không render | Không thêm trong approved state. |

Approved state có đúng một visible “Thêm địa chỉ” action ở header.

### 6.9 Password

| Current | Target | Hành động |
|---|---|---|
| `.password-card` | cùng tên | Giữ, shared desktop/mobile. |
| `.password-card__header` | cùng tên | Giữ. |
| `.password-card__title` | cùng tên | Giữ. |
| `.password-card__action` | cùng tên | Giữ, sửa visual treatment. |
| `.password-card__body` | cùng tên | Giữ. |
| `.password-card__label` | `.password-card__body-label` | Rename. |
| `.password-card__value` | `.password-card__body-value` | Rename. |

Password tồn tại trên mobile dù Mobile XML bỏ sót.

### 6.10 Linked accounts

```text
.linked-accounts
  .linked-accounts__header
    unclassed heading
  .linked-accounts__list
    .linked-accounts__item
      .linked-item
        .linked-item__icon
        unclassed provider/state text
        .linked-item__action
```

| Current | Target | Hành động |
|---|---|---|
| `.linked-accounts` | cùng tên | Giữ. |
| `.linked-accounts__header` | cùng tên | Giữ. |
| `.linked-accounts__title` | Unclassed heading | Xóa class. |
| `.linked-accounts__list` | cùng tên | Giữ. |
| `.linked-accounts__item` | cùng tên | Giữ list-item wrapper. |
| Missing row block | `.linked-item` | Thêm inner plain row. |
| `.linked-accounts__logo` | `.linked-item__icon` | Rename. |
| `.linked-accounts__logo--google` | Không dùng | Xóa. |
| `.linked-accounts__logo--zalo` | Không dùng | Xóa. |
| `.linked-accounts__name` | Unclassed text | Xóa class. |
| `.linked-accounts__state` | Unclassed text | Xóa class. |
| `.linked-accounts__action` | `.linked-item__action` | Rename. |
| `.linked-item__box` | Không render | Visual original override. |
| `.linked-item__box--google` | Không render | Visual original override. |
| `.linked-item__box--zalo` | Không render | Visual original override. |

Mỗi provider là một plain row có horizontal inset và separator; không có outlined provider box.

### 6.11 Bottom navigation

Thêm:

- `.bottom-nav`
- bốn `.bottom-nav__item`
- `.bottom-nav__item-icon`
- `.bottom-nav__item-label`

Nhãn và thứ tự đã khóa:

| Vị trí | Nhãn | State |
|---:|---|---|
| 1 | Tổng quan | Không current |
| 2 | Lịch sử | Không current |
| 3 | Ưu đãi | Không current |
| 4 | Tài khoản | `aria-current="page"` |

Yêu cầu:

- Đúng bốn item, không thêm/bớt.
- Thứ tự DOM, visual và keyboard đều như bảng.
- Item thứ tư “Tài khoản” là active/current.
- Không dùng `--active`, `.active` hoặc `.is-active`.
- Icon và destination phải lấy từ visible/public evidence; không tự suy đoán nếu chưa xác minh.

---

## 7. Desktop layout và shell measurement

### 7.1 Không có hardcoded shell target được phê duyệt

Không giả định:

- `1440px`
- `1680px`
- Gutter 240px
- Header và main luôn cùng width

Worker phải đo cùng viewport trước khi chọn shell constraints.

### 7.2 Quy trình đo bắt buộc

1. Mở original reference và implementation ở:
   - cùng viewport;
   - cùng browser zoom;
   - cùng device pixel ratio nếu có thể;
   - không có side panel làm thay đổi layout width.
2. Đo riêng:
   - viewport width;
   - shell left/right edge;
   - shell width;
   - header inner left/right edge;
   - main shell left/right edge.
3. Tính:
   - shell width / viewport width;
   - left/right gutter ratio.
4. Chỉ sau đó mới chọn fluid width/max-width/gutter rules.
5. Không giả định header inner và main shell cùng width nếu screenshot không xác nhận.
6. So sánh lại tại 1920, 1440 và 1280.

### 7.3 Acceptance tolerance

- Với same-viewport reference:
  - left edge lệch không quá 8px;
  - right edge lệch không quá 8px.
- Nếu chỉ có một reference:
  - shell width ratio lệch không quá 0.5 percentage points tại viewport đó.
- Large outer gray gutters phải tương đương original.
- Không có hard max-width nào được approved trước measurement.

### 7.4 Desktop spacing

- Card/surface content có horizontal inset rõ.
- Header, body, rows và separators cùng trục.
- Không để:
  - text chạm card radius;
  - action chạm outer edge;
  - separator chạy sát edge khi original inset;
  - linked row tràn card.
- Grid/flex children phải shrink-safe.
- Overview content không tràn outer shared surface.

---

## 8. Responsive mobile specification

### 8.1 Breakpoint status

`max-width: 767px` chỉ là provisional implementation decision, không phải XML/live authority.

Verified facts:

- 390×844 dùng mobile layout.
- 430px phải tiếp tục là mobile.
- Desktop verification bắt đầu từ 1280px.

Worker có thể khởi đầu với ≤767px nhưng phải chọn breakpoint cuối sau content-fit testing.

### 8.2 Test hai phía breakpoint

Nếu breakpoint cuối là `B`, test:

- `B`
- `B + 1`

Kiểm tra:

- Header collision.
- Duplicated content.
- Hidden content còn focusable.
- Sidebar/tabs visibility.
- Bottom-nav visibility.
- Horizontal overflow.
- Keyboard accessibility.

Breakpoint cuối phải được ghi là implementation decision trong handoff.

### 8.3 Show/hide strategy

Mobile hiển thị:

- `.header__back`
- Unclassed title “Tài khoản”
- `.header__actions`
- `.account-content__header`
- `.info-card`
- `.address-card`
- `.password-card`
- `.linked-accounts`
- `.bottom-nav`

Mobile ẩn:

- `.header__logo`
- `.header__search`
- `.header__nav`
- Actual desktop `.header__account`
- `.member-overview`
- `.member-tabs`
- `.account-sidebar`
- `.app-promo`

Không tạo utility class để show/hide. Hidden controls không được còn trong tab order.

### 8.4 DOM strategy

- Chỉ một instance của mỗi content section.
- `.account-content__row` chuyển từ two-column sang single-column.
- DOM order tạo đúng visual/mobile order.
- Không dùng CSS order để làm tab/screen-reader order khác DOM.

### 8.5 Mobile gutters

Dùng same-viewport reference để xác nhận gutter cuối tại:

- 360×800
- 390×844
- 430×932

Yêu cầu:

- Card không dính viewport edge.
- Card content có horizontal inset.
- Alert text/action có khoảng thở.
- Linked rows và separators inset.
- Không horizontal overflow.

### 8.6 Mobile header

- Back control có accessible name và hit target tối thiểu 44×44px.
- Title chính xác: “Tài khoản”.
- Header actions chỉ gồm controls nhìn thấy trong reference.
- Icon-only action có `aria-label`.
- Title/action không collision ở 360px.

### 8.7 Bottom navigation

- Fixed ở đáy viewport.
- Bốn item theo đúng thứ tự:
  1. Tổng quan
  2. Lịch sử
  3. Ưu đãi
  4. Tài khoản
- Item “Tài khoản” có `aria-current="page"`.
- DOM order, visual order và keyboard order giống nhau.
- Tính `env(safe-area-inset-bottom)`.
- Main content có bottom clearance gồm nav height, safe-area inset và khoảng trống đủ.
- Fixed nav không che linked row/action cuối hoặc focus target.
- Active treatment không chỉ dựa vào màu.

---

## 9. Borderless action treatment — mechanically testable

Áp dụng cho:

- `.account-content__header-action`
- `.info-card__action`
- `.address-card__action`
- `.password-card__action`
- `.linked-item__action`

### 9.1 Resting computed state

Bắt buộc:

- Mọi computed border width bằng `0`.
- Background hoàn toàn transparent.
- `box-shadow: none`.
- Không persistent outline.
- Không visual container khiến action trông như outlined/filled button.
- `::before` và `::after`, nếu có:
  - không painted background;
  - không border;
  - không box-shadow;
  - không outline.

### 9.2 Hover state

Hover không được tạo:

- Red filled box.
- Red outlined box.
- Painted pseudo-element box.
- Shadowed button container.

Được phép:

- Underline.
- Color/tone adjustment.
- Opacity adjustment vẫn đạt contrast.
- Text/icon emphasis không tạo container.

### 9.3 Focus state

- `:focus-visible` phải có visible indicator.
- Focus outline là transient keyboard state, không phải persistent wrapper.
- Focus indicator không bị card clipping hoặc fixed nav che.
- Không remove focus outline nếu không có replacement đạt contrast.

### 9.4 Hit area

Có thể dùng:

- `min-height: 44px`.
- Flex alignment.
- Unpainted pseudo-element expansion.

Nếu dùng pseudo-element:

- Hoàn toàn transparent.
- Không border/background/shadow.
- Không overlap adjacent control.
- Không chiếm pointer target của control khác.

### 9.5 Padding requirements

| Action | Desktop | Mobile |
|---|---|---|
| Alert update | Borderless; padding theo same-viewport reference. | Chính xác `8px 16px`. |
| Info update | Visual padding `0` trừ khi reference chứng minh khác. | Borderless; không tạo box. |
| Header address action | Visual padding `0` trừ khi reference chứng minh khác. | Một header action duy nhất; không box. |
| Password action | Visual padding `0` trừ khi reference chứng minh khác. | Chính xác `0`. |
| Linked actions | Visual padding `0` trừ khi reference chứng minh khác. | Borderless inline; hit area mở rộng không paint. |

### 9.6 Browser check

Với từng action, kiểm tra riêng:

1. Rest.
2. Pointer hover.
3. Keyboard focus-visible.

Kiểm tra computed styles của element, `::before` và `::after`.

---

## 10. Existing design tokens

Ưu tiên tái sử dụng:

- `--brand`
- `--soft`
- `--canvas`
- `--surface`
- `--text`
- `--secondary`
- `--divider`
- `--icon-bg`
- `--stat-bg`
- `--radius-card`
- `--radius-control`
- `--radius-round`
- `--layout-gap`
- Header gradient
- Existing card shadow
- Existing system font stack

Không phê duyệt trước giá trị mới cho `--shell`.

Worker đặt shell token sau measurement. Không tạo raw color mới nếu token hiện tại đã mô tả đúng semantic.

---

## 11. Asset và icon strategy

### 11.1 Existing candidates

`assets/user-info/` hiện có:

- `Logo_CPS.webp`
- `avata-ant.b574f3e9.svg`
- `cellphones-icon.1b92082f.svg`
- `empty.f8088c4d.png`
- `QR_appGeneral-v2.webp`
- `downloadANDROID.webp`
- `downloadiOS.webp`
- `logo-google.svg`
- `logo-zalo.svg`
- `cellphones-zalo.webp`

Các file và inline SVG hiện tại chỉ là candidates, không tự động visually approved.

### 11.2 Desktop/mobile icon reference map

Worker phải map mọi visible icon role:

| Breakpoint | Khu vực | Role | Candidate |
|---|---|---|---|
| Desktop | Header | Logo | `Logo_CPS.webp` |
| Desktop | Header | Search/store/hotline/cart | Inline SVG candidates |
| Desktop | Header | Account, nếu visible | Chưa xác minh |
| Desktop | Overview | Avatar | `avata-ant.b574f3e9.svg` |
| Desktop | Stat | Order/money icons | Inline SVG candidates |
| Desktop | Brand switch | Logo | `cellphones-icon.1b92082f.svg` |
| Desktop | Brand switch | Toggle/arrow | Inline SVG candidate |
| Desktop | Member tabs | Sáu shortcut icons | Inline SVG candidates |
| Desktop | Sidebar | Account-nav icons | Inline SVG candidates |
| Shared | Alert | Advisory icon | Inline SVG candidate |
| Shared | Address | Empty artwork | `empty.f8088c4d.png` |
| Shared | Linked | Google/Zalo | Local logo candidates |
| Desktop | App promo | QR/store badges | Existing local assets |
| Mobile | Header | Back/actions | Chưa xác minh đầy đủ |
| Mobile | Bottom nav 1 | Tổng quan icon | Evidence-dependent |
| Mobile | Bottom nav 2 | Lịch sử icon | Evidence-dependent |
| Mobile | Bottom nav 3 | Ưu đãi icon | Evidence-dependent |
| Mobile | Bottom nav 4 | Tài khoản active icon | Evidence-dependent |

Mỗi role cần ghi:

- Reference source.
- Candidate source.
- `MATCH`, `MISMATCH`, `BLOCKED` hoặc `NOT_VISIBLE`.
- Desktop/mobile sharing.
- Active/inactive variation nếu có.

### 11.3 Public-static asset validation

Chỉ download khi:

1. URL là unauthenticated public `https://`.
2. URL đến từ `img`, `source`, CSS image/background hoặc public SVG markup.
3. Request không có cookie, authorization header, session storage hoặc authenticated API.
4. Response thành công.
5. `Content-Type` phù hợp image.
6. Response không phải HTML/login/challenge.
7. URL không signed, session-bearing, chứa secret hoặc có expiry dependency.

Reject SVG có:

- `<script>`
- Event handlers
- `<foreignObject>`
- External executable/resource dependency
- Remote font/image dependency
- Obfuscated active content

### 11.4 Local storage và provenance

- Lưu file dưới `assets/user-info/`.
- HTML/CSS chỉ dùng đường dẫn local.
- Trong worker handoff ghi:
  - role;
  - source URL;
  - local filename;
  - `Content-Type`;
  - SHA-256 checksum;
  - reference viewport;
  - validation result.

### 11.5 Cấm và BLOCKED policy

Cấm:

- Hotlink.
- Crop screenshot.
- Trace/redraw brand icon.
- Emoji substitute.
- Generic icon thay branded asset khác rõ reference.
- Authenticated/signed asset URL.

Nếu exact asset không có:

`BLOCKED: ASSET_<ROLE>`

Không thay thế tùy tiện để né blocker.

---

## 12. Implementation phases

### Phase 1 — Authority inventory

- Trích XML class union.
- Suy ra modifier bases.
- Thiết lập utility allowlist.
- Lập current→target checklist.
- Lập desktop/mobile icon map.

### Phase 2 — BEM migration

- Rename nested element classes.
- Xóa unapproved state classes.
- Sửa cart/header account.
- Rename alert/info/address/password/linked/app-promo.
- Dùng unclassed semantic wrappers.

### Phase 3 — Overview topology

- Chuyển `.overview-card` thành `.member-overview__cards`.
- Đặt ba canonical blocks làm siblings.
- Giữ một outer surface và visible red separators.
- Child blocks transparent, không independent card style.

### Phase 4 — Account topology

- Thêm info field groups.
- Sửa sidebar divider.
- Giữ đúng một address header action.
- Sửa password body names.
- Chuyển linked accounts thành plain rows.
- QR unclassed; store badges dùng base + modifier.

### Phase 5 — Desktop correction

- Đo same-viewport shell.
- Chọn shell rules từ measurement.
- Hiệu chỉnh horizontal insets.
- Sửa actions thành borderless.
- Sửa overflow/alignment.
- Kiểm tra header/main shell riêng.

### Phase 6 — Mobile shell

- Thêm back/title “Tài khoản”/reference-supported actions.
- Thêm bottom nav với locked labels/order.
- Đặt item thứ tư current.
- Không duplicate account sections.

### Phase 7 — Mobile CSS

- Khởi đầu với ≤767px như provisional breakpoint.
- Chọn breakpoint cuối sau fit testing.
- Test cả hai phía.
- Hide desktop-only structures.
- Single-column content.
- Fixed nav + safe area.

### Phase 8 — Assets

- So sánh icon roles với desktop/mobile references.
- Validate public-static assets.
- Lưu local, tính SHA-256.
- Báo BLOCKED nếu thiếu exact asset.

### Phase 9 — Evidence

Worker cung cấp:

- BEM/static checks.
- Computed action styles.
- Overflow evidence.
- Asset provenance/checksums.
- Browser smoke evidence.

Final visual verification thuộc `ui-qa`.

---

## 13. Deterministic static checks

### 13.1 Class union

Extract mọi HTML class token và so sánh với:

- Desktop XML union.
- Mobile XML union.
- Inferred modifier bases.
- `.skip-link`
- `.sr-only`

Fail nếu có token khác.

### 13.2 BEM syntax

Fail nếu:

- Class chứa nhiều hơn một `__`.
- Modifier thiếu base.
- Còn class cũ:
  - `overview-card*`
  - `member-shortcut*`
  - `account-alert*`
  - `info-card__list`
  - `info-card__row*`
  - `account-sidebar__separator`
  - `linked-accounts__logo*`
  - `linked-accounts__name`
  - `linked-accounts__state`
  - `linked-accounts__action`
  - `password-card__label`
  - `password-card__value`
  - `account-nav-item--active`
  - `account-nav-item--button`
- Có `.active`, `.is-active` hoặc unapproved `--active`.

### 13.3 Topology

Fail nếu:

- `.member-overview__cards` không chứa ba sibling blocks.
- Overview có nhiều outer visual surfaces.
- `.header__account` còn trên `.member-card__avatar`.
- Cart nhận `--phone`.
- Có `.address-card__add-btn`.
- Linked accounts render linked boxes.
- QR wrapper có `.app-promo__badge`.
- Store modifier thiếu base.
- Content sections bị duplicate.
- Bottom nav không có đúng bốn item.
- Bottom-nav labels/order khác:
  1. Tổng quan
  2. Lịch sử
  3. Ưu đãi
  4. Tài khoản
- Item thứ tư thiếu `aria-current="page"`.
- Item 1–3 nhận `aria-current="page"`.

### 13.4 Semantic selectors

Fail nếu positional selector xác định:

- Provider identity.
- Linked state.
- Field meaning.
- Active navigation state.

Không fail vì structural authority class thiếu dedicated CSS.

### 13.5 Action computed styles

Ở rest:

- Borders 0.
- Background transparent.
- Shadow none.
- Không persistent outline.
- Pseudo-elements không paint.

Ở hover:

- Không filled/outlined/shadowed container.

Ở focus-visible:

- Có visible focus indicator.
- Không bị clip.

### 13.6 Assets

Fail nếu:

- Còn remote runtime asset URL.
- Added asset thiếu provenance/SHA-256.
- Content-Type không phải image.
- SVG có active/external executable content.
- Asset là crop/trace/emoji.
- Branded asset unavailable nhưng không báo BLOCKED.

### 13.7 Overflow

Ở mọi viewport:

- Không document horizontal overflow.
- Không row/action/icon vượt card bounds.
- Bottom nav không che content/focus.
- Overview children không tràn outer surface.

### 13.8 Privacy

Fail nếu source/evidence/screenshot chứa:

- PII không che.
- Cookie/token/session value.
- Authenticated API data.
- Signed/session-bearing URL.
- Live screenshot chứa account thật.

---

## 14. Browser verification matrix

### 14.1 Desktop

| Viewport | Kiểm tra |
|---|---|
| 1920×1080 | Shell edges/ratio; large gray gutters; một overview surface; red separators; transparent children. |
| 1440×900 | Responsive interpolation; header/main alignment riêng; không edge crowding. |
| 1280×800 | Không overflow; sidebar/content fit; tabs/header không collision. |

Shell tolerance:

- Same-viewport edges: tối đa 8px.
- Nếu chỉ một reference: width-ratio tolerance 0.5 percentage points.

### 14.2 Mobile

| Viewport | Kiểm tra |
|---|---|
| 360×800 | Header không collision; title “Tài khoản”; nav labels fit; không overflow. |
| 390×844 | Header, stack, password, action styles và fixed nav khớp verified state. |
| 430×932 | Vẫn mobile; inset nhất quán; nav không che content. |

Tại mọi mobile viewport, bottom nav phải hiển thị:

1. Tổng quan
2. Lịch sử
3. Ưu đãi
4. Tài khoản — current

### 14.3 Breakpoint boundary

Sau khi chọn `B`, test thêm:

- `B`
- `B + 1`

Kiểm tra visibility, duplication, focusability, collision và overflow.

---

## 15. Accessibility requirements

### Semantic HTML

- Một `<main id="main-content">`.
- Skip link hoạt động.
- Header/sidebar/bottom navigation có accessible name riêng.
- Info fields dùng `<dl>/<dt>/<dd>`.
- Linked providers dùng `<ul>/<li>`.
- State-changing actions dùng `<button>`.
- Navigation dùng `<a>`.
- Heading levels hợp lý.

### ARIA

- Back control có `aria-label`.
- Icon-only header actions có label riêng.
- Sidebar current item dùng `aria-current="page"`.
- Bottom-nav item “Tài khoản” dùng `aria-current="page"`.
- Ba bottom-nav item còn lại không có `aria-current="page"`.
- Decorative icons dùng `aria-hidden="true"`.
- Provider name tồn tại dạng text.
- Alert dùng semantic note phù hợp.

### Keyboard

- DOM/tab order trùng visual order.
- Bottom-nav keyboard order: Tổng quan→Lịch sử→Ưu đãi→Tài khoản.
- Không positive `tabindex`.
- Hidden controls không focusable.
- Hit target tối thiểu 44×44px hoặc equivalent unpainted area.
- Focus-visible không bị clip/che.

### Contrast

- Normal text ≥4.5:1.
- Large text ≥3:1.
- Focus/UI indicator ≥3:1.
- Active/current state không chỉ dựa vào màu.

---

## 16. Final compact binary acceptance checklist

### BEM và topology

- [ ] Mọi class thuộc XML union, inferred base, `.skip-link` hoặc `.sr-only`.
- [ ] Không có `block__element__child`; mọi modifier có base.
- [ ] Unrepresented semantic wrappers không class.
- [ ] Overview có một shared surface chứa ba canonical sibling blocks.
- [ ] Overview children transparent, không independent shadow/outer radius.
- [ ] Visible red separators khớp reference.
- [ ] Linked accounts dùng plain rows; không linked boxes.
- [ ] Cart vẫn là cart và không nhận `--phone`.
- [ ] `.header__account` không gắn overview avatar.
- [ ] Active sidebar/bottom-nav dùng `aria-current="page"`.
- [ ] QR wrapper unclassed; store badges có inferred base + modifier.

### Desktop

- [ ] Shell được đo với same-viewport original; không giả định hard max-width.
- [ ] Shell edges trong 8px hoặc width ratio trong 0.5 percentage points.
- [ ] Header inner và main shell được xác minh riêng.
- [ ] Overview chỉ có một white rounded/shadowed surface.
- [ ] Card content/actions/separators giữ horizontal inset.
- [ ] Update/add/change/link actions không có resting/hover box.
- [ ] Có đúng một header “Thêm địa chỉ” action.
- [ ] Không horizontal overflow tại 1920, 1440 và 1280.

### Mobile

- [ ] Tại 390×844, header, stack, password và fixed nav khớp reference.
- [ ] Mobile title là “Tài khoản”.
- [ ] Header actions lấy từ visible evidence.
- [ ] Content sections không duplicate.
- [ ] Desktop overview/tabs/sidebar/app promo hidden và không focusable.
- [ ] Bottom nav có đúng bốn item.
- [ ] Labels/order chính xác: Tổng quan→Lịch sử→Ưu đãi→Tài khoản.
- [ ] Item thứ tư “Tài khoản” có `aria-current="page"`.
- [ ] Items 1–3 không có `aria-current="page"`.
- [ ] Bottom nav không che content hoặc keyboard focus.
- [ ] 360, 390 và 430 không horizontal overflow.
- [ ] 430px vẫn dùng mobile layout.
- [ ] Breakpoint cuối được ghi là implementation decision.
- [ ] Cả hai phía breakpoint được kiểm tra.

### Actions, assets, accessibility và privacy

- [ ] Resting action styles có border 0, transparent background và no shadow.
- [ ] Action pseudo-elements không paint.
- [ ] Hover không tạo filled/outlined container.
- [ ] Mobile alert padding 8×16; mobile password padding 0.
- [ ] Focus-visible hiện diện, không persistent wrapper.
- [ ] Pseudo hit area không paint hoặc overlap.
- [ ] Mọi desktop/mobile icon role được map với reference.
- [ ] Added assets là unauthenticated public static files, local và có SHA-256 provenance.
- [ ] Missing exact branded asset được báo BLOCKED.
- [ ] Không PII, credential, token, hotlink, crop, trace hoặc emoji substitute.
- [ ] Semantic HTML, ARIA, keyboard navigation và contrast đạt yêu cầu.

---

## 17. Approved facts

- Current clone chưa có mobile layout thực.
- Current shell quá rộng; shell cuối phải được đo, không đoán.
- Desktop overview là một shared white rounded surface có visible red separators.
- `.member-card`, `.stat-card`, `.brand-switch` là sibling regions trong surface đó.
- Desktop update/add/change/link actions là inline, không outlined wrappers.
- Card content có horizontal inset.
- Cart vẫn là cart dù XML có `--phone`.
- Approved address state có đúng một header add action.
- Linked accounts là plain rows trên desktop và mobile.
- Mobile title là “Tài khoản”.
- Mobile content order là alert→info→address→password→linked accounts.
- Mobile có fixed bottom nav đúng bốn item.
- Bottom-nav labels/order đã khóa:
  1. Tổng quan
  2. Lịch sử
  3. Ưu đãi
  4. Tài khoản
- Bottom-nav item thứ tư “Tài khoản” là current với `aria-current="page"`.
- Mobile alert action có border 0, transparent background, padding 8×16.
- Mobile password action có border 0, transparent background, padding 0.
- Password tồn tại trên mobile dù Mobile XML bỏ sót.
- Strict XML union khả thi bằng unclassed semantic wrappers.
- Structural authority classes không bắt buộc có dedicated CSS declaration.

---

## 18. Open questions và blockers

Chỉ còn các điểm evidence-dependent sau:

1. Chính xác shell width/ratio và header/main alignment ở từng desktop reference.
2. Chính xác mobile header action controls.
3. Icon của từng bottom-nav item:
   - Tổng quan
   - Lịch sử
   - Ưu đãi
   - Tài khoản, gồm active treatment
4. Destination/href của từng bottom-nav item.
5. Desktop header có visible account control riêng hay không.
6. Các optional XML parts có visible trong original hay không:
   - `.stat-card__item-bar`
   - `.stat-card__item-sub`
   - `.stat-card__footer-icon`
7. Icon candidates hiện tại có match desktop/mobile originals hay cần public static replacement.
8. Breakpoint cuối sau content-fit testing; ≤767px chỉ là provisional starting point.

Potential blockers:

- `BLOCKED: ASSET_MOBILE_BACK`
- `BLOCKED: ASSET_MOBILE_HEADER_ACTION_<ROLE>`
- `BLOCKED: ASSET_BOTTOM_NAV_TONG_QUAN`
- `BLOCKED: ASSET_BOTTOM_NAV_LICH_SU`
- `BLOCKED: ASSET_BOTTOM_NAV_UU_DAI`
- `BLOCKED: ASSET_BOTTOM_NAV_TAI_KHOAN`
- `BLOCKED: DESTINATION_BOTTOM_NAV_<ROLE>`
- `BLOCKED: ASSET_HEADER_ACCOUNT`
- `BLOCKED: REFERENCE_SHELL_MEASUREMENT`

Bottom-nav labels, order và active item **không còn là open question**. Chỉ icon và destination có thể phụ thuộc thêm evidence.
