# WordPress Fluent Theme

A WordPress **child theme** for [Argon Theme](https://github.com/solstice23/argon-theme) that layers
[Fluent Design System](https://fluent2.microsoft.design/) visual language on top of Argon's clean blog layout.

## Features

- **Fluent Design tokens** — Segoe UI typography, layered surfaces, soft radii, depth shadows, accent colour, and dark-mode variants — all defined as CSS custom properties so you can override them with one line.
- **Automatic dark mode** — mirrors Argon's `html.darkmode` class; no extra code needed.
- **Fluent UI Web Components** — loaded via CDN (no npm build step required), enabling `<fluent-button>`, `<fluent-card>`, `<fluent-text-input>` etc. in any template or widget.
- **Polished UI elements** — post cards, titles, meta, excerpts, buttons, forms, tags, navigation, pagination, comments, code blocks, and scrollbars all follow Fluent Design guidelines.
- **Non-destructive** — the parent Argon theme is never modified; deactivating this child theme restores Argon's default look instantly.

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

1. Download the Argon theme ZIP from  
   <https://github.com/solstice23/argon-theme/releases>
2. In WP Admin, go to **Appearance → Themes → Add New → Upload Theme**.
3. Upload the ZIP and click **Install Now**.
4. Do **not** activate it yet (or activate it briefly to confirm it works).

### Step 2 — Install this child theme

**Option A — upload via WP Admin (easiest)**

1. Zip the `wordpress-fluent-theme/` folder:
   ```bash
   zip -r wordpress-fluent-theme.zip wordpress-fluent-theme/
   ```
2. In WP Admin → **Appearance → Themes → Add New → Upload Theme**, upload `wordpress-fluent-theme.zip`.

**Option B — copy via FTP / SSH**

Copy the entire `wordpress-fluent-theme/` folder to `/wp-content/themes/` on your server.

### Step 3 — Activate

In WP Admin → **Appearance → Themes**, find **WordPress Fluent Theme** and click **Activate**.

---

## Customisation

### Change accent colour

Open `style.css` and update `--fluent-accent` inside `:root`:

```css
:root {
  --fluent-accent: #107c10; /* Microsoft Green, for example */
}
```

All buttons, links, tags, and focus indicators will update automatically.

### Change font

```css
:root {
  --fluent-font: "Noto Sans", "Roboto", system-ui, sans-serif;
}
```

### Use Fluent Web Components in templates / widgets

Because `functions.php` loads the Fluent UI Web Components bundle, you can use
custom elements anywhere in your theme templates or Text/HTML widgets:

```html
<!-- Primary accent button -->
<fluent-button appearance="accent">Read more</fluent-button>

<!-- Ghost / outline button -->
<fluent-button appearance="outline">See all posts</fluent-button>

<!-- Text input -->
<fluent-text-input placeholder="Search…"></fluent-text-input>
```

See the full component catalogue and source at  
<https://github.com/microsoft/fluentui/tree/master/packages/web-components>

### Upgrade Fluent UI Web Components

The CDN URL in `functions.php` is pinned to major version `3`.  
To pin to an exact version (recommended for production), edit the script URL:

```php
'https://cdn.jsdelivr.net/npm/@fluentui/web-components@3.0.0-rc.10/dist/web-components.min.js',
```

Check the latest release at  
<https://github.com/microsoft/fluentui/releases?q=%40fluentui%2Fweb-components>

---

## File structure

```
wordpress-fluent-theme/
├── style.css        ← Child theme headers + all Fluent Design CSS overrides
├── functions.php    ← Enqueues parent styles and Fluent Web Components CDN
└── README.md        ← This file
```

---

## Licence

GPL-2.0-or-later — same as WordPress and the parent Argon theme.  
See [LICENSE](../LICENSE) at the repository root.
