# SMEMBER Login Page — Spec

> URL: `https://smember.com.vn/login` · v1.0 · 2026-08-22

---

## 01. Overview

| Thuộc tính | Giá trị |
|-----------|---------|
| URL | `https://smember.com.vn/login` |
| Block gốc | `.login` |
| Mục đích | Trang đăng nhập hệ thống loyalty SMEMBER (CellphoneS + Điện thoại vui). Vừa authenticate vừa promote benefits để tăng đăng ký mới. |
| Tech stack | HTML5 + CSS3 thuần (BEM), không framework |

---

## 02. Layout Architecture

### Desktop ≥ 1024px — CSS Grid 2 cột

```
┌────────────────────────────────────────────────────────┐
│  .login  (100vw × 100vh, grid 2 cols)                  │
│                                                        │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │  .login__promo   │  │  .login__form-panel         │ │
│  │  (44% width)     │  │  (56% width)                │ │
│  │                  │  │                             │ │
│  │  logos           │  │  .login__form               │ │
│  │  heading         │  │    title                    │ │
│  │  benefits list   │  │    fields (phone + pass)    │ │
│  │  cta             │  │    submit + forgot          │ │
│  │  illustration    │  │    divider                  │ │
│  │                  │  │    social (google + zalo)   │ │
│  │                  │  │    register link            │ │
│  │                  │  │    footer links             │ │
│  └──────────────────┘  └─────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Mobile < 768px — Stack dọc 1 cột

```
┌────────────────────────┐
│  .login__promo         │
│  (100% width)          │
│                        │
│  logos                 │
│  heading               │
│  benefits              │
│  illustration          │
│                        │
│  (form ẩn — mở qua     │
│   CTA bar bên dưới)    │
│                        │
├────────────────────────┤
│  .login__cta-bar       │  ← sticky bottom
│  [Đăng ký] [Đăng nhập] │
└────────────────────────┘
```

> **Mobile UX note:** Trên mobile form không hiện ngay. Nhấn "Đăng nhập" → slide-up panel hoặc navigate sang trang form riêng.

---

## 03. BEM Component Tree

### Desktop

```
.login                              /* root block, full screen */
├── .login__promo                   /* left panel 44% */
│   ├── .login__promo-header
│   │   ├── .login__promo-logos
│   │   │   ├── .login__promo-logo--cellphones
│   │   │   └── .login__promo-logo--dtv
│   │   └── .login__promo-heading
│   │       ├── .login__promo-heading-title
│   │       │   └── .login__promo-heading-highlight   /* <span> */
│   │       └── .login__promo-heading-sub
│   └── .login__promo-body
│       ├── .login__promo-benefits
│       │   ├── .login__promo-benefits-corner          /* ×4, decorative */
│       │   ├── .login__promo-benefits-list
│       │   │   └── .login__promo-benefits-items       /* ×7 */
│       │   │       ├── .login__promo-benefit-item-icon
│       │   │       └── .login__promo-benefit-item-text
│       │   └── .login__promo-benefits-cta
│       │       ├── .login__promo-benefits-cta-label
│       │       └── .login__promo-benefits-cta-icon
│       └── .login__promo-illustration
│
└── .login__form-panel              /* right panel 56% */
    └── .login__form
        ├── .login__form-title
        ├── .login__form-fields
        │   ├── .login__form-field                     /* phone */
        │   │   ├── .login__form-field-label
        │   │   └── .login__form-field-input
        │   └── .login__form-field                     /* password */
        │       ├── .login__form-field-label
        │       ├── .login__form-field-input
        │       └── .login__form-field-toggle           /* eye icon */
        ├── .login__form-submit
        │   ├── .login__form-btn--login
        │   └── .login__form-forgot
        ├── .login__form-divider
        │   └── .login__form-divider-text
        ├── .login__form-social
        │   ├── .login__form-social-item--google
        │   │   ├── .login__form-social-item-icon
        │   │   └── .login__form-social-item-label
        │   └── .login__form-social-item--zalo
        │       ├── .login__form-social-item-icon
        │       └── .login__form-social-item-label
        ├── .login__form-register
        │   ├── .login__form-register-text
        │   └── .login__form-register-link
        └── .login__form-footer
            └── .login__form-footer-content
                ├── .login__form-footer-link            /* Điều khoản */
                └── .login__form-footer-link            /* Bảo mật */
