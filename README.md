# Book Lending Tracker

**Student:** Frenklin Dedaj (CEN 3 B)

A static book lending management app built using only HTML, CSS, and vanilla JavaScript.

## Features
- Required loan information: title, author, borrower, due date, genre
- Table columns: title, author, borrower, due date, genre, status, action
- Summary: total loans, overdue loans, returned loans
- Add, mark returned, reopen, and delete a loan
- Search by title, author, borrower or genre; filter by status
- Save loan records locally in the browser using localStorage
- Responsive desktop and mobile layout

## Libraries
The **CSS library** is `css/library.css` and is imported by `styles.css`. No other stylesheets or external CSS frameworks are used.

The **JavaScript library** is `js/library.js`, exported as an ES module and imported by `app.js`. No third-party JavaScript packages are used.

## How to run
Serve this folder from a local development server (for example, VS Code Live Server or `python -m http.server 8000`) and open `index.html` in a browser. An HTTP server is recommended for ES module loading.

## GitHub workflow
The initial `index.html`, `styles.css`, and `app.js` were committed as empty files to `main`. Later features were developed on separate `feature/*` branches and merged into `main` through GitHub Pull Requests.

## Deploy to Cloudflare Pages
1. Sign into the Cloudflare dashboard and open **Workers & Pages**.
2. Choose **Create application → Pages → Connect to Git** and authorize GitHub.
3. Select `fdedaj24-png/book-lending-tracker` and the `main` branch.
4. For this plain HTML site, select no build framework, leave the build command blank, and set output directory to `/` (repository root).
5. Deploy and copy the generated `*.pages.dev` URL to send alongside the GitHub repository URL.

**Important:** Browser localStorage is local to each browser/device and is not shared with other users. A Cloudflare Pages deployment hosts the static website; it does not add a backend.
