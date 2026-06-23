# GoalCurrent TWA — Cursor Task Brief

## What This Is
GoalCurrent is a Next.js PWA deployed on Vercel at https://www.goalcurrent.live
We have built a signed Android TWA app using PWABuilder and need to:
1. Add `assetlinks.json` to the public folder so the app passes TWA verification
2. Update `next.config.ts` to serve it with the correct headers
3. Update `vercel.json` to serve it with the correct headers

This is the ONLY change needed. Do not touch anything else.

---

## TASK 1 — Create this new file

**File path:** `public/.well-known/assetlinks.json`

**File contents (copy exactly):**
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.goalcurrent.app",
    "sha256_cert_fingerprints": ["89:11:AD:11:9A:CC:51:DD:A0:16:B6:C8:5F:0A:E8:12:89:B4:16:1B:E8:96:D9:2B:7B:D0:BF:07:79:EA:A2:DD"]
  }
}]
```

---

## TASK 2 — Update `next.config.ts`

Find the `async headers()` section and ADD this block at the very top of the returned array (before the `/sw.js` entry):

```typescript
{
  source: "/.well-known/assetlinks.json",
  headers: [
    { key: "Content-Type", value: "application/json" },
    { key: "Access-Control-Allow-Origin", value: "*" },
    { key: "Cache-Control", value: "no-cache" },
  ],
},
```

---

## TASK 3 — Update `vercel.json`

Replace the entire contents of `vercel.json` with:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "goalcurrent.online" }],
      "destination": "https://www.goalcurrent.live/:path*",
      "permanent": true
    },
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.goalcurrent.online" }],
      "destination": "https://www.goalcurrent.live/:path*",
      "permanent": true
    },
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "goalcurrent.live" }],
      "destination": "https://www.goalcurrent.live/:path*",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/.well-known/assetlinks.json",
      "headers": [
        { "key": "Content-Type", "value": "application/json" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}
```

---

## TASK 4 — Commit and push to GitHub

Run these commands in the terminal:
```bash
git add public/.well-known/assetlinks.json
git add next.config.ts
git add vercel.json
git commit -m "feat: add assetlinks.json for Android TWA verification"
git push
```

---

## TASK 5 — Verify it works

After Vercel deploys (takes ~1 minute), open this URL in a browser:
```
https://www.goalcurrent.live/.well-known/assetlinks.json
```

It should return the JSON content, NOT a 404 error.

---

## Key Info (DO NOT SHARE PUBLICLY)

| Item | Value |
|------|-------|
| Package name | `com.goalcurrent.app` |
| SHA-256 fingerprint | `89:11:AD:11:9A:CC:51:DD:A0:16:B6:C8:5F:0A:E8:12:89:B4:16:1B:E8:96:D9:2B:7B:D0:BF:07:79:EA:A2:DD` |
| Keystore password | `wCu5AfpQjzSX` |
| Key alias | `my-key-alias` |
| Key password | `wCu5AfpQjzSX` |
| AAB file | `GoalCurrent.aab` (in PWABuilder ZIP) |

---

## After This Is Done

Upload `GoalCurrent.aab` from the PWABuilder ZIP to:
https://play.google.com/console → Create app → Upload AAB

The signing key is already embedded in the AAB by PWABuilder.
