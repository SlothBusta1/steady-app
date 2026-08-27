# Deploying Steady

This gets you a real link and a working AI food-photo feature. Two things you'll need first — and one of them really needs a parent, so read this part before starting:

1. A free GitHub account (you can do this yourself)
2. A free Vercel account (you can do this yourself)
3. An Anthropic API key from console.anthropic.com — **this requires a payment method on file, because API usage is billed per request.** For a personal project like this the cost is small (probably a few dollars a month even with regular use), but it's real money tied to a real account, so get a parent to set this part up with you.

## Steps

1. **Create a GitHub repo.** Go to github.com, sign in (or make an account), click "New repository," name it `steady-app`, keep it public or private, create it.

2. **Upload these files.** On the new repo's page, click "uploading an existing file" and drag in everything from this project: `index.html`, `manifest.json`, `sw.js`, the `icons` folder, and the `api` folder (with `analyze.js` and `workout.js` inside). Commit the upload.

3. **Get an Anthropic API key** (with a parent). Go to console.anthropic.com, sign in, go to "API Keys," create a new key, copy it somewhere safe. Add a payment method under billing.

4. **Import into Vercel.** Go to vercel.com, sign in with your GitHub account, click "Add New Project," select your `steady-app` repo, click Import. Don't change any build settings — Vercel auto-detects the `/api` folder.

5. **Add your API key as an environment variable.** Before deploying (or after, in Project Settings → Environment Variables), add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: the key you copied in step 3

   Then deploy (or redeploy if you already deployed).

6. **Get your link.** Vercel gives you a URL like `steady-app-yourname.vercel.app`. Open it on your phone's browser.

7. **Add to home screen.**
   - **iPhone (Safari):** tap the Share icon → "Add to Home Screen."
   - **Android (Chrome):** tap the three-dot menu → "Add to Home screen" (or you'll see an install banner automatically).

That's it — it'll open full-screen like a real app, and the food photo feature will actually work because your key lives safely on Vercel's server, never in the app itself.

## If something breaks

- **Photo logging says "couldn't read that photo":** double check the `ANTHROPIC_API_KEY` environment variable is set in Vercel and you redeployed after adding it.
- **Workout suggestions fail the same way:** same fix, same variable.
- **Nothing loads at all:** check the Vercel deployment log for errors — usually a typo in a file name.

## What persists

Your goals, streaks, meal log, and history now save to your phone's browser storage (`localStorage`), so closing the app won't lose your data. It's tied to that one browser/device though — no cloud sync yet.
