# EvoNext Platform

Platform library for EvoNext, providing shared types, utilities, and services for Dash Platform integration.


## Installation

TBD...


## Usage

```html
<!-- Production (default) ⭐ -->
<script src="https://unpkg.com/@evonext/platform/dist/evonext-platform.min.js"></script>
<script>window.EvoNext.getIdentityBalance()</script>

<!-- ESM (module for modern bundlers) -->
<script type="module">
  import { getIdentityBalance } from 'https://unpkg.com/@evonext/platform/dist/evonext-platform.min.mjs'
</script>

<!-- For Development Purposes ONLY -->
<script src="https://unpkg.com/@evonext/platform/dist/index.js"></script>
```

### Working Example

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Dev (unminified, larger) -->
  <script src="https://unpkg.com/@evonext/platform/dist/index.js"></script>

  <!-- OR Production (minified, fast) ⭐ -->
  <!-- <script src="https://unpkg.com/@evonext/platform/dist/evonext-platform.min.js"></script> -->
</head>
<body>
  <script>
    // Both work identically:
    window.EvoNext.getIdentityBalance('v24uWwdXJ1fJx7YccBmVB48zXPVT5uRYv7vKr5LS5B5')
      .then(balance => console.log('Balance:', balance))
  </script>
</body>
</html>
```
