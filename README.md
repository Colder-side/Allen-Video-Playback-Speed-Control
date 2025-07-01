# Allen Auto Video Speed 2x [Project Made Entirely Using Gemini 2.5]

A Chrome extension that automatically sets Allen.in videos to 2x speed and adds a floating toggle button to control it. Meant to save time and sanity when watching lectures.

---

## What it does

- Forces video playback to 2x speed (default is 2.5x — changeable).
- Adds a toggle button on the right side of the page.
- Keeps resetting the speed if the site or video tries to override it.
- Cleans up everything on page unload.

---

## ⚠️ Important Note (Read This)

**There’s a known issue:**  
When the page first loads, the extension immediately applies the speed — and **this sometimes crashes or freezes the video player** on Allen's site.

### Fix:
- As soon as the video page loads, **click the "2x Speed ON" button to turn it OFF** before starting the video.
- If you're skipping through the video, **turn it OFF first**, skip to where you want, then turn it back ON.

This prevents most crashes and weird behavior.

---

## How to install

1. Download or clone this repo.
2. Go to `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the folder.
5. Visit an Allen video — the toggle should appear.

---

## Files

- `content.js`: Main script handling speed and toggle logic.
- `manifest.json`: Chrome extension config.
- `icons/`: Optional icons (not essential for it to work).

---

## Customization

Change the playback speed by editing this line in `content.js`:
```js
const targetSpeed = 2.5;
