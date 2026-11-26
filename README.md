# Real-time Transcription

Speak in Hindi, English or a mix of both, and the text shows up while you're talking. When you stop, the transcript is saved to Postgres. The History page lets you search, edit, copy or delete old ones.

The live link and the access code are in the email.

## Stack

- React 19 + Vite 8, with HeroUI 3 and Tailwind 4 for the UI
- Node 24 + Express 5, with `ws` for streaming audio
- PostgreSQL on Neon (`pg`)
- Gemini Live API (`gemini-3.5-transcribe-live`) for speech to text
- Hosted on Render

The browser records 16 kHz audio and sends it to the Express server over a WebSocket. The server passes it to Gemini and sends the text back as it arrives, so the API key never reaches the browser.

## Running locally

You need Node 24 or newer, a Postgres database (a free Neon project is enough) and a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/Zaahiid/Real-time-transcription-app.git
cd Real-time-transcription-app
npm install
cp .env.example .env
```

Fill in `.env`:

- `DATABASE_URL`: Neon connection string, with `sslmode=verify-full`
- `GEMINI_API_KEY`: your Gemini key
- `ACCESS_PASSWORD`: any six-digit code, used on the login screen
- `SESSION_SECRET`: any long random string.

Then start it:

```bash
npm run dev
```