```

### Mobile (khác so với Desktop)

```
.login
├── .login__promo                   /* 100% width, flex-grow:1 */
│   └── (cấu trúc giống Desktop)
└── .login__cta-bar                 /* sticky bottom, height 80px */
    ├── .login__cta-bar-btn--register
    └── .login__cta-bar-btn--login
```

---

## 04. Content Spec

### Promo Panel

| BEM Class | Tag | Nội dung | Ghi chú |
|-----------|-----|---------|---------|
| `.login__promo-logo--cellphones` | `<img>` | `cellphones-long-icon.6a80e2a6.svg` | alt="CellphoneS" |
| `.login__promo-logo--dtv` | `<img>` | `dtv-long-icon.40a11e1d.svg` | alt="Điện thoại vui" |
| `.login__promo-heading-title` | `<h1>` | Nhập hội khách hàng thành viên **SMEMBER** | SMEMBER wrap bằng `.heading-highlight` |
| `.login__promo-heading-highlight` | `<span>` | SMEMBER | color accent đỏ, font-weight 800 |
| `.login__promo-heading-sub` | `<p>` | Tri ân khách hàng thân thiết — tích điểm đổi quà | opacity .8, font nhỏ hơn |
| `.login__promo-benefit-item-text` | `<span>` | 1. Tích điểm mỗi lần mua hàng | ×7 items, mỗi item có icon |
| | | 2. Ưu đãi sinh nhật đặc biệt | |
| | | 3. Quà tặng hội viên hàng tháng | |
| | | 4. Giảm giá độc quyền thành viên | |
| | | 5. Bảo hành ưu tiên | |
| | | 6. Đổi điểm lấy phần quà hấp dẫn | |
| | | 7. Thông báo flash sale sớm nhất | |
| `.login__promo-benefits-cta-label` | `<span>` | Tải app SMEMBER ngay | link to app store |
| `.login__promo-illustration` | `<img>` | `smember-promotion-ant.a7833c47.png` | alt="SMEMBER mascot", position absolute bottom-right |

### Form Panel

| BEM Class | Tag | Nội dung / Attribute | Ghi chú |
|-----------|-----|---------------------|---------|
| `.login__form-title` | `<h2>` | Đăng nhập SMEMBER | font-size 26px, weight 700 |
| `.login__form-field-label` | `<label>` | Số điện thoại | for="phone" |
| `.login__form-field-input` | `<input>` | type="tel" placeholder="Nhập số điện thoại" | autocomplete="tel" |
| `.login__form-field-label` | `<label>` | Mật khẩu | for="password" |
| `.login__form-field-input` | `<input>` | type="password" placeholder="Nhập mật khẩu" | autocomplete="current-password" |
| `.login__form-field-toggle` | `<button>` | SVG eye / eye-off icon | type="button", aria-label="Hiện/ẩn mật khẩu" |
| `.login__form-btn--login` | `<button>` | Đăng nhập | type="submit", width 100%, bg đỏ |
| `.login__form-forgot` | `<a>` | Quên mật khẩu? | href="/forgot-password" |
| `.login__form-divider-text` | `<span>` | hoặc đăng nhập với | giữa 2 đường kẻ ngang |
| `.login__form-social-item--google` | `<button>` | logo-google.svg + "Đăng nhập với Google" | border 1px, bg white |
| `.login__form-social-item--zalo` | `<button>` | logo-zalo.svg + "Đăng nhập với Zalo" | border 1px, bg white |
| `.login__form-register-text` | `<span>` | Bạn chưa có tài khoản? | color muted |
| `.login__form-register-link` | `<a>` | Đăng ký ngay | color đỏ, font-weight 600 |
| `.login__form-footer-link` | `<a>` | Điều khoản sử dụng | font-size 12px, color muted |
| `.login__form-footer-link` | `<a>` | Chính sách bảo mật | font-size 12px, color muted |

### Mobile CTA Bar

| BEM Class | Tag | Nội dung | Style |
|-----------|-----|---------|-------|
| `.login__cta-bar-btn--register` | `<a>` | Đăng ký | Outlined — border đỏ, text đỏ, bg transparent |
| `.login__cta-bar-btn--login` | `<a>` | Đăng nhập | Filled — bg đỏ, text trắng |

---

## 05. Visual Assets

Tất cả file trong: `D:\SET\cellphones\docs\designs\CellphoneS - ..._files\`

| File | Loại | Kích thước | Dùng ở đâu |
|------|------|-----------|-----------|
| `cellphones-long-icon.6a80e2a6.svg` | SVG | 7 KB | `.login__promo-logo--cellphones` |
| `dtv-long-icon.40a11e1d.svg` | SVG | 3.5 KB | `.login__promo-logo--dtv` |
| `promotion-smember.088823eb.png` | PNG | 195 KB | Background pattern promo panel |
| `smember-promotion-ant.a7833c47.png` | PNG | 133 KB | `.login__promo-illustration` |
| `logo-google.b6f9570f.svg` | SVG | 1.1 KB | `.login__form-social-item--google` |
| `logo-zalo.120d889f.svg` | SVG | 6.4 KB | `.login__form-social-item--zalo` |
| `favicon.ico` | ICO | 4.2 KB | `<link rel="icon">` trong `<head>` |

---

## 06. Interaction States

| State | Element | CSS / Behavior |
|-------|---------|---------------|
| **Default** | Input | border: 1px solid #E5E7EB |
| **Focus** | Input | border-color: #E83D3D; box-shadow: 0 0 0 3px rgba(232,61,61,.15) |
| **Error** | Input | border-color: #EF4444; hiện error message 12px bên dưới |
| **Valid** | Input | border-color: #10B981 |
| **Hover** | `.login__form-btn--login` | background: #C43232; transition: 150ms ease |
| **Loading** | `.login__form-btn--login` | opacity: .7; disabled; spinner; text "Đang đăng nhập…" |
| **Toggle** | `.login__form-field-toggle` | Click đổi type password ↔ text; icon eye ↔ eye-off |
| **Hover** | Social buttons | background: #F5F5F5; border-color: #CBD5E1 |
| **Focus visible** | Tất cả interactive | outline: 2px solid #E83D3D; outline-offset: 2px |

---

## 07. Design Tokens

### Colors

```css
--color-accent:           #E83D3D;
--color-accent-dark:      #C43232;   /* hover state */
--color-accent-soft:      #FDF0F0;   /* tinted background */
--color-text:             #1C1917;
--color-text-muted:       #57534E;
--color-text-placeholder: #A8A29E;
--color-border:           #E5E7EB;
--color-surface:          #FFFFFF;
```

### Typography

```css
--font-heading:    'Be Vietnam Pro', sans-serif;
--font-body:       'Inter', sans-serif;

