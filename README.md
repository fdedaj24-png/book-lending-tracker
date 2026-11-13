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

## Quality checks
Run `node --test tests/library.test.mjs` with Node.js 22 or later. The test suite covers required fields, valid calendar dates, current/overdue/returned statuses, persistence, return/reopen/delete actions, safe HTML escaping and failed-storage recovery.

## Manual acceptance test
1. Add a loan using all five required fields and confirm a row appears and total loans increases.
2. Add a loan with yesterday as its due date: its status must be **Overdue** and the overdue counter increases.
3. Set the status filter to **Overdue** and verify only overdue rows appear.
4. Mark that loan returned: its status changes to **Returned**, the overdue counter decreases, and returned count increases.
5. Refresh the browser: the loan remains saved in localStorage.
6. Delete the loan and confirm the table and counters update.

Deployment is connected to the `main` branch; GitHub pull-request merges trigger redeployment on Cloudflare Workers.
