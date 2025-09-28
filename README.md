<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View the app in AI Studio: https://ai.studio/apps/drive/17DrlUiDuWRqki3iTqhLS55QERkP6vLM_

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Locally set the API key in `.env.local` as either `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY`.
   - For Vercel, create a Project Environment Variable named `VITE_GEMINI_API_KEY` and paste your Gemini API key there. Client-facing keys must be prefixed with `VITE_` so Vite exposes them to the browser during the build.
3. Run the app:
   `npm run dev`
4. If your deployed app shows a blank page and the browser console complains about `API_KEY environment variable not set`, make sure you added `VITE_GEMINI_API_KEY` in the Vercel dashboard and re-deploy.
