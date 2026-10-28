# 🎮 VoteForMP

> **Launch server, open the page, connect, add games into list and vote for them.**

**[🇺🇦 Українська версія доступна тут](./README.md)**

A simple, fast, and real-time multiplayer polling web application designed to help groups of friends agree on what game to play next. The client is completely static and ready for **GitHub Pages**, backed by a lightweight **Python (FastAPI)** server that manages rooms, synchronizes participants, and automatically calculates results.

---

## ✨ Features

- ⚡ **Zero Hassle Setup:** Run the backend with a single click using [`start_backend.bat`](./start_backend.bat) (Windows) or standard Python commands.
- 🌐 **GitHub Pages Native:** Pure HTML5, modern CSS3, and vanilla JS — zero build step, no npm/bundler dependencies.
- 🔗 **One-Click Shareable Links:** Copy direct invite links that pre-fill both server address and room code for your friends.
- 🎮 **Flexible Game Addition:** Add games individually or paste multiple titles in bulk.
- ⭐ **1–5 Rating System:** Every participant rates each game on a scale of 1 to 5 stars.
- 🏆 **Auto-Reveal & Tie Detection:** As soon as all participants submit their ratings, results are revealed immediately. If multiple games share the highest average rating, **all tied winners are highlighted**.

---

## 🚀 Quick Start

### 1. Launch the Backend (Python)

Requirements: Python 3.10 or higher.

**On Windows (one-click):**
- Double-click [`start_backend.bat`](./start_backend.bat).

**Or via terminal:**
```bash
pip install -r backend/requirements.txt
python backend/main.py
```
The server will start listening at `http://localhost:8000`.

---

### 2. Launch the Client

- **Locally:** Simply open [`index.html`](./index.html) in your favorite browser.
- **Online (GitHub Pages):**
  1. Push the repository to GitHub.
  2. In your repo, navigate to **Settings** → **Pages**.
  3. Under **Branch**, select `main` and root folder `/ (root)`, then click **Save**.
  4. Your website will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🌐 Playing Online with Friends

Since GitHub Pages serves content over `https://`, browsers restrict requests to unencrypted local `http://` endpoints (Mixed Content). To expose your local Python server to your friends over the internet securely:

**Option 1 — Cloudflare Tunnel (Recommended, free, no account needed):**
```bash
cloudflared tunnel --url http://localhost:8000
```

**Option 2 — Ngrok:**
```bash
ngrok http 8000
```

Copy the generated `https://...` address (e.g. `https://random-words.trycloudflare.com`) and paste it into the Server Settings dialog (⚙️ icon in the top header).

---

## 🕹️ How It Works

1. **Connect:** Open the website. Ensure the status indicator shows connected (green dot).
2. **Create / Join:** Enter your nickname and click *Create Room* (you become the host) or join an existing room with a 6-character code. Click *«Copy invite link»* and send it to your group.
3. **Add games:** Everyone in the lobby can submit game titles.
4. **Vote:** The host starts the vote. Each player rates each game from 1 to 5 stars and clicks *Submit Votes*.
5. **Results:** When the last participant votes, the results podium automatically displays the highest-rated game (or multiple winners in case of a tie), alongside a complete ranked leaderboard.

---

## 🛠️ Tech Stack

- **Backend:** Python 3, FastAPI, Uvicorn, Pydantic.
- **Frontend:** Vanilla HTML5, CSS3 (Modern dark theme, Grid/Flexbox), Vanilla JavaScript (Fetch API, Live Polling).
- **Deployment:** GitHub Pages (Frontend) + Local machine / Cloud VPS / Tunnel (Backend).

