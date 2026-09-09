# Personal Website & Landing Page

A minimal, high-performance personal landing page designed with a sleek dark mode aesthetic, glassmorphism cards, and smooth interactions.

## ✨ Features

- **Modern Glassmorphism UI**: Backdrop blur cards with gradient accent borders and ambient glow lights.
- **Ultra Fast & Lightweight**: Pure HTML5, Tailwind CSS, and vanilla JavaScript with zero build steps or npm dependencies.
- **Interactive Micro-interactions**:
  - Click-to-copy email with animated toast notification.
  - Interactive contact form that triggers direct mailto communication.
  - Dynamic local time indicator and live year.
  - Hover states and subtle depth animations.
- **Fully Responsive**: Optimized for mobile screens, tablets, and desktop displays.
- **Clean Semantic Markup**: SEO-friendly with Open Graph & Twitter meta tags ready.

---

## 🚀 How to Run & Preview Locally

Since this site is built with pure static web standards, you have two super simple options:

### Option 1: Built-in Python Server (Recommended)
From inside the `personal-site` directory:
```bash
python3 -m http.server 8000
```
Then open your browser to [http://localhost:8000](http://localhost:8000).

### Option 2: Direct File Open
You can directly double-click or open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

---

## 🎨 How to Customize

All content is clearly labeled in `index.html`:

1. **Name & Tagline**:
   - Search for `Mat Nemati` in `index.html` and replace it with your own name.
   - Edit the headline and bio paragraph in the About section.
2. **Avatar**:
   - By default, a stylish monogram (`MN`) is rendered.
   - To use a photo, place an image (e.g. `avatar.jpg`) into this directory and uncomment the `<img>` tag inside the avatar container.
3. **Social Links**:
   - Update the `href` attributes in the **Connect** section with your actual GitHub, LinkedIn, and X (Twitter) profile URLs.
   - Update the `data-email` attribute on the copy buttons to your personal email address.
4. **Projects & Skills**:
   - Edit the project titles, descriptions, tags, and links in the **Selected Projects** section.
   - Add or remove skills from the **Tech Stack & Skills** section.

---

## 🌐 Free Deployment Options

You can host this site for free in under 2 minutes:

- **GitHub Pages**: Push this directory to a GitHub repository, go to `Settings > Pages`, and select `main` branch.
- **Vercel**: Drag and drop the `personal-site` folder at [vercel.com/new](https://vercel.com/new).
- **Netlify**: Drag and drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages**: Connect your Git repo or upload the folder directly.
