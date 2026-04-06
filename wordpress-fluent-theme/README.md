# WordPress Fluent Theme

A WordPress **child theme** for [Argon Theme](https://github.com/solstice23/argon-theme) that layers
[Fluent Design System](https://fluent2.microsoft.design/) visual language on top of Argon's clean blog layout.

---

## Features

| Feature | Details |
|---|---|
| **Fluent design tokens** | Full CSS custom property suite — typography, color, surfaces, radii, shadows, spacing, z-index, transitions |
| **Text style utilities** | `.fluent-text--display` through `.fluent-text--caption` + color modifiers |
| **Button variants** | Primary, subtle, outline, transparent, danger, success, compound, icon-only, sm/lg sizes |
| **Drawer component** | Spec-aligned `<fluent-drawer>` WC support + `<dialog>` native fallback; position `start`/`end`, sizes `small`/`medium`/`large`/`full`, `modal`/`non-modal`/`inline` types |
| **Fluent UI Web Components** | Loaded via CDN — `<fluent-button>`, `<fluent-card>`, `<fluent-text-input>` etc. in any template |
| **Alert banners** | Info, success, warning, danger strips |
| **Badge / chip** | Inline status labels |
| **Card component** | Standalone Fluent card with media, body, footer |
| **Dark mode** | Automatic (`html.darkmode` class from Argon + `prefers-color-scheme`) |
| **Accessibility** | Focus-visible ring, ARIA attributes on drawers, keyboard trap + Escape to close, focus restoration |
| **Non-destructive** | Parent Argon theme is never modified |

---

## Requirements

| Software | Minimum version |
|---|---|
| WordPress | 6.0+ |
| PHP | 7.4+ |
| Argon Theme (parent) | latest from GitHub |

---

## Installation

### Step 1 — Install the parent Argon theme

1. Download the Argon theme ZIP from <https://github.com/solstice23/argon-theme/releases>
2. WP Admin → **Appearance → Themes → Add New → Upload Theme**
3. Upload and click **Install Now**

### Step 2 — Install this child theme

**Option A — WP Admin upload**

```bash
zip -r wordpress-fluent-theme.zip wordpress-fluent-theme/
```
Then WP Admin → **Appearance → Themes → Add New → Upload Theme**.

**Option B — FTP / SSH**

Copy `wordpress-fluent-theme/` to `/wp-content/themes/` on your server.

### Step 3 — Activate

WP Admin → **Appearance → Themes** → activate **WordPress Fluent Theme**.

---

## Customisation

### Change accent colour

```css
/* In style.css :root, or in the WP Customizer → Additional CSS */
:root {
  --fluent-accent: #107c10; /* Microsoft Green */
}
```

### Change font

```css
:root {
  --fluent-font: "Noto Sans", "Roboto", system-ui, sans-serif;
}
```

---

## Components

### Buttons

```html
<!-- Primary (accent fill) -->
<button class="fluent-btn fluent-btn--primary">Save changes</button>

<!-- Subtle (tinted low-emphasis) -->
<button class="fluent-btn fluent-btn--subtle">View details</button>

<!-- Outline (ghost / secondary) -->
<button class="fluent-btn fluent-btn--outline">Cancel</button>

<!-- Danger (destructive) -->
<button class="fluent-btn fluent-btn--danger">Delete post</button>

<!-- Success (confirmation) -->
<button class="fluent-btn fluent-btn--success">Publish</button>

<!-- Compound (title + description) -->
<button class="fluent-btn fluent-btn--compound fluent-btn--primary">
  <span class="fluent-btn__title">Open settings</span>
  <span class="fluent-btn__desc">Manage your account</span>
</button>

<!-- Icon-only -->
<button class="fluent-btn fluent-btn--icon" aria-label="Close">&#x2715;</button>

<!-- Size modifiers -->
<button class="fluent-btn fluent-btn--primary fluent-btn--sm">Small</button>
<button class="fluent-btn fluent-btn--primary fluent-btn--lg">Large</button>

<!-- Fluent UI Web Components equivalents (CDN) -->
<fluent-button appearance="accent">Primary</fluent-button>
<fluent-button appearance="subtle">Subtle</fluent-button>
<fluent-button appearance="outline">Outline</fluent-button>
```

### Text styles

```html
<p   class="fluent-text--display">Hero display heading</p>
<h1  class="fluent-text--title-lg">Large title</h1>
<h2  class="fluent-text--title">Title</h2>
<h3  class="fluent-text--subtitle">Subtitle</h3>
<p   class="fluent-text--body-strong">Strong body text</p>
<p   class="fluent-text--body">Regular body text</p>
<p   class="fluent-text--body-sm">Small body text</p>
<span class="fluent-text--caption">Caption / meta</span>
<span class="fluent-text--overline">OVERLINE LABEL</span>

<!-- Color modifiers (mix with any text class) -->
<p class="fluent-text--subtitle fluent-text--accent">Accent-colored subtitle</p>
<p class="fluent-text--caption  fluent-text--danger">Error caption</p>
```

---

## Drawer

The drawer is a slide-in panel component aligned with the official
[Fluent UI Web Components drawer spec](https://github.com/microsoft/fluentui/tree/master/packages/web-components/src/drawer).

### Attributes

| Attribute | Values | Default |
|---|---|---|
| `type` | `modal` · `non-modal` · `inline` | `modal` |
| `position` | `start` (left in LTR) · `end` (right) | `start` |
| `size` | `small` (320 px) · `medium` (592 px) · `large` (940 px) · `full` | `medium` |
| `aria-labelledby` | ID of heading element | — |
| `aria-describedby` | ID of description element | — |

### JS trigger attributes (any clickable element)

| Attribute | Effect |
|---|---|
| `data-fluent-drawer-toggle="id"` | Open **or** close the drawer |
| `data-fluent-drawer-close="id"` | Close the drawer |

### JS API

```js
FluentDrawer.show('drawer-id');
FluentDrawer.hide('drawer-id');
FluentDrawer.toggle('drawer-id');
FluentDrawer.closeAll();
```

### Events (dispatched on the drawer element)

| Event | Fires |
|---|---|
| `beforetoggle` | Before state changes; `event.detail = { newState, oldState }` |
| `toggle` | After state changes; `event.detail = { newState, oldState }` |

---

### Approach A — `<fluent-drawer>` Web Component *(recommended)*

Uses the official Fluent UI v3 custom element (loaded via CDN).
The component manages its own `<dialog>` internally; `fluent-drawer.js`
adds the `data-*` trigger support on top.

```html
<!-- Trigger -->
<button class="fluent-btn fluent-btn--primary"
        data-fluent-drawer-toggle="nav-drawer">Open navigation</button>

<!-- Left-side modal drawer (position="start" is the default) -->
<fluent-drawer id="nav-drawer"
               type="modal"
               position="start"
               size="medium"
               aria-labelledby="nav-drawer-title">
  <drawer-body>
    <h2 id="nav-drawer-title" slot="title">Navigation</h2>

    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>

    <div slot="footer">
      <fluent-button appearance="outline"
                     data-fluent-drawer-close="nav-drawer">Close</fluent-button>
    </div>
  </drawer-body>
</fluent-drawer>
```

```html
<!-- Right-side settings drawer -->
<fluent-drawer id="settings-drawer"
               type="modal"
               position="end"
               size="medium"
               aria-labelledby="settings-title">
  <drawer-body>
    <h2 id="settings-title" slot="title">Settings</h2>
    <p>Settings content here.</p>
    <div slot="footer">
      <fluent-button appearance="accent"
                     data-fluent-drawer-close="settings-drawer">Save</fluent-button>
      <fluent-button appearance="outline"
                     data-fluent-drawer-close="settings-drawer">Cancel</fluent-button>
    </div>
  </drawer-body>
</fluent-drawer>
```

```html
<!-- Non-modal inline drawer (no backdrop, stays alongside content) -->
<fluent-drawer id="sidebar-drawer"
               type="non-modal"
               position="start"
               size="small"
               aria-label="Sidebar">
  <drawer-body>
    <h2 slot="title">Sidebar</h2>
    <p>Always-visible supplementary content.</p>
  </drawer-body>
</fluent-drawer>
```

Override the width with the `--drawer-width` CSS variable:

```css
#my-wide-drawer { --drawer-width: 720px; }
```

---

### Approach B — `<dialog class="fluent-drawer-dialog">` native fallback

Use this when the Fluent UI CDN is unavailable or when you want
full control over the markup without a custom element.
`fluent-drawer.js` calls `showModal()` / `close()` on the `<dialog>`.

```html
<!-- Trigger -->
<button class="fluent-btn fluent-btn--primary"
        data-fluent-drawer-toggle="nav-dialog">Open navigation</button>

<!-- Left-side modal drawer -->
<dialog class="fluent-drawer-dialog"
        id="nav-dialog"
        data-position="start"
        data-size="medium"
        aria-labelledby="nav-dialog-title">
  <div class="fluent-drawer-body">

    <div class="fluent-drawer-body__header">
      <h2 id="nav-dialog-title" class="fluent-text--subtitle">Navigation</h2>
      <button class="fluent-btn fluent-btn--icon"
              data-fluent-drawer-close="nav-dialog"
              aria-label="Close drawer">&#x2715;</button>
    </div>

    <div class="fluent-drawer-body__content">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </nav>
    </div>

    <div class="fluent-drawer-body__footer">
      <button class="fluent-btn fluent-btn--outline"
              data-fluent-drawer-close="nav-dialog">Close</button>
    </div>

  </div>
</dialog>
```

```html
<!-- Right-side drawer (data-position="end") -->
<dialog class="fluent-drawer-dialog"
        id="settings-dialog"
        data-position="end"
        data-size="medium"
        aria-labelledby="settings-dialog-title">
  <div class="fluent-drawer-body">
    <div class="fluent-drawer-body__header">
      <h2 id="settings-dialog-title" class="fluent-text--subtitle">Settings</h2>
      <button class="fluent-btn fluent-btn--icon"
              data-fluent-drawer-close="settings-dialog"
              aria-label="Close">&#x2715;</button>
    </div>
    <div class="fluent-drawer-body__content">
      <p>Settings content here.</p>
    </div>
    <div class="fluent-drawer-body__footer">
      <button class="fluent-btn fluent-btn--primary"
              data-fluent-drawer-close="settings-dialog">Save</button>
      <button class="fluent-btn fluent-btn--outline"
              data-fluent-drawer-close="settings-dialog">Cancel</button>
    </div>
  </div>
</dialog>
```

---

## File structure

```
wordpress-fluent-theme/
├── style.css          ← Child theme header + all Fluent CSS
│                        (tokens, typography, buttons, drawer, utilities)
├── functions.php      ← Enqueues parent CSS, Fluent WC CDN, fluent-drawer.js
├── fluent-drawer.js   ← Drawer open/close/toggle helper (vanilla JS)
└── README.md          ← This file
```

---

## Licence

GPL-2.0-or-later — same as WordPress and the parent Argon theme.  
See [LICENSE](../LICENSE) at the repository root.