--font-size-title: 26px;   font-weight: 700;
--font-size-label: 14px;   font-weight: 600;
--font-size-input: 15px;   font-weight: 400;
--font-size-btn:   15px;   font-weight: 600;
--font-size-small: 12px;   font-weight: 400;

--line-height-body: 1.6;
```

### Spacing & Sizing

```css
--input-height:    48px;
--button-height:   48px;
--radius-input:    8px;
--radius-button:   8px;
--form-gap:        20px;
--form-padding:    48px;
--cta-bar-height:  80px;   /* mobile */
```

### Shadows & Transitions

```css
--shadow-form:        0 4px 24px rgba(0,0,0,.08);
--shadow-input-focus: 0 0 0 3px rgba(232,61,61,.15);
--transition-base:    150ms ease;
--transition-slow:    300ms ease;
```

---

## 08. Breakpoints

| Breakpoint | Width | Layout | Thay đổi |
|-----------|-------|--------|---------|
| Desktop | ≥ 1024px | Grid 2 cột | Mặc định. Promo 44% + Form 56% |
| Tablet | 768–1023px | Grid 2 cột thu nhỏ | Promo 40%, ẩn benefits list, giữ heading + illustration |
| Mobile L | 480–767px | Stack 1 cột | Ẩn `.login__form-panel`, hiện `.login__cta-bar` sticky bottom |
| Mobile S | ≤ 479px | Stack 1 cột | Font promo heading → 20px, illustration nhỏ lại |

> **Touch targets:** Tất cả button/link/toggle tối thiểu 44×44px. Input height 48px. CTA bar dùng `padding-bottom: env(safe-area-inset-bottom)` cho iPhone.

---

*SMEMBER Login Spec · smember.com.vn/login · Block: `.login`*
