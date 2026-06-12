# Job Tracker

Like every student at Epitech, I'm applying to a lot of alternance positions.
I was tracking everything in an Excel sheet and it got messy fast no idea
which companies I needed to follow up with, what my actual response rate was,
or which application was at which stage.

**[Use it here](https://911-parth.github.io/job-tracker/)** — fully usable in your browser: your applications are saved in local storage, so they're still there when you come back. Nothing leaves your machine.

So I built the tool I wanted: a small full-stack app to track applications
through the pipeline (to apply → applied → interview → offer / rejected).
I made it for my alternance hunt, but it works the same for any job search —
contract types cover alternance, stage and CDI.

## Features

- Add applications with company, role, contract type, date, link and notes
- Status pipeline with one-click updates, color-coded cards
- Stats bar: totals per status + response rate
- Filter by status
- "Follow up?" badge on anything applied 14+ days ago with no answer —
  this is the feature that actually changed my behaviour

## Stack

- **Frontend:** React 18 + Vite, plain CSS (no UI library, I wanted to do the
  design myself)
- **Backend:** Node + Express
- **Database:** SQLite via better-sqlite3 — zero setup, the whole DB is one file

## Run it

Backend:

```
cd server
npm install
npm start          # http://localhost:3001
```

Frontend (other terminal):

```
cd client
npm install
npm run dev        # http://localhost:5173, /api is proxied to the backend
```

## API

| Method | Route                  | What it does            |
|--------|------------------------|-------------------------|
| GET    | /api/applications      | list (optional ?status=)|
| POST   | /api/applications      | create                  |
| PATCH  | /api/applications/:id  | update any field        |
| DELETE | /api/applications/:id  | delete                  |
| GET    | /api/stats             | counts + response rate  |

## Things I'd add next

- Import from CSV (to migrate my old Excel sheet properly)
- Email reminder for the follow-up badge instead of just a badge
- Auth, so I can host it somewhere instead of running it locally
