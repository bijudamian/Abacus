# Abacus - Testing Repository

> ⚠️ **This repo is for TESTING ONLY.** It has NO connection to the production Firebase site.

## Important Rules

1. **NEVER** add GitHub Actions workflows that deploy to Firebase
2. **NEVER** push `.firebaserc`, `firebase.json`, or Firestore rules to this repo
3. All Firebase config is `.gitignored` — this is intentional, do NOT undo it
4. The production site at `sara-abacus.web.app` is managed **exclusively** through the Firebase Console

## Safe Testing Workflow

1. Edit code locally in the `Student/public/` directory
2. Test locally by opening files in your browser
3. Push to this GitHub repo to save your work
4. **Only when ready:** manually deploy via Firebase Console or `firebase deploy` from your local machine

## Project Structure

```
Abacus/
├── Student/
│   └── public/          ← The actual website files
│       ├── index.html   ← Login page
│       ├── dashboard.html
│       ├── Quiz1/       ← Quiz level 1
│       └── ...
├── public/              ← Admin panel
└── legacy_backup/       ← Previous version backup (gitignored)
```

## Deploying to Production (Manual Only)

```bash
cd Student
firebase deploy --only hosting --project abacus-1cd92
```

**Always test thoroughly before deploying.**
