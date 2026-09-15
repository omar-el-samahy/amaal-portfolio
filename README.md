# Amaal Abdou — Portfolio (free site + easy project editing)

Single-page portfolio hosted for free on **Netlify**, with an editing panel
([Decap CMS](https://decapcms.org)) so you can add / edit / remove the projects
visitors see — no coding.

## What's in this folder

| Path | Purpose |
| --- | --- |
| `index.html` + `assets/` | The portfolio site visitors see |
| `content/projects.json` | The project list (edited from the admin panel) |
| `admin/` | The editing panel (Decap CMS) — lives at `yoursite.netlify.app/admin` |
| `netlify.toml` | Netlify settings (publish from repo root, no build step) |

## Step 1 — Put this folder on GitHub (once)

1. Go to <https://github.com/new> and create a **new repository**, name it
   e.g. `amaal-portfolio`. Click **Create repository** (blank, no README).
2. Back on your computer, open this folder in a terminal and run:

   ```sh
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/amaal-portfolio.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

## Step 2 — Connect to Netlify (free)

1. Go to <https://app.netlify.com> → **Sign up** with GitHub (free plan).
2. Click **Add new site → Import an existing project** → pick GitHub and
   authorize → select `amaal-portfolio`.
3. Keep defaults, click **Deploy**.
4. After a minute you get a live URL: `https://amaal-portfolio.netlify.app`.

## Step 3 — Enable the admin panel (one time)

1. On Netlify, open your site → **Site configuration** → **Access control → Identity**.
2. Click **Enable Identity**.
3. In the Identity settings, under **Registration preferences**, choose
   **Invite only** (so strangers can't create accounts), or **Open** if you want
   self-signup.
4. Under **Services**, click **Enable Git Gateway**.
5. Now open `https://amaal-portfolio.netlify.app/admin`, click **Login with
   Netlify Identity**, and create your account (use the invite link if you chose
   "Invite only").

## Editing the site

1. Open `https://amaal-portfolio.netlify.app/admin` and log in.
2. **Portfolio Projects** is the single file containing your project list:
   - **Add project** → fill title, category tag, upload a cover image (it goes
     to `assets/img`), paste the Behance link, write a description, add tools,
     tick **Featured**.
   - To **edit/remove**, click a project entry, change fields, or press delete.
3. Click **Publish / Save** — Decap commits the change to GitHub and Netlify
   redeploys automatically (a couple of minutes).

## Customizing text (name, about, contact)

These are hard-coded in `index.html` (header, hero, about, contact sections) for
simplicity. Ask me to move them into an editable file too if you'd like, or just
edit them in GitHub and Netlify redeploys.

## Removing the screenshots

`shots_desktop.png` / `shots_mobile.png` at the folder root are only dev
checkpoints — delete them before committing if you like.