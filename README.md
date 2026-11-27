# PAMOJA SIGN (stage 1, reviewed)
Connecting Communities Through Sign Language, Education and Technology.

## Install and run
Needs Node 18+ and internet for the first `npm install`.
```
npm install
npm run dev        # http://localhost:5173 (service worker is OFF in dev)
npm test           # automated tests
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on your network, for phone testing
```
`npm run icons` regenerates the PWA icons (needs Python + Pillow).

## Deploy free
Cloudflare Pages: connect the repo, build command `npm run build`, output directory `dist`. GitHub Pages: publish the contents of `dist/` (paths are relative, so subfolders work). Installing as an app and the microphone need HTTPS; both hosts provide it.

## Update lessons, phrases and videos
Edit `src/data.ts`. Put a verified video in `public/videos/` and set `video: 'videos/name.mp4'` on the phrase or lesson. Use small H.264 MP4 files. Rebuild and redeploy. Only add signs verified by Deaf KSL users. Videos are NOT cached by the service worker; users save them with "Download for offline", which stores them in IndexedDB.

## Test offline (do this on a real Android phone in Chrome)
1. `npm run build && npm run preview`, open the shown address on the phone (same Wi-Fi), or open the deployed HTTPS site. Wait for the page to load fully, then reload once.
2. If a video exists, press "Download for offline" and see "Saved for offline use".
3. Mark a lesson complete and favourite a phrase.
4. Turn on airplane mode, close the tab, reopen the site (or installed app).
5. Check: the app loads, the badge says Offline, progress and favourites remain, downloaded videos play, all seven sections open.
6. Install: Chrome menu, "Install app" / "Add to Home screen".

## Privacy
Stored on the device only (IndexedDB): lesson progress, favourites, text-size setting, downloaded videos. Nothing is sent to our servers. Speech-to-text uses the browser's own speech service: Chrome and Edge on Android usually send the audio to the browser vendor's servers, so it needs internet, works in few browsers (not Firefox), and needs HTTPS and microphone permission. Audio is only captured after the user taps the button.

## Status
See the review notes delivered with this release. Untested here: real browsers, real phones, service-worker offline behaviour, PWA install, speech recognition.
Planned (not built): admin dashboard, Academy editing, feedback form, camera sign recognition, Kiswahili speech, real sign content.
