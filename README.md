# linkedin-antiprom

Lightweight Chrome/Chromium extension that hides promoted posts from the LinkedIn feed.

## Quick install (for developers)

1. Install dependencies:

```bash
npm install
```

2. Build the extension bundle (outputs go to `dist/`):

```bash
npm run build
```

3. Load the extension in Chrome/Edge/Brave:

- Open `chrome://extensions`
- Enable **Developer mode**
- Click **Load unpacked** and select the `dist` directory created by the build

After loading, visit `https://www.linkedin.com/feed/` — promoted posts should be hidden.

## Notes

- The build produces `dist/index.global.js` (the bundled content script) and copies `manifest.json` into `dist/` so the folder can be loaded as an unpacked extension.
- The extension looks for the text "promoted" (case-insensitive) to detect promoted posts. It may need updates for localization or structural changes to LinkedIn's markup.
