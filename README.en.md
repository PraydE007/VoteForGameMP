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
- ⭐ **-2 to +2 Rating Scale:** Every participant rates each game from -2 to +2 points (-2 = don't want, -1 = not really, 0 = neutral, +1 = would play, +2 = must play!).
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

### Option 1 — Porthole (Steam, Recommended)

**The recommended way to play with friends is using [Porthole on Steam](https://store.steampowered.com/).**

> [!TIP]
> **Recommendation: Use LAN mode in Porthole**  
> It is strongly recommended to use **LAN mode** in Porthole.  
> To enable it:
> 1. Leave the lobby.
> 2. Open **Add-ons Settings**.
> 3. Turn on **LAN**.

#### Important Connection & Browser Settings

1. **Browser Permission:**  
   During connection, your browser will display a pop-up prompt at the top asking for access permissions. **You must allow/grant this permission** for the web client to communicate with the local server.

2. **Full Server Address Format:**  
   Changing the address is needed specifically for **Porthole in LAN mode**. Make sure to enter the address **fully without removing `http://` or the port**:  
   - **Default:** `http://localhost:8000`  
   - **Replacement example:** replace `localhost` with the host's LAN IP address in Porthole, e.g.:  
     `http://192.168.1.100:8000` or `http://10.0.0.5:8000`

---

### Option 2 — Cloudflare Tunnel (Free & Easy)
```bash
cloudflared tunnel --url http://localhost:8000
```

### Option 3 — Ngrok
```bash
ngrok http 8000
```

Copy the generated `https://...` address (e.g. `https://random-words.trycloudflare.com`) and paste it into the Server Settings dialog (⚙️ icon in the top header).

---

## 🕹️ How It Works

1. **Connect:** Open the website. Ensure the status indicator shows connected (green dot).
2. **Create / Join:** Enter your nickname and click *Create Room* (you become the host) or join an existing room with a 6-character code. Click *«Copy invite link»* and send it to your group.
3. **Add games:** Everyone in the lobby can submit game titles.
4. **Vote:** The host starts the vote. Each player rates each game on a -2 to +2 scale and clicks *Submit Votes*.
5. **Results:** When the last participant votes, the results podium automatically displays the highest-rated game (or multiple winners in case of a tie), alongside a complete ranked leaderboard.

---

## 🛠️ Tech Stack

- **Backend:** Python 3, FastAPI, Uvicorn, Pydantic.
- **Frontend:** Vanilla HTML5, CSS3 (Modern dark theme, Grid/Flexbox), Vanilla JavaScript (Fetch API, Live Polling).
- **Deployment:** GitHub Pages (Frontend) + Local machine / Cloud VPS / Tunnel (Backend).

