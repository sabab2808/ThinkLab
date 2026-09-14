# Going live: MongoDB Atlas + hosting

Three things need to happen for a real, global THINKLAB: the database
needs to be reachable from anywhere (not just your laptop), the API
needs a public URL, and the frontend needs to know that URL. This is the
order to do it in.

## 1. MongoDB Atlas (the database)

Atlas is MongoDB's own hosted service — free tier is plenty for this.

1. Sign up at https://www.mongodb.com/cloud/atlas/register.
2. Create a project, then **Build a Database** → pick the free **M0**
   tier → pick a cloud region close to you or your users.
3. **Database Access** (left sidebar) → add a database user with a
   username/password. Save the password somewhere — you'll paste it into
   a connection string next.
4. **Network Access** → add an IP address. For getting started, "Allow
   access from anywhere" (`0.0.0.0/0`) is simplest; tighten this to your
   actual hosting provider's IP range once you know it.
5. **Database** → **Connect** → **Drivers** → copy the connection
   string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Add a database name before the `?`: `.../thinklab?retryWrites=...`

That connection string is your `MONGODB_URI`.

## 2. Host the API somewhere with a public URL

Any Node host works — Render, Railway, and Fly.io all have simple free
tiers. Render is the most point-and-click:

1. Push this repo to GitHub if it isn't already.
2. On Render: **New** → **Web Service** → connect the repo.
3. Root directory: `apps/api`. Build command: `npm install`. Start
   command: `npm start`.
4. Add environment variables (Render's dashboard, not a committed file):
   - `MONGODB_URI` — the Atlas connection string from step 1
   - `JWT_SECRET` — any long random string (`openssl rand -hex 32` works)
   - `CORS_ORIGIN` — your frontend's URL once you have it (step 3);
     `http://localhost:5173` in the meantime is fine to unblock deploy
   - `NODE_ENV` — `production`
5. Deploy. Once it's live, run the seed script once against production —
   easiest from your own machine:
   ```bash
   MONGODB_URI="<your atlas uri>" npm run seed --workspace=apps/api
   ```

## 3. Host the frontend, pointed at the real API

Vercel or Netlify both work well for a Vite app.

1. **New Project** → import the repo → root directory `apps/web`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Environment variable: `VITE_API_BASE_URL` = `https://<your-render-url>/api`
   (see `apps/web/.env.example`).
4. Deploy. Then go back to the API's `CORS_ORIGIN` env var (step 2) and
   set it to this frontend's real URL, and redeploy the API so it
   actually accepts requests from it.

## Checking it worked

- Visit the deployed frontend, register an account, play a game.
- Check the leaderboard shows your result — that's the full round trip:
  frontend → API → Atlas → back.
- If requests fail with a CORS error in the browser console, it's almost
  always `CORS_ORIGIN` on the API not matching the frontend's exact URL
  (including `https://`, no trailing slash).

## What doesn't need to change

Nothing in the codebase itself changes based on where things run —
`apps/api/src/config/db.js` already just calls `mongoose.connect(env.mongoUri)`,
so a local `mongodb://127.0.0.1:27017/thinklab` and an Atlas
`mongodb+srv://...` connection string work identically from the app's
point of view.
