/**
 * VoteForMP - Frontend Application
 * Multi-user Game Polling client designed for GitHub Pages & Python backend.
 */

(function () {
  'use strict';

  // --- State ---
  const state = {
    serverUrl: 'http://localhost:8000',
    clientId: getOrCreateClientId(),
    playerName: localStorage.getItem('vote_player_name') || '',
    roomId: null,
    roomData: null,
    isHost: false,
    pollTimer: null,
    userDraftVotes: {}, // { gameId: ratingNumber }
    hasSubmittedVote: false,
    isConnected: false,
  };

  // --- Rating labels with icons ---
  const RATING_INFO = {
    1: { icon: '🛑', label: 'Не хочу' },
    2: { icon: '😕', label: 'Не дуже' },
    3: { icon: '😐', label: 'Зіграю' },
    4: { icon: '👍', label: 'Хочу' },
    5: { icon: '🔥', label: 'Топ / Дуже хочу!' },
  };

  // --- DOM Elements ---
  const el = {
    // Header & Server
    statusDot: document.getElementById('statusDot'),
    serverLabel: document.getElementById('serverLabel'),
    btnToggleServerSettings: document.getElementById('btnToggleServerSettings'),
    serverDrawer: document.getElementById('serverDrawer'),
    btnCloseServerSettings: document.getElementById('btnCloseServerSettings'),
    serverUrlInput: document.getElementById('serverUrlInput'),
    btnTestServer: document.getElementById('btnTestServer'),
    btnSaveServer: document.getElementById('btnSaveServer'),
    serverTestResult: document.getElementById('serverTestResult'),
    toastContainer: document.getElementById('toastContainer'),

    // Views
    viewEntry: document.getElementById('viewEntry'),
    viewLobby: document.getElementById('viewLobby'),
    viewVoting: document.getElementById('viewVoting'),
    viewResults: document.getElementById('viewResults'),

    // Entry View
    playerNameInput: document.getElementById('playerNameInput'),
    roomCodeInput: document.getElementById('roomCodeInput'),
    btnCreateRoom: document.getElementById('btnCreateRoom'),
    btnJoinRoom: document.getElementById('btnJoinRoom'),

    // Lobby View
    lobbyRoomCode: document.getElementById('lobbyRoomCode'),
    btnCopyInvite: document.getElementById('btnCopyInvite'),
    btnLeaveRoom: document.getElementById('btnLeaveRoom'),
    gamesCount: document.getElementById('gamesCount'),
    participantsCount: document.getElementById('participantsCount'),
    addGameForm: document.getElementById('addGameForm'),
    gameTitleInput: document.getElementById('gameTitleInput'),
    btnAddGame: document.getElementById('btnAddGame'),
    btnToggleBulkAdd: document.getElementById('btnToggleBulkAdd'),
    bulkAddPanel: document.getElementById('bulkAddPanel'),
    bulkGamesInput: document.getElementById('bulkGamesInput'),
    btnSubmitBulkGames: document.getElementById('btnSubmitBulkGames'),
    btnCancelBulkGames: document.getElementById('btnCancelBulkGames'),
    lobbyGamesList: document.getElementById('lobbyGamesList'),
    lobbyParticipantsList: document.getElementById('lobbyParticipantsList'),
    hostControlPanel: document.getElementById('hostControlPanel'),
    roleBadge: document.getElementById('roleBadge'),
    hostStatusMsg: document.getElementById('hostStatusMsg'),
    btnStartVote: document.getElementById('btnStartVote'),

    // Voting View
    votingProgressText: document.getElementById('votingProgressText'),
    votingForm: document.getElementById('votingForm'),
    votingGamesContainer: document.getElementById('votingGamesContainer'),
    votingSubmitBar: document.getElementById('votingSubmitBar'),
    btnSubmitVotes: document.getElementById('btnSubmitVotes'),
    votedWaitingState: document.getElementById('votedWaitingState'),
    votedCountLabel: document.getElementById('votedCountLabel'),
    votedProgressBar: document.getElementById('votedProgressBar'),
    participantsVoteTracker: document.getElementById('participantsVoteTracker'),
    hostEmergencyAction: document.getElementById('hostEmergencyAction'),
    btnForceFinishVote: document.getElementById('btnForceFinishVote'),

    // Results View
    resultsTitle: document.getElementById('resultsTitle'),
    winnersContainer: document.getElementById('winnersContainer'),
    leaderboardList: document.getElementById('leaderboardList'),
    totalVotersLabel: document.getElementById('totalVotersLabel'),
    hostResultsControls: document.getElementById('hostResultsControls'),
    btnRestartRound: document.getElementById('btnRestartRound'),
    btnResetAll: document.getElementById('btnResetAll'),
    btnExitToMenu: document.getElementById('btnExitToMenu'),
  };

  // --- Initialization ---
  function init() {
    // 1. Resolve server URL from URL param or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paramServer = urlParams.get('server');
    const paramRoom = urlParams.get('room');

    if (paramServer) {
      state.serverUrl = cleanUrl(paramServer);
      localStorage.setItem('vote_server_url', state.serverUrl);
    } else {
      const savedServer = localStorage.getItem('vote_server_url');
      if (savedServer) {
        state.serverUrl = cleanUrl(savedServer);
      }
    }

    el.serverUrlInput.value = state.serverUrl;
    updateServerPillDisplay();

    // 2. Set player name
    if (state.playerName) {
      el.playerNameInput.value = state.playerName;
    }

    // 3. Set room code from param if provided
    if (paramRoom) {
      el.roomCodeInput.value = paramRoom.toUpperCase();
    }

    // 4. Attach event listeners
    bindEvents();

    // 5. Check backend connectivity
    checkServerHealth(true);
  }

  function getOrCreateClientId() {
    let id = localStorage.getItem('vote_client_id');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem('vote_client_id', id);
    }
    return id;
  }

  function cleanUrl(url) {
    if (!url) return 'http://localhost:8000';
    let clean = url.trim();
    if (!/^https?:\/\//i.test(clean)) {
      clean = 'http://' + clean;
    }
    return clean.replace(/\/+$/, '');
  }

  // --- Event Bindings ---
  function bindEvents() {
    // Server Drawer
    el.btnToggleServerSettings.addEventListener('click', toggleServerDrawer);
    el.btnCloseServerSettings.addEventListener('click', toggleServerDrawer);
    el.btnTestServer.addEventListener('click', () => checkServerHealth(false));
    el.btnSaveServer.addEventListener('click', saveServerUrl);

    // Entry View
    el.btnCreateRoom.addEventListener('click', handleCreateRoom);
    el.btnJoinRoom.addEventListener('click', handleJoinRoom);
    el.roomCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleJoinRoom();
    });

    // Lobby View
    el.btnCopyInvite.addEventListener('click', copyInviteLink);
    el.btnLeaveRoom.addEventListener('click', leaveRoom);
    el.addGameForm.addEventListener('submit', handleAddGame);
    el.btnToggleBulkAdd.addEventListener('click', () => {
      const isHidden = el.bulkAddPanel.style.display === 'none';
      el.bulkAddPanel.style.display = isHidden ? 'block' : 'none';
      if (isHidden) el.bulkGamesInput.focus();
    });
    el.btnCancelBulkGames.addEventListener('click', () => {
      el.bulkAddPanel.style.display = 'none';
      el.bulkGamesInput.value = '';
    });
    el.btnSubmitBulkGames.addEventListener('click', handleSubmitBulkGames);
    el.btnStartVote.addEventListener('click', handleStartVote);

    // Voting View
    el.votingForm.addEventListener('submit', handleSubmitVotes);
    el.btnForceFinishVote.addEventListener('click', handleForceFinishVote);

    // Results View
    el.btnRestartRound.addEventListener('click', () => handleResetRound(true));
    el.btnResetAll.addEventListener('click', () => handleResetRound(false));
    el.btnExitToMenu.addEventListener('click', leaveRoom);
  }

  // --- API Client ---
  async function apiRequest(endpoint, method = 'GET', body = null) {
    const url = `${state.serverUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorDetail = (data && data.detail) ? data.detail : `Помилка сервера (${response.status})`;
        throw new Error(errorDetail);
      }
      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        // Typical Mixed Content or Offline issue
        const isHttpsPage = window.location.protocol === 'https:';
        const isHttpServer = state.serverUrl.startsWith('http://');

        if (isHttpsPage && isHttpServer) {
          throw new Error('Браузер блокує HTTP-запит із HTTPS-сторінки (Mixed Content). Використовуйте HTTPS адресу бекенда (через ngrok або cloudflared tunnel).');
        } else {
          throw new Error(`Не вдалося з'єднатися із сервером (${state.serverUrl}). Переконайтеся, що backend запущено.`);
        }
      }
      throw err;
    }
  }

  // --- Server Management ---
  async function checkServerHealth(silent = false) {
    el.statusDot.className = 'status-dot checking';
    if (!silent) {
      el.serverTestResult.textContent = 'Перевірка зв\'язку...';
      el.serverTestResult.className = 'server-test-result';
    }

    try {
      const data = await apiRequest('/health');
      if (data && data.status === 'ok') {
        state.isConnected = true;
        el.statusDot.className = 'status-dot connected';
        el.serverLabel.textContent = `Сервер: ${formatServerDisplay(state.serverUrl)}`;
        if (!silent) {
          el.serverTestResult.textContent = '✅ З\'єднання успішне! Бекенд активний.';
          el.serverTestResult.className = 'server-test-result success';
          showToast('З\'єднання з сервером встановлено!', 'success');
        }
        return true;
      }
    } catch (err) {
      state.isConnected = false;
      el.statusDot.className = 'status-dot disconnected';
      el.serverLabel.textContent = 'Сервер: немає зв\'язку';
      if (!silent) {
        el.serverTestResult.textContent = `❌ ${err.message}`;
        el.serverTestResult.className = 'server-test-result error';
        showToast(err.message, 'error');
      }
      return false;
    }
  }

  function saveServerUrl() {
    const raw = el.serverUrlInput.value;
    state.serverUrl = cleanUrl(raw);
    localStorage.setItem('vote_server_url', state.serverUrl);
    updateServerPillDisplay();
    checkServerHealth(false);
  }

  function toggleServerDrawer() {
    const isHidden = el.serverDrawer.style.display === 'none';
    el.serverDrawer.style.display = isHidden ? 'block' : 'none';
  }

  function formatServerDisplay(url) {
    try {
      const u = new URL(url);
      return u.host;
    } catch {
      return url;
    }
  }

  function updateServerPillDisplay() {
    el.serverLabel.textContent = `Сервер: ${formatServerDisplay(state.serverUrl)}`;
  }

  // --- Navigation & View Switching ---
  function showView(viewId) {
    [el.viewEntry, el.viewLobby, el.viewVoting, el.viewResults].forEach(v => {
      v.style.display = 'none';
      v.classList.remove('active');
    });

    const activeView = document.getElementById(viewId);
    if (activeView) {
      activeView.style.display = 'block';
      activeView.classList.add('active');
    }
  }

  // --- Room Actions ---

  function validatePlayerName() {
    const name = el.playerNameInput.value.trim();
    if (!name) {
      showToast('Будь ласка, введіть ваше ім\'я або нікнейм!', 'error');
      el.playerNameInput.focus();
      return null;
    }
    state.playerName = name;
    localStorage.setItem('vote_player_name', name);
    return name;
  }

  async function handleCreateRoom() {
    const name = validatePlayerName();
    if (!name) return;

    try {
      el.btnCreateRoom.disabled = true;
      el.btnCreateRoom.textContent = 'Створення...';

      const data = await apiRequest('/api/rooms', 'POST', {
        host_name: name,
        client_id: state.clientId,
      });

      state.roomId = data.room_id;
      state.roomData = data.room;
      state.isHost = true;

      showToast(`Кімнату створено! Код: ${state.roomId}`, 'success');
      enterRoom();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnCreateRoom.disabled = false;
      el.btnCreateRoom.innerHTML = '<span>Створити кімнату</span>';
    }
  }

  async function handleJoinRoom() {
    const name = validatePlayerName();
    if (!name) return;

    const code = el.roomCodeInput.value.trim().toUpperCase();
    if (!code) {
      showToast('Введіть код кімнати!', 'error');
      el.roomCodeInput.focus();
      return;
    }

    try {
      el.btnJoinRoom.disabled = true;
      el.btnJoinRoom.textContent = 'Вхід...';

      const data = await apiRequest(`/api/rooms/${code}/join`, 'POST', {
        name: name,
        client_id: state.clientId,
      });

      state.roomId = code;
      state.roomData = data.room;
      state.isHost = data.room.is_viewer_host;

      showToast(`Успішно приєдналися до кімнати ${code}!`, 'success');
      enterRoom();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnJoinRoom.disabled = false;
      el.btnJoinRoom.innerHTML = '<span>Приєднатися</span>';
    }
  }

  function enterRoom() {
    // Start continuous room polling
    startPolling();
    renderCurrentState();
  }

  function leaveRoom() {
    stopPolling();
    state.roomId = null;
    state.roomData = null;
    state.isHost = false;
    state.userDraftVotes = {};
    state.hasSubmittedVote = false;
    showView('viewEntry');
  }

  function startPolling() {
    stopPolling();
    pollRoom();
    state.pollTimer = setInterval(pollRoom, 1500);
  }

  function stopPolling() {
    if (state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  }

  async function pollRoom() {
    if (!state.roomId) return;
    try {
      const data = await apiRequest(`/api/rooms/${state.roomId}?client_id=${state.clientId}`);
      if (data && data.room) {
        state.roomData = data.room;
        state.isHost = data.room.is_viewer_host;
        renderCurrentState();
      }
    } catch (err) {
      console.warn('Poll error:', err.message);
    }
  }

  // --- State Router & Rendering ---
  function renderCurrentState() {
    if (!state.roomData) return;

    const status = state.roomData.status;

    if (status === 'lobby') {
      showView('viewLobby');
      renderLobby();
    } else if (status === 'voting') {
      showView('viewVoting');
      renderVoting();
    } else if (status === 'results') {
      showView('viewResults');
      renderResults();
    }
  }

  // --- Lobby Rendering ---
  function renderLobby() {
    const room = state.roomData;
    el.lobbyRoomCode.textContent = room.id;
    el.gamesCount.textContent = room.games.length;
    el.participantsCount.textContent = room.participants.length;

    // Host status badge & start vote controls
    if (state.isHost) {
      el.hostControlPanel.style.display = 'block';
      el.roleBadge.textContent = '👑 Ви Хост кімнати';
      el.roleBadge.className = 'badge badge-gold';
      el.hostStatusMsg.textContent = room.games.length === 0
        ? 'Додайте хоча б одну гру, щоб мати можливість розпочати голосування.'
        : 'Коли всі друзі приєднались і список ігор готовий, натискайте:';
      el.btnStartVote.disabled = room.games.length === 0;
    } else {
      el.hostControlPanel.style.display = 'block';
      el.roleBadge.textContent = `Хост: ${room.host_name}`;
      el.roleBadge.className = 'badge badge-purple';
      el.hostStatusMsg.textContent = 'Очікуємо, поки хост запустить голосування... Ви можете додавати свої ігри у список!';
      el.btnStartVote.style.display = 'none';
    }

    // Render games list
    if (room.games.length === 0) {
      el.lobbyGamesList.innerHTML = `
        <div class="empty-state">
          <p>🎮 Список порожній. Впишіть назву гри вище та натисніть <strong>"Додати"</strong>!</p>
        </div>
      `;
    } else {
      el.lobbyGamesList.innerHTML = room.games.map(game => {
        const canDelete = state.isHost || game.added_by_id === state.clientId;
        return `
          <div class="game-item">
            <div class="game-item-info">
              <span class="game-item-title">${escapeHtml(game.title)}</span>
              <span class="game-item-author">Додав(ла): ${escapeHtml(game.added_by || 'Учасник')}</span>
            </div>
            ${canDelete ? `
              <button type="button" class="btn-delete-game" title="Видалити" onclick="window.VoteApp.deleteGame('${game.id}')">
                🗑️
              </button>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // Render participants list
    el.lobbyParticipantsList.innerHTML = room.participants.map(p => {
      return `
        <li class="participant-item">
          <div class="participant-info">
            <span class="status-dot connected"></span>
            <span class="participant-name">${escapeHtml(p.name)}</span>
            ${p.is_you ? '<span class="badge badge-purple">Ви</span>' : ''}
            ${p.is_host ? '<span class="badge badge-gold">👑 Хост</span>' : ''}
          </div>
          ${(state.isHost && !p.is_you) ? `
            <button type="button" class="btn-delete-game" title="Вилучити" onclick="window.VoteApp.kickParticipant('${p.id}')">
              ✖
            </button>
          ` : ''}
        </li>
      `;
    }).join('');
  }

  async function handleAddGame(e) {
    e.preventDefault();
    const title = el.gameTitleInput.value.trim();
    if (!title) return;

    try {
      el.btnAddGame.disabled = true;
      const data = await apiRequest(`/api/rooms/${state.roomId}/games`, 'POST', {
        client_id: state.clientId,
        games: [title],
      });
      el.gameTitleInput.value = '';
      state.roomData = data.room;
      renderLobby();
      showToast(`Гру "${title}" додано!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnAddGame.disabled = false;
    }
  }

  async function handleSubmitBulkGames() {
    const raw = el.bulkGamesInput.value.trim();
    if (!raw) return;

    const list = raw.split('\n').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return;

    try {
      el.btnSubmitBulkGames.disabled = true;
      const data = await apiRequest(`/api/rooms/${state.roomId}/games`, 'POST', {
        client_id: state.clientId,
        games: list,
      });
      el.bulkGamesInput.value = '';
      el.bulkAddPanel.style.display = 'none';
      state.roomData = data.room;
      renderLobby();
      showToast(data.message || 'Ігри додано!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnSubmitBulkGames.disabled = false;
    }
  }

  async function deleteGame(gameId) {
    if (!confirm('Видалити цю гру зі списку?')) return;
    try {
      const data = await apiRequest(`/api/rooms/${state.roomId}/games/${gameId}?client_id=${state.clientId}`, 'DELETE');
      state.roomData = data.room;
      renderLobby();
      showToast('Гру видалено.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function kickParticipant(participantId) {
    if (!confirm('Вилучити цього гравця з кімнати?')) return;
    try {
      const data = await apiRequest(`/api/rooms/${state.roomId}/participants/${participantId}?client_id=${state.clientId}`, 'DELETE');
      state.roomData = data.room;
      renderLobby();
      showToast('Гравця вилучено.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleStartVote() {
    if (!state.roomId) return;
    try {
      el.btnStartVote.disabled = true;
      const data = await apiRequest(`/api/rooms/${state.roomId}/start-vote`, 'POST', {
        client_id: state.clientId,
      });
      state.roomData = data.room;
      state.userDraftVotes = {};
      state.hasSubmittedVote = false;
      renderCurrentState();
      showToast('Голосування відкрито! Оцініть кожну гру.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      el.btnStartVote.disabled = false;
    }
  }

  // --- Voting Rendering ---
  function renderVoting() {
    const room = state.roomData;
    const hasVoted = room.user_has_voted;
    state.hasSubmittedVote = hasVoted;

    if (hasVoted) {
      // Show waiting screen with live participant vote counters
      el.votingForm.style.display = 'none';
      el.votedWaitingState.style.display = 'block';

      el.votedCountLabel.textContent = `${room.voted_count} / ${room.total_participants}`;
      const percentage = room.total_participants > 0 ? (room.voted_count / room.total_participants) * 100 : 0;
      el.votedProgressBar.style.width = `${percentage}%`;

      // Tracker chips for participants
      el.participantsVoteTracker.innerHTML = room.participants.map(p => {
        return `
          <div class="tracker-item ${p.has_voted ? 'voted' : ''}">
            <span>${p.has_voted ? '✅' : '⏳'}</span>
            <strong>${escapeHtml(p.name)}</strong>
            <span class="small-text">${p.has_voted ? 'Проголосував(ла)' : 'Обирає...'}</span>
          </div>
        `;
      }).join('');

      // Show host emergency finish button if needed
      el.hostEmergencyAction.style.display = state.isHost ? 'block' : 'none';
    } else {
      // Show active voting cards
      el.votingForm.style.display = 'block';
      el.votedWaitingState.style.display = 'none';

      const games = room.games;
      const totalGames = games.length;
      const ratedCount = Object.keys(state.userDraftVotes).length;
      el.votingProgressText.textContent = `Оцінено ${ratedCount} з ${totalGames}`;

      // Render cards if container is empty or number of games changed
      if (el.votingGamesContainer.children.length !== games.length) {
        el.votingGamesContainer.innerHTML = games.map(game => {
          const selectedRating = state.userDraftVotes[game.id] || null;
          return `
            <div class="voting-card ${selectedRating ? 'rated' : ''}" id="voting-card-${game.id}">
              <div class="voting-card-header">
                <span class="voting-game-title">${escapeHtml(game.title)}</span>
                <span class="badge badge-purple">Оцінка: <strong id="rating-label-${game.id}">${selectedRating ? selectedRating + ' / 5' : '—'}</strong></span>
              </div>
              <div class="rating-scale-container">
                ${[1, 2, 3, 4, 5].map(star => {
                  const isActive = selectedRating === star;
                  const info = RATING_INFO[star];
                  return `
                    <button type="button" 
                      class="rating-btn ${isActive ? 'active' : ''}" 
                      onclick="window.VoteApp.setRating('${game.id}', ${star})"
                      id="star-btn-${game.id}-${star}">
                      <span class="rating-val">${star} ⭐</span>
                      <span class="rating-desc">${info.label}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('');
      } else {
        // Just update existing card states
        games.forEach(game => {
          const selectedRating = state.userDraftVotes[game.id] || null;
          const card = document.getElementById(`voting-card-${game.id}`);
          const label = document.getElementById(`rating-label-${game.id}`);
          if (card) {
            if (selectedRating) card.classList.add('rated');
            else card.classList.remove('rated');
          }
          if (label) {
            label.textContent = selectedRating ? `${selectedRating} / 5` : '—';
          }
          for (let s = 1; s <= 5; s++) {
            const btn = document.getElementById(`star-btn-${game.id}-${s}`);
            if (btn) {
              if (selectedRating === s) btn.classList.add('active');
              else btn.classList.remove('active');
            }
          }
        });
      }
    }
  }

  function setRating(gameId, score) {
    state.userDraftVotes[gameId] = score;
    renderVoting();
  }

  async function handleSubmitVotes(e) {
    e.preventDefault();
    const games = state.roomData.games;
    const ratedCount = Object.keys(state.userDraftVotes).length;

    if (ratedCount === 0) {
      showToast('Будь ласка, оцініть хоча б одну гру!', 'error');
      return;
    }

    if (ratedCount < games.length) {
      if (!confirm(`Ви оцінили ${ratedCount} з ${games.length} ігор. Бажаєте надіслати голос зараз?`)) {
        return;
      }
    }

    try {
      el.btnSubmitVotes.disabled = true;
      el.btnSubmitVotes.textContent = 'Відправка...';

      const data = await apiRequest(`/api/rooms/${state.roomId}/vote`, 'POST', {
        client_id: state.clientId,
        votes: state.userDraftVotes,
      });

      state.roomData = data.room;
      state.hasSubmittedVote = true;
      renderCurrentState();
      showToast('Ваш голос враховано!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnSubmitVotes.disabled = false;
      el.btnSubmitVotes.innerHTML = '✅ Надіслати мій голос';
    }
  }

  async function handleForceFinishVote() {
    if (!confirm('Ви дійсно бажаєте завершити голосування зараз і підрахувати поточні результати?')) {
      return;
    }

    try {
      el.btnForceFinishVote.disabled = true;
      const data = await apiRequest(`/api/rooms/${state.roomId}/finish-vote`, 'POST', {
        client_id: state.clientId,
      });
      state.roomData = data.room;
      renderCurrentState();
      showToast('Голосування завершено!', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnForceFinishVote.disabled = false;
    }
  }

  // --- Results Rendering ---
  function renderResults() {
    const room = state.roomData;
    const results = room.results;
    if (!results) return;

    el.totalVotersLabel.textContent = `Всього голосувало гравців: ${results.total_voters}`;
    el.hostResultsControls.style.display = state.isHost ? 'flex' : 'none';

    // 1. Render Winners Podium
    const winners = results.winners || [];
    const isTie = results.is_tie;

    if (winners.length === 0) {
      el.winnersContainer.innerHTML = `
        <div class="winner-card">
          <div class="winner-trophy">🤔</div>
          <div class="winner-title">Немає голосів</div>
          <p class="text-muted">Жодної оцінки не було отримано під час цієї сесії.</p>
        </div>
      `;
    } else {
      let tieNoticeHtml = '';
      if (isTie) {
        tieNoticeHtml = `
          <div class="tie-banner">
            🎉 НІЧИЯ! Одразу кілька ігор набрали однаково найвищий бал (${winners[0].avg_score} ⭐)! Всі вони є переможцями:
          </div>
        `;
      }

      const winnerCardsHtml = winners.map((w, idx) => {
        return `
          <div class="winner-card">
            <div class="winner-trophy">${isTie ? '🎉' : '🏆'}</div>
            <div class="winner-badge">${isTie ? `Переможець #${idx + 1} (Нічия)` : 'Найбільш обраний варіант'}</div>
            <div class="winner-title">${escapeHtml(w.title)}</div>
            <div class="winner-stats">
              <div>Середній бал: <span class="winner-score-highlight">${w.avg_score} / 5.0</span></div>
              <div>Голосів: <strong>${w.vote_count}</strong></div>
              <div>Сума балів: <strong>${w.total_score}</strong></div>
            </div>
          </div>
        `;
      }).join('');

      el.winnersContainer.innerHTML = tieNoticeHtml + winnerCardsHtml;
    }

    // 2. Render Leaderboard List
    const leaderboard = results.leaderboard || [];
    el.leaderboardList.innerHTML = leaderboard.map((item, index) => {
      let medal = `#${index + 1}`;
      if (item.is_winner) medal = '🥇';
      else if (index === 1) medal = '🥈';
      else if (index === 2) medal = '🥉';

      return `
        <div class="leaderboard-item ${item.is_winner ? 'is-winner' : ''}">
          <div class="leaderboard-rank">${medal}</div>
          <div class="leaderboard-game-info">
            <div class="leaderboard-game-title">${escapeHtml(item.title)}</div>
            <div class="leaderboard-game-meta">Додав(ла): ${escapeHtml(item.added_by)} &bull; Проголосувало: ${item.vote_count} гравців</div>
          </div>
          <div class="leaderboard-score-box">
            <span class="score-badge">${item.avg_score} ⭐</span>
            <span class="small-text text-muted">(${item.total_score} балів)</span>
          </div>
        </div>
      `;
    }).join('');
  }

  async function handleResetRound(keepGames) {
    const actionText = keepGames
      ? 'Розпочати новий раунд голосування з цими ж іграми?'
      : 'Очистити список ігор і почати сесію з чистого аркуша?';

    if (!confirm(actionText)) return;

    try {
      const data = await apiRequest(`/api/rooms/${state.roomId}/reset`, 'POST', {
        client_id: state.clientId,
        keep_games: keepGames,
      });
      state.roomData = data.room;
      state.userDraftVotes = {};
      state.hasSubmittedVote = false;
      renderCurrentState();
      showToast('Сесію перезапущено!', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // --- Copy Invite Link ---
  function copyInviteLink() {
    if (!state.roomId) return;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('room', state.roomId);
    currentUrl.searchParams.set('server', state.serverUrl);

    navigator.clipboard.writeText(currentUrl.toString()).then(() => {
      showToast('Посилання на кімнату скопійовано в буфер обміну!', 'success');
    }).catch(() => {
      prompt('Скопіюйте це посилання:', currentUrl.toString());
    });
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose global methods for inline HTML onclick handlers
  window.VoteApp = {
    setRating,
    deleteGame,
    kickParticipant,
  };

  // Start on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();

