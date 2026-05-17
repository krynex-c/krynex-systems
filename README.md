# Krynex Systems — Website

Premium operational systems and automation infrastructure marketing site.
Single-page static site. No build step. No dependencies.

## File structure

```
krynex-systems/
├── index.html      ← the page markup
├── style.css       ← all styles
├── script.js       ← scroll reveals, demo player, contact form
└── README.md       ← this file (optional, do not need to upload to host)
```

That's it. Three files. Everything else (Google Fonts, the favicon SVG) is loaded inline or from a CDN.

## Run it locally

Just open `index.html` in a browser. Or, for cleaner local testing with `fetch()` (used by the contact form), serve the folder with any static server:

```bash
# Python 3
python3 -m http.server 5500

# or Node
npx serve .
```

Then open `http://localhost:5500`.

## Contact form — Web3Forms setup

The contact form is wired to [Web3Forms](https://web3forms.com) (free, no account needed). You just need an access key.

**Step 1 — Get your access key**

1. Go to https://web3forms.com
2. Enter the email address where you want submissions delivered (e.g. `hello@krynex.systems`)
3. Click "Create Access Key"
4. Copy the access key emailed to you

**Step 2 — Paste the key into `index.html`**

Open `index.html` and find this line (inside the `<form id="contact-form">` element, around the middle of the file):

```html
<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY_HERE" />
```

Replace `YOUR_WEB3FORMS_ACCESS_KEY_HERE` with the key you received. That's it.

The key is safe to put in client-side HTML — Web3Forms is designed for this. They rate-limit and spam-filter on their end.

**Step 3 — Test it**

Submit the form locally or after deploying. You should see the success state, and an email should arrive at the address you registered.

## Deploy to Vercel

**Option A — GitHub + Vercel (recommended)**

1. Create a new repo on GitHub (e.g. `krynex-systems-site`)
2. Upload these three files to the root of the repo:
   - `index.html`
   - `style.css`
   - `script.js`
3. Go to https://vercel.com and sign in
4. Click **Add New → Project**
5. Import the GitHub repo
6. Leave all build settings on default (Vercel auto-detects a static site)
7. Click **Deploy**

Done. Vercel will give you a `*.vercel.app` URL within ~30 seconds.

**Option B — Drag and drop**

1. Go to https://vercel.com/new
2. Drag the folder containing `index.html`, `style.css`, and `script.js` onto the page
3. Click **Deploy**

## Custom domain (optional)

In your Vercel project → **Settings → Domains** → add `krynex.systems` (or whatever you own). Vercel walks you through the DNS records.

## Updating content

All three files are plain text. Open them in any editor and change copy, prices, services, etc. No build step — your changes go live as soon as you push to GitHub (Vercel rebuilds automatically) or re-drag to Vercel.

## Notes

- The site is fully responsive. Tested layouts at 1440 / 1024 / 768 / 480 / 360 px wide.
- Animations respect `prefers-reduced-motion` — users with motion sensitivity get a calmer experience automatically.
- The hero dashboard, interactive workflow demo, and "Systems Operational" footer indicator are all UI mockups — they're decorative, not connected to any backend.
- The only outbound request the site makes (apart from Google Fonts) is the contact form POST to `api.web3forms.com/submit` when someone submits.
