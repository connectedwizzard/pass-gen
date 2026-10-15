# Password Generator

A small, private password generator built with plain HTML, CSS and JavaScript. Runs offline with no build step, dependencies, accounts, analytics, or remote assets.

## Run

Extract the ZIP, then double-click **index.html**. Keep the HTML, CSS, JavaScript files together. You do not need Node.js to use the app.

If your browser restricts clipboard access for local files, the app selects the password so you can press **Ctrl+C** (Windows/Linux) or **Command+C** (macOS). You can also serve this folder locally with `python -m http.server 8000`, then open `http://localhost:8000`.

## Features

- Password length from 4 to 128 characters; default 20.
- Uppercase, lowercase, numbers and symbols, individually selectable.
- Each generated password contains at least one character from every selected group.
- Optional exclusion of lookalikes: `I`, `l`, `1`, `O`, `0`, `o`, `|`.
- Reveal/hide and copy buttons, with manual-copy fallback.
- Responsive layout, keyboard controls and accessible labels.
- No generated-password history or browser storage.

## Upload with GitHub Desktop

### New repository

1. Extract the ZIP into a normal folder.
2. In GitHub Desktop, choose **File → New repository**. Name it `password-generator` (or your preferred name), choose a local path, and create it. Leave the README, Git ignore and license options unset: the project already includes a README and ignore file.
3. Open that new repository folder in File Explorer. Copy **the contents of the extracted `password-generator` folder** into it. `index.html` should be at the root of your repository, not inside a second nested folder. Include `.github`, `.gitignore` and `.gitattributes`.
4. Return to GitHub Desktop. Review the files under Changes, enter `Add password generator` as the summary, and choose **Commit to main**.
5. Click **Publish repository**. Choose whether to keep the repository private, then publish.

### Existing repository

Open or clone your repository in GitHub Desktop. Copy the app files into that repository folder, review the changes, commit, then click **Push origin**. If the repository already contains an app, README or workflow, merge the files deliberately rather than overwriting them.

Publishing the repository uploads the source code; enable GitHub Pages separately to host the app.

## Host on GitHub Pages

This is a static site: no backend, dependency installation, or compilation is required. All asset paths are relative, so it supports repository subpaths such as `https://USERNAME.github.io/password-generator/`.

1. Put `index.html`, `styles.css`, `generator.js`, `app.js` and `.nojekyll` at the root of your repository, then commit and push using GitHub Desktop.
2. On GitHub, open the repository's **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select **main** and **/(root)**, then **Save**.
5. After deployment finishes, open the site link shown in Pages settings.

The included `.nojekyll` disables Jekyll processing. The test workflow only runs checks; Pages handles publishing after you enable it. Password generation still runs in the visitor's browser.

[GitHub Pages publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

[GitHub Desktop guide](https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop)

## How randomness works

`generator.js` uses Web Crypto's `crypto.getRandomValues()` and rejection sampling to avoid modulo bias. It draws full candidate passwords uniformly from the selected alphabet, then rejects candidates missing any selected character group. This preserves uniform sampling over passwords that meet the selected rules. There is no `Math.random()` fallback; generation stops if cryptographic randomness is unavailable.

Passwords remain in page memory until replaced or the page is closed. Copying puts a password on your system clipboard, which your operating system or clipboard manager may retain. The app does not attempt to clear the clipboard or make memory-erasure guarantees. Use a unique password for each account and store it in a password manager. The minimum length exists for site compatibility, not as a recommendation to use short passwords.

[MDN: Crypto.getRandomValues](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)

## Development and tests

Use Node.js 22 or later for the optional tests:

```sh
npm test
```

No `npm install` is needed. Tests cover every nonempty combination of character types, length limits, excluded characters, required-group rejection, modulo-tail rejection, and unavailable cryptographic randomness. GitHub Actions runs the tests on pushes and pull requests.

Files:

| File | Purpose |
| --- | --- |
| `index.html` | Interface |
| `styles.css` | Simple dark gray and black layout with blue accents |
| `generator.js` | Randomness and password generation |
| `app.js` | UI and clipboard interactions |
| `tests/generator.test.js` | Generator tests |
| `.github/workflows/test.yml` | Automated checks |

The project has no license selected. Choose a license before inviting reuse or contributions under specific terms.
