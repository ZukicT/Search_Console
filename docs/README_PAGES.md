# GitHub Pages setup

## 1. Create the repo on GitHub

1. Go to **https://github.com/new**
2. **Repository name:** `Search_Console` (or e.g. `search-console-support`)
3. Leave **Public** selected.
4. Do **not** check "Add a README" (you already have local commits).
5. Click **Create repository**.

## 2. Push from your Mac

In Terminal, from the project folder:

```bash
cd /Users/tarikzukic/Desktop/Spookers/Search_Console
git push -u origin main
```

If you used a different repo name (e.g. `search-console-support`), update the remote first:

```bash
git remote set-url origin https://github.com/ZukicT/YOUR_REPO_NAME.git
git push -u origin main
```

## 3. Turn on GitHub Pages

1. On GitHub: open the repo → **Settings** → **Pages** (left sidebar).
2. Under **Source**, choose **Deploy from a branch**.
3. **Branch:** `main` → **Folder:** `/docs` → **Save**.
4. After a minute or two the site will be at:
   - **https://zukict.github.io/Search_Console/**  
   (or `https://zukict.github.io/YOUR_REPO_NAME/` if you used another name).

Use that URL as the **Support URL** in App Store Connect.
