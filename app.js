/**
 * VoteForMP - Frontend Application
 * Multi-user Game Polling client with Ukrainian & English language support.
 */

(function () {
  'use strict';

  // --- Localization Dictionary ---
  const TRANSLATIONS = {
    ua: {
      doc_title: 'VoteForMP — Голосування за спільні ігри',
      logo_sub: 'Обирай гру разом',
      server_not_connected: 'Сервер: не підключено',
      server_label_prefix: 'Сервер: ',
      server_checking: 'Перевірка зв\'язку...',
      server_no_connection: 'Сервер: немає зв\'язку',
      server_test_success: '✅ З\'єднання успішне! Бекенд активний.',
      server_conn_established: 'З\'єднання з сервером встановлено!',
      server_settings_title: '🔌 Налаштування бекенд-сервера',
      server_settings_desc: 'Вкажіть адресу вашого Python-сервера (FastAPI). Вона зберігається у вашому браузері.',
      btn_test_connection: 'Перевірити з\'єднання',
      btn_save: 'Зберегти',
      server_hint_title: '💡 Підказка для GitHub Pages:',
      server_hint_p1: 'Якщо сайт відкритий через <code>https://...github.io</code>, сучасні браузери блокують запити до незахищеного <code>http://</code> (Mixed Content). Для гри онлайн запустіть безкоштовний тунель:',
      server_hint_p2: 'і вставте отримане <code>https://...</code> посилання вище.',
      err_mixed_content: 'Браузер блокує HTTP-запит із HTTPS-сторінки (Mixed Content). Використовуйте HTTPS адресу бекенда (через ngrok або cloudflared tunnel).',
      err_failed_to_fetch: 'Не вдалося з\'єднатися із сервером ({0}). Переконайтеся, що backend запущено.',
      err_server_error: 'Помилка сервера ({0})',
      hero_title: 'Спільний вибір гри для компанії',
      hero_subtitle: 'Створюйте сесію, додавайте варіанти ігор, ставте оцінки від -2 до +2 та знаходьте ідеальний спільний варіант за кілька хвилин!',
      label_player_name: 'Ваше ім\'я / нікнейм:',
      ph_player_name: 'Наприклад: GhostRider, Дмитро, Катя...',
      card_create_title: 'Створити нову сесію',
      card_create_desc: 'Станьте хостом, отримайте унікальний код кімнати та запросіть друзів.',
      btn_create_room: 'Створити кімнату',
      btn_creating: 'Створення...',
      card_join_title: 'Приєднатися до сесії',
      card_join_desc: 'Введіть 6-значний код кімнати, який вам надіслав друг.',
      ph_room_code: 'Код: ABCD12',
      btn_join_room: 'Приєднатися',
      btn_joining: 'Вхід...',
      warn_enter_name: 'Будь ласка, введіть ваше ім\'я або нікнейм!',
      warn_enter_code: 'Введіть код кімнати!',
      toast_room_created: 'Кімнату створено! Код: {0}',
      toast_room_joined: 'Успішно приєдналися до кімнати {0}!',
      badge_room: 'Кімната',
      btn_copy_invite: '📋 Скопіювати посилання',
      btn_leave: 'Вийти',
      lobby_games_title: '🎮 Список ігор для голосування',
      btn_import_list: '📥 Імпорт списку',
      btn_import_file: 'З файлу .txt',
      ph_game_title: 'Введіть назву гри (пошук / перевірка)...',
      share_session_title: '🔗 Поділитися сесією з друзями',
      share_session_desc: 'Це посилання автоматично містить поточну введену вище адресу сервера та код кімнати:',
      btn_copy_link: '📋 Скопіювати',
      ph_share_input: 'Створіть або увійдіть у кімнату',
      btn_google_title: 'Шукати цю гру в Google',
      feedback_already_in_list: '⚠️ "{0}" вже є в списку ігор!',
      feedback_matches_found: '🔍 Схожі ігри в списку ({0}): {1}',
      import_preview: 'Виявлено {0} рядків (нових: {1}, вже в списку: {2})',
      warn_no_new_games: 'Усі зазначені ігри вже додано до списку!',
      toast_share_copied: 'Посилання на сесію скопійовано! (Сервер: {0})',
      btn_bulk_add: '📥 Імпорт списку',
      btn_add_game: 'Додати',
      bulk_hint: 'Вставте кілька ігор (кожна з нового рядка):',
      btn_add_all: 'Додати всі',
      btn_cancel: 'Скасувати',
      empty_games: '🎮 Список порожній. Впишіть назву гри вище та натисніть "Додати"!',
      host_you_are_host: '👑 Ви Хост кімнати',
      host_role_prefix: 'Хост: ',
      you_badge: 'Ви',
      host_badge: '👑 Хост',
      host_status_empty: 'Додайте хоча б одну гру, щоб мати можливість розпочати голосування.',
      host_status_ready: 'Коли всі друзі приєднались і список ігор готовий, натискайте:',
      guest_status_wait: 'Очікуємо, поки хост запустить голосування... Ви можете додавати свої ігри у список!',
      btn_start_vote: '▶️ Почати голосування!',
      lobby_players_title: '👥 Гравці в кімнаті',
      toast_game_added: 'Гру "{0}" додано!',
      toast_games_added_bulk: 'Ігри додано!',
      confirm_delete_game: 'Видалити цю гру зі списку?',
      toast_game_deleted: 'Гру видалено.',
      confirm_kick_participant: 'Вилучити цього гравця з кімнати?',
      toast_participant_kicked: 'Гравця вилучено.',
      toast_vote_started: 'Голосування відкрито! Оцініть кожну гру.',
      voting_title: 'Оцініть кожну гру від -2 до +2 балів',
      voting_subtitle: 'Поставте оцінку: -2 — не хочу грати, +2 — дуже хочу!',
      voting_progress: 'Оцінено {0} із {1}',
      score_rating_prefix: 'Оцінка: ',
      btn_submit_votes: '✅ Надіслати мій голос',
      btn_submitting: 'Відправка...',
      warn_rate_at_least_one: 'Будь ласка, оцініть хоча б одну гру!',
      confirm_partial_votes: 'Ви оцінили {0} з {1} ігор. Бажаєте надіслати голос зараз?',
      toast_vote_submitted: 'Ваш голос враховано!',
      voted_success_title: 'Ваш голос успішно зараховано!',
      voted_waiting_others: 'Очікуємо, поки решта гравців завершить голосування...',
      voted_count_label: 'Проголосувало:',
      tracker_voted: 'Проголосував(ла)',
      tracker_voting: 'Обирає...',
      host_emergency_hint: 'Хтось затримався чи пішов AFK? Ви можете завершити голосування достроково:',
      btn_force_finish: '⚡ Завершити голосування зараз',
      confirm_force_finish: 'Ви дійсно бажаєте завершити голосування зараз і підрахувати поточні результати?',
      toast_vote_finished: 'Голосування завершено!',
      results_badge: 'Голосування завершено',
      results_title: '🏆 Результати вибору',
      results_no_votes_title: 'Немає голосів',
      results_no_votes_desc: 'Жодної оцінки не було отримано під час цієї сесії.',
      tie_banner: '🎉 НІЧИЯ! Одразу кілька ігор набрали однаково найвищий результат ({0} балів)! Всі вони є переможцями:',
      winner_badge_single: 'Найбільш обраний варіант',
      winner_badge_tie: 'Переможець #{0} (Нічия)',
      stat_score: 'Підсумковий бал:',
      stat_votes: 'Голосів:',
      leaderboard_title: '📊 Повна таблиця результатів',
      total_voters_text: 'Всього голосувало гравців: {0}',
      added_by_prefix: 'Додав(ла): ',
      unnamed_participant: 'Учасник',
      voted_players_suffix: 'гравців',
      pts_suffix: 'балів',
      confirm_restart_keep: 'Розпочати новий раунд голосування з цими ж іграми?',
      confirm_restart_clear: 'Очистити список ігор і почати сесію з чистого аркуша?',
      toast_session_reset: 'Сесію перезапущено!',
      btn_restart_round: '🔄 Почати новий раунд (з цими ж іграми)',
      btn_reset_all: '➕ Нове голосування (новий список)',
      btn_exit_menu: '🚪 Вийти в головне меню',
      toast_invite_copied: 'Посилання на кімнату скопійовано в буфер обміну!',
      prompt_copy_link: 'Скопіюйте це посилання:',
      footer_text: 'VoteForMP &bull; Швидкий вибір спільних ігор &bull; Python Backend & GitHub Pages',
      ratings: {
        '-2': { icon: '🛑', label: 'Не хочу (-2)' },
        '-1': { icon: '😕', label: 'Не дуже (-1)' },
        '0':  { icon: '😐', label: 'Зіграю (0)' },
        '1':  { icon: '👍', label: 'Хочу (+1)' },
        '2':  { icon: '🔥', label: 'Топ! (+2)' },
      }
    },
    en: {
      doc_title: 'VoteForMP — Group Game Voting',
      logo_sub: 'Pick a game together',
      server_not_connected: 'Server: disconnected',
      server_label_prefix: 'Server: ',
      server_checking: 'Checking connection...',
      server_no_connection: 'Server: no connection',
      server_test_success: '✅ Connection successful! Backend is online.',
      server_conn_established: 'Connection to server established!',
      server_settings_title: '🔌 Backend Server Settings',
      server_settings_desc: 'Specify your Python (FastAPI) server address. It is saved in your browser.',
      btn_test_connection: 'Test Connection',
      btn_save: 'Save',
      server_hint_title: '💡 Tip for GitHub Pages:',
      server_hint_p1: 'If the site is opened via <code>https://...github.io</code>, modern browsers block insecure <code>http://</code> requests (Mixed Content). For online play, run a free tunnel:',
      server_hint_p2: 'and paste the resulting <code>https://...</code> link above.',
      err_mixed_content: 'Browser blocked HTTP request from HTTPS page (Mixed Content). Please use an HTTPS backend URL (via ngrok or cloudflared tunnel).',
      err_failed_to_fetch: 'Could not connect to server ({0}). Please verify that backend is running.',
      err_server_error: 'Server error ({0})',
      hero_title: 'Choose the Perfect Game Together',
      hero_subtitle: 'Create a session, add game titles, rate each option from -2 to +2 points, and find the group favorite in minutes!',
      label_player_name: 'Your Name / Nickname:',
      ph_player_name: 'E.g., GhostRider, Alex, Kate...',
      card_create_title: 'Create New Session',
      card_create_desc: 'Become the host, get a unique room code, and invite your friends.',
      btn_create_room: 'Create Room',
      btn_creating: 'Creating...',
      card_join_title: 'Join a Session',
      card_join_desc: 'Enter the 6-character room code sent by your friend.',
      ph_room_code: 'Code: ABCD12',
      btn_join_room: 'Join',
      btn_joining: 'Joining...',
      warn_enter_name: 'Please enter your name or nickname!',
      warn_enter_code: 'Please enter the room code!',
      toast_room_created: 'Room created! Code: {0}',
      toast_room_joined: 'Successfully joined room {0}!',
      badge_room: 'Room',
      btn_copy_invite: '📋 Copy Invite Link',
      btn_leave: 'Leave',
      lobby_games_title: '🎮 Games for Voting',
      btn_import_list: '📥 Import List',
      btn_import_file: 'From .txt file',
      ph_game_title: 'Enter game title (search / duplicate check)...',
      share_session_title: '🔗 Share Session with Friends',
      share_session_desc: 'This link automatically uses the server address specified above and current room code:',
      btn_copy_link: '📋 Copy Link',
      ph_share_input: 'Create or join a room first',
      btn_google_title: 'Search this game on Google',
      feedback_already_in_list: '⚠️ "{0}" is already in the games list!',
      feedback_matches_found: '🔍 Matching games in list ({0}): {1}',
      import_preview: 'Found {0} items (new: {1}, already in list: {2})',
      warn_no_new_games: 'All specified games are already in the list!',
      toast_share_copied: 'Session link copied! (Server: {0})',
      btn_bulk_add: '📥 Import List',
      btn_add_game: 'Add',
      bulk_hint: 'Paste multiple games (one per line):',
      btn_add_all: 'Add All',
      btn_cancel: 'Cancel',
      empty_games: '🎮 The list is empty. Type a game title above and click "Add"!',
      host_you_are_host: '👑 You are the Host',
      host_role_prefix: 'Host: ',
      you_badge: 'You',
      host_badge: '👑 Host',
      host_status_empty: 'Add at least one game to be able to start voting.',
      host_status_ready: 'When all friends have joined and games are added, click:',
      guest_status_wait: 'Waiting for the host to start voting... You can add games to the list!',
      btn_start_vote: '▶️ Start Voting!',
      lobby_players_title: '👥 Players in Room',
      toast_game_added: 'Game "{0}" added!',
      toast_games_added_bulk: 'Games added!',
      confirm_delete_game: 'Remove this game from the list?',
      toast_game_deleted: 'Game removed.',
      confirm_kick_participant: 'Kick this player from the room?',
      toast_participant_kicked: 'Player removed.',
      toast_vote_started: 'Voting is open! Rate each game.',
      voting_title: 'Rate Each Game from -2 to +2 Points',
      voting_subtitle: 'Rate each option: -2 — don\'t want to play, +2 — really want to play!',
      voting_progress: 'Rated {0} of {1}',
      score_rating_prefix: 'Rating: ',
      btn_submit_votes: '✅ Submit My Votes',
      btn_submitting: 'Submitting...',
      warn_rate_at_least_one: 'Please rate at least one game!',
      confirm_partial_votes: 'You rated {0} of {1} games. Do you want to submit now?',
      toast_vote_submitted: 'Your votes have been submitted!',
      voted_success_title: 'Your vote has been submitted!',
      voted_waiting_others: 'Waiting for other players to finish voting...',
      voted_count_label: 'Voted:',
      tracker_voted: 'Voted',
      tracker_voting: 'Voting...',
      host_emergency_hint: 'Someone delayed or AFK? You can finish the vote early:',
      btn_force_finish: '⚡ Finish Voting Now',
      confirm_force_finish: 'Are you sure you want to finish voting now and calculate current results?',
      toast_vote_finished: 'Voting finished!',
      results_badge: 'Voting Completed',
      results_title: '🏆 Voting Results',
      results_no_votes_title: 'No Votes',
      results_no_votes_desc: 'No ratings were submitted during this session.',
      tie_banner: '🎉 TIE! Multiple games received the highest result ({0} pts)! They are all winners:',
      winner_badge_single: 'Most Picked Option',
      winner_badge_tie: 'Winner #{0} (Tie)',
      stat_score: 'Final score:',
      stat_votes: 'Votes:',
      leaderboard_title: '📊 Full Leaderboard',
      total_voters_text: 'Total players voted: {0}',
      added_by_prefix: 'Added by: ',
      unnamed_participant: 'Player',
      voted_players_suffix: 'players',
      pts_suffix: 'pts',
      confirm_restart_keep: 'Start a new voting round with the same games?',
      confirm_restart_clear: 'Clear game list and start fresh?',
      toast_session_reset: 'Session reset!',
      btn_restart_round: '🔄 New Round (Keep Games)',
      btn_reset_all: '➕ New Session (Clear Games)',
      btn_exit_menu: '🚪 Exit to Main Menu',
      toast_invite_copied: 'Invite link copied to clipboard!',
      prompt_copy_link: 'Copy this link:',
      footer_text: 'VoteForMP &bull; Easy game polling for groups &bull; Python Backend & GitHub Pages',
      ratings: {
        '-2': { icon: '🛑', label: 'Don\'t want (-2)' },
        '-1': { icon: '😕', label: 'Not really (-1)' },
        '0':  { icon: '😐', label: 'Neutral / OK (0)' },
        '1':  { icon: '👍', label: 'Would play (+1)' },
        '2':  { icon: '🔥', label: 'Must play! (+2)' },
      }
    }
  };

  // --- State ---
  const state = {
    lang: localStorage.getItem('vote_lang') || 'ua',
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

  function t(key, ...args) {
    const dict = TRANSLATIONS[state.lang] || TRANSLATIONS.ua;
    let val = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.ua[key] || key);
    if (typeof val === 'string' && args.length > 0) {
      args.forEach((arg, i) => {
        val = val.replace(new RegExp(`\\{${i}\\}`, 'g'), arg);
      });
    }
    return val;
  }

  function formatScoreSign(num) {
    if (num === null || num === undefined) return '0';
    if (typeof num === 'string') {
      if (num.startsWith('+') || num.startsWith('-')) return num;
      num = parseFloat(num);
    }
    if (isNaN(num)) return '0';
    return num > 0 ? `+${num}` : `${num}`;
  }

  function getRatingInfo(score) {
    const key = String(score);
    const dict = TRANSLATIONS[state.lang] || TRANSLATIONS.ua;
    return (dict.ratings && dict.ratings[key]) || TRANSLATIONS.ua.ratings[key] || { icon: '⭐', label: '' };
  }

  // --- DOM Elements ---
  const el = {
    pageTitle: document.getElementById('pageTitle'),
    btnLangUa: document.getElementById('btnLangUa'),
    btnLangEn: document.getElementById('btnLangEn'),

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
    shareSessionBox: document.getElementById('shareSessionBox'),
    shareRoomBadge: document.getElementById('shareRoomBadge'),
    shareUrlInput: document.getElementById('shareUrlInput'),
    btnCopyShareFromDrawer: document.getElementById('btnCopyShareFromDrawer'),
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
    gameSearchFeedback: document.getElementById('gameSearchFeedback'),
    btnAddGame: document.getElementById('btnAddGame'),
    btnToggleBulkAdd: document.getElementById('btnToggleBulkAdd'),
    bulkAddPanel: document.getElementById('bulkAddPanel'),
    bulkGamesInput: document.getElementById('bulkGamesInput'),
    importFileInput: document.getElementById('importFileInput'),
    bulkPreviewCount: document.getElementById('bulkPreviewCount'),
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
    // 1. Language Setup
    setLanguage(state.lang, false);

    // 2. Resolve server URL from URL param or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paramServer = urlParams.get('server');
    const paramRoom = urlParams.get('room');
    const paramLang = urlParams.get('lang');

    if (paramLang && (paramLang === 'ua' || paramLang === 'en')) {
      setLanguage(paramLang, false);
    }

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

    // 3. Set player name
    if (state.playerName) {
      el.playerNameInput.value = state.playerName;
    }

    // 4. Set room code from param if provided
    if (paramRoom) {
      el.roomCodeInput.value = paramRoom.toUpperCase();
    }

    // 5. Attach event listeners
    bindEvents();

    // 6. Check backend connectivity
    checkServerHealth(true);
  }

  function setLanguage(lang, reRender = true) {
    state.lang = (lang === 'en') ? 'en' : 'ua';
    localStorage.setItem('vote_lang', state.lang);
    document.documentElement.lang = state.lang === 'ua' ? 'uk' : 'en';

    // Update buttons active class
    if (el.btnLangUa && el.btnLangEn) {
      el.btnLangUa.classList.toggle('active', state.lang === 'ua');
      el.btnLangEn.classList.toggle('active', state.lang === 'en');
    }

    // Update document title
    if (el.pageTitle) {
      el.pageTitle.textContent = t('doc_title');
    }

    // Update all static data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      if (key) {
        elem.innerHTML = t(key);
      }
    });

    // Update all placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-placeholder');
      if (key) {
        elem.setAttribute('placeholder', t(key));
      }
    });

    updateServerPillDisplay();

    if (reRender && state.roomData) {
      renderCurrentState();
    }
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
    // Language Switcher
    if (el.btnLangUa) el.btnLangUa.addEventListener('click', () => setLanguage('ua'));
    if (el.btnLangEn) el.btnLangEn.addEventListener('click', () => setLanguage('en'));

    // Server Drawer
    el.btnToggleServerSettings.addEventListener('click', toggleServerDrawer);
    el.btnCloseServerSettings.addEventListener('click', toggleServerDrawer);
    el.btnTestServer.addEventListener('click', () => checkServerHealth(false));
    el.btnSaveServer.addEventListener('click', saveServerUrl);
    if (el.serverUrlInput) el.serverUrlInput.addEventListener('input', updateShareUrl);
    if (el.btnCopyShareFromDrawer) el.btnCopyShareFromDrawer.addEventListener('click', copyShareUrl);

    // Entry View
    el.btnCreateRoom.addEventListener('click', handleCreateRoom);
    el.btnJoinRoom.addEventListener('click', handleJoinRoom);
    el.roomCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleJoinRoom();
    });

    // Lobby View
    el.btnCopyInvite.addEventListener('click', copyShareUrl);
    el.btnLeaveRoom.addEventListener('click', leaveRoom);
    el.addGameForm.addEventListener('submit', handleAddGame);
    if (el.gameTitleInput) el.gameTitleInput.addEventListener('input', handleGameTitleSearch);
    el.btnToggleBulkAdd.addEventListener('click', () => {
      const isHidden = el.bulkAddPanel.style.display === 'none';
      el.bulkAddPanel.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        el.bulkGamesInput.focus();
        updateBulkPreview();
      }
    });
    if (el.bulkGamesInput) el.bulkGamesInput.addEventListener('input', updateBulkPreview);
    if (el.importFileInput) el.importFileInput.addEventListener('change', handleImportFileInput);
    el.btnCancelBulkGames.addEventListener('click', () => {
      el.bulkAddPanel.style.display = 'none';
      el.bulkGamesInput.value = '';
      if (el.bulkPreviewCount) el.bulkPreviewCount.textContent = '';
      if (el.importFileInput) el.importFileInput.value = '';
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
        const errorDetail = (data && data.detail) ? data.detail : t('err_server_error', response.status);
        throw new Error(errorDetail);
      }
      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        const isHttpsPage = window.location.protocol === 'https:';
        const isHttpServer = state.serverUrl.startsWith('http://');

        if (isHttpsPage && isHttpServer) {
          throw new Error(t('err_mixed_content'));
        } else {
          throw new Error(t('err_failed_to_fetch', state.serverUrl));
        }
      }
      throw err;
    }
  }

  // --- Server Management ---
  async function checkServerHealth(silent = false) {
    el.statusDot.className = 'status-dot checking';
    if (!silent) {
      el.serverTestResult.textContent = t('server_checking');
      el.serverTestResult.className = 'server-test-result';
    }

    try {
      const data = await apiRequest('/health');
      if (data && data.status === 'ok') {
        state.isConnected = true;
        el.statusDot.className = 'status-dot connected';
        updateServerPillDisplay();
        if (!silent) {
          el.serverTestResult.textContent = t('server_test_success');
          el.serverTestResult.className = 'server-test-result success';
          showToast(t('server_conn_established'), 'success');
        }
        return true;
      }
    } catch (err) {
      state.isConnected = false;
      el.statusDot.className = 'status-dot disconnected';
      el.serverLabel.textContent = t('server_no_connection');
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
    updateShareUrl();
    checkServerHealth(false);
  }

  function toggleServerDrawer() {
    const isHidden = el.serverDrawer.style.display === 'none';
    el.serverDrawer.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
      updateShareUrl();
    }
  }

  function getEffectiveServerUrl() {
    if (el.serverUrlInput && el.serverUrlInput.value.trim()) {
      return cleanUrl(el.serverUrlInput.value.trim());
    }
    return state.serverUrl || 'http://localhost:8000';
  }

  function updateShareUrl() {
    if (!el.shareUrlInput) return;
    const srv = getEffectiveServerUrl();
    if (!state.roomId) {
      el.shareUrlInput.value = '';
      if (el.shareRoomBadge) el.shareRoomBadge.textContent = `${t('badge_room')}: ------`;
      return;
    }
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('room', state.roomId);
    currentUrl.searchParams.set('server', srv);
    currentUrl.searchParams.set('lang', state.lang);
    el.shareUrlInput.value = currentUrl.toString();
    if (el.shareRoomBadge) el.shareRoomBadge.textContent = `${t('badge_room')}: ${state.roomId}`;
  }

  function copyShareUrl() {
    updateShareUrl();
    if (!state.roomId) {
      showToast(t('ph_share_input'), 'error');
      return;
    }
    const url = el.shareUrlInput ? el.shareUrlInput.value : '';
    const srv = getEffectiveServerUrl();
    navigator.clipboard.writeText(url).then(() => {
      showToast(t('toast_share_copied', srv), 'success');
    }).catch(() => {
      prompt(t('prompt_copy_link'), url);
    });
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
    if (state.isConnected) {
      el.serverLabel.textContent = `${t('server_label_prefix')}${formatServerDisplay(state.serverUrl)}`;
    } else {
      el.serverLabel.textContent = t('server_not_connected');
    }
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
      showToast(t('warn_enter_name'), 'error');
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
      el.btnCreateRoom.textContent = t('btn_creating');

      const data = await apiRequest('/api/rooms', 'POST', {
        host_name: name,
        client_id: state.clientId,
      });

      state.roomId = data.room_id;
      state.roomData = data.room;
      state.isHost = true;

      showToast(t('toast_room_created', state.roomId), 'success');
      enterRoom();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnCreateRoom.disabled = false;
      el.btnCreateRoom.innerHTML = `<span>${t('btn_create_room')}</span>`;
    }
  }

  async function handleJoinRoom() {
    const name = validatePlayerName();
    if (!name) return;

    const code = el.roomCodeInput.value.trim().toUpperCase();
    if (!code) {
      showToast(t('warn_enter_code'), 'error');
      el.roomCodeInput.focus();
      return;
    }

    try {
      el.btnJoinRoom.disabled = true;
      el.btnJoinRoom.textContent = t('btn_joining');

      const data = await apiRequest(`/api/rooms/${code}/join`, 'POST', {
        name: name,
        client_id: state.clientId,
      });

      state.roomId = code;
      state.roomData = data.room;
      state.isHost = data.room.is_viewer_host;

      showToast(t('toast_room_joined', code), 'success');
      enterRoom();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnJoinRoom.disabled = false;
      el.btnJoinRoom.innerHTML = `<span>${t('btn_join_room')}</span>`;
    }
  }

  function enterRoom() {
    updateShareUrl();
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
    updateShareUrl();
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
      el.roleBadge.textContent = t('host_you_are_host');
      el.roleBadge.className = 'badge badge-gold';
      el.hostStatusMsg.textContent = room.games.length === 0
        ? t('host_status_empty')
        : t('host_status_ready');
      el.btnStartVote.disabled = room.games.length === 0;
      el.btnStartVote.style.display = 'block';
    } else {
      el.hostControlPanel.style.display = 'block';
      el.roleBadge.textContent = `${t('host_role_prefix')}${room.host_name}`;
      el.roleBadge.className = 'badge badge-purple';
      el.hostStatusMsg.textContent = t('guest_status_wait');
      el.btnStartVote.style.display = 'none';
    }

    // Render games list
    if (room.games.length === 0) {
      el.lobbyGamesList.innerHTML = `
        <div class="empty-state">
          <p>${t('empty_games')}</p>
        </div>
      `;
    } else {
      el.lobbyGamesList.innerHTML = room.games.map(game => {
        const canDelete = state.isHost || game.added_by_id === state.clientId;
        return `
          <div class="game-item" id="game-item-${game.id}">
            <div class="game-item-info">
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
                <span class="game-item-title">${escapeHtml(game.title)}</span>
                <a href="https://www.google.com/search?q=${encodeURIComponent(game.title + ' game')}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-google-search" 
                   title="${t('btn_google_title')}">
                  🔍 Google
                </a>
              </div>
              <span class="game-item-author">${t('added_by_prefix')}${escapeHtml(game.added_by || t('unnamed_participant'))}</span>
            </div>
            ${canDelete ? `
              <button type="button" class="btn-delete-game" title="Delete" onclick="window.VoteApp.deleteGame('${game.id}')">
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
            ${p.is_you ? `<span class="badge badge-purple">${t('you_badge')}</span>` : ''}
            ${p.is_host ? `<span class="badge badge-gold">${t('host_badge')}</span>` : ''}
          </div>
          ${(state.isHost && !p.is_you) ? `
            <button type="button" class="btn-delete-game" title="Kick" onclick="window.VoteApp.kickParticipant('${p.id}')">
              ✖
            </button>
          ` : ''}
        </li>
      `;
    }).join('');

    // Re-apply search filter if user is actively searching
    if (el.gameTitleInput && el.gameTitleInput.value.trim()) {
      handleGameTitleSearch();
    }
  }

  function handleGameTitleSearch() {
    if (!el.gameTitleInput || !el.gameSearchFeedback) return;
    const query = el.gameTitleInput.value.trim().toLowerCase();
    const games = (state.roomData && state.roomData.games) || [];

    document.querySelectorAll('#lobbyGamesList .game-item').forEach(item => {
      item.classList.remove('highlighted');
    });

    if (!query) {
      el.gameSearchFeedback.style.display = 'none';
      el.gameSearchFeedback.className = 'game-search-feedback';
      el.gameSearchFeedback.innerHTML = '';
      return;
    }

    const exactMatch = games.find(g => g.title.toLowerCase().trim() === query);
    const partialMatches = games.filter(g => g.title.toLowerCase().includes(query));

    partialMatches.forEach(g => {
      const itemElem = document.getElementById(`game-item-${g.id}`);
      if (itemElem) itemElem.classList.add('highlighted');
    });

    if (exactMatch) {
      el.gameSearchFeedback.className = 'game-search-feedback duplicate';
      el.gameSearchFeedback.style.display = 'flex';
      el.gameSearchFeedback.innerHTML = t('feedback_already_in_list', escapeHtml(exactMatch.title));
    } else if (partialMatches.length > 0) {
      el.gameSearchFeedback.className = 'game-search-feedback partial';
      el.gameSearchFeedback.style.display = 'flex';
      const titles = partialMatches.map(g => `<strong>${escapeHtml(g.title)}</strong>`).join(', ');
      el.gameSearchFeedback.innerHTML = t('feedback_matches_found', partialMatches.length, titles);
    } else {
      el.gameSearchFeedback.style.display = 'none';
      el.gameSearchFeedback.className = 'game-search-feedback';
      el.gameSearchFeedback.innerHTML = '';
    }
  }

  function updateBulkPreview() {
    if (!el.bulkGamesInput || !el.bulkPreviewCount) return;
    const raw = el.bulkGamesInput.value;
    const lines = raw.split('\n').map(s => s.trim()).filter(Boolean);
    if (lines.length === 0) {
      el.bulkPreviewCount.textContent = '';
      return;
    }
    const existingSet = new Set(((state.roomData && state.roomData.games) || []).map(g => g.title.toLowerCase().trim()));
    let newCount = 0;
    let dupCount = 0;
    const seen = new Set();
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (existingSet.has(lower) || seen.has(lower)) {
        dupCount++;
      } else {
        newCount++;
        seen.add(lower);
      }
    });
    el.bulkPreviewCount.textContent = t('import_preview', lines.length, newCount, dupCount);
  }

  function handleImportFileInput(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result || '';
      el.bulkGamesInput.value = text;
      updateBulkPreview();
    };
    reader.readAsText(file);
  }

  async function handleAddGame(e) {
    e.preventDefault();
    const title = el.gameTitleInput.value.trim();
    if (!title) return;

    // Duplicate check
    const existing = (state.roomData && state.roomData.games || []).find(g => g.title.toLowerCase().trim() === title.toLowerCase());
    if (existing) {
      showToast(t('feedback_already_in_list', existing.title), 'error');
      if (el.gameSearchFeedback) {
        el.gameSearchFeedback.className = 'game-search-feedback duplicate';
        el.gameSearchFeedback.style.display = 'flex';
        el.gameSearchFeedback.innerHTML = t('feedback_already_in_list', escapeHtml(existing.title));
      }
      return;
    }

    try {
      el.btnAddGame.disabled = true;
      const data = await apiRequest(`/api/rooms/${state.roomId}/games`, 'POST', {
        client_id: state.clientId,
        games: [title],
      });
      el.gameTitleInput.value = '';
      if (el.gameSearchFeedback) {
        el.gameSearchFeedback.style.display = 'none';
        el.gameSearchFeedback.innerHTML = '';
      }
      state.roomData = data.room;
      renderLobby();
      showToast(t('toast_game_added', title), 'success');
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

    // Filter out duplicates
    const existingSet = new Set(((state.roomData && state.roomData.games) || []).map(g => g.title.toLowerCase().trim()));
    const uniqueToSubmit = [];
    const seen = new Set();
    for (const title of list) {
      const lower = title.toLowerCase();
      if (!existingSet.has(lower) && !seen.has(lower)) {
        seen.add(lower);
        uniqueToSubmit.push(title);
      }
    }

    if (uniqueToSubmit.length === 0) {
      showToast(t('warn_no_new_games'), 'info');
      return;
    }

    try {
      el.btnSubmitBulkGames.disabled = true;
      const data = await apiRequest(`/api/rooms/${state.roomId}/games`, 'POST', {
        client_id: state.clientId,
        games: uniqueToSubmit,
      });
      el.bulkGamesInput.value = '';
      if (el.bulkPreviewCount) el.bulkPreviewCount.textContent = '';
      if (el.importFileInput) el.importFileInput.value = '';
      el.bulkAddPanel.style.display = 'none';
      state.roomData = data.room;
      renderLobby();
      showToast(t('toast_games_added_bulk'), 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnSubmitBulkGames.disabled = false;
    }
  }

  async function deleteGame(gameId) {
    if (!confirm(t('confirm_delete_game'))) return;
    try {
      const data = await apiRequest(`/api/rooms/${state.roomId}/games/${gameId}?client_id=${state.clientId}`, 'DELETE');
      state.roomData = data.room;
      renderLobby();
      showToast(t('toast_game_deleted'), 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function kickParticipant(participantId) {
    if (!confirm(t('confirm_kick_participant'))) return;
    try {
      const data = await apiRequest(`/api/rooms/${state.roomId}/participants/${participantId}?client_id=${state.clientId}`, 'DELETE');
      state.roomData = data.room;
      renderLobby();
      showToast(t('toast_participant_kicked'), 'info');
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
      showToast(t('toast_vote_started'), 'success');
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
      el.votingForm.style.display = 'none';
      el.votedWaitingState.style.display = 'block';

      el.votedCountLabel.textContent = `${room.voted_count} / ${room.total_participants}`;
      const percentage = room.total_participants > 0 ? (room.voted_count / room.total_participants) * 100 : 0;
      el.votedProgressBar.style.width = `${percentage}%`;

      el.participantsVoteTracker.innerHTML = room.participants.map(p => {
        return `
          <div class="tracker-item ${p.has_voted ? 'voted' : ''}">
            <span>${p.has_voted ? '✅' : '⏳'}</span>
            <strong>${escapeHtml(p.name)}</strong>
            <span class="small-text">${p.has_voted ? t('tracker_voted') : t('tracker_voting')}</span>
          </div>
        `;
      }).join('');

      el.hostEmergencyAction.style.display = state.isHost ? 'block' : 'none';
    } else {
      el.votingForm.style.display = 'block';
      el.votedWaitingState.style.display = 'none';

      const games = room.games;
      const totalGames = games.length;
      const ratedCount = Object.keys(state.userDraftVotes).length;
      el.votingProgressText.textContent = t('voting_progress', ratedCount, totalGames);

      // Render cards with current locale ratings (-2 to +2 scale)
      const scaleValues = [-2, -1, 0, 1, 2];
      el.votingGamesContainer.innerHTML = games.map(game => {
        const selectedRating = state.userDraftVotes[game.id] !== undefined ? state.userDraftVotes[game.id] : null;
        const ratingLabel = selectedRating !== null ? formatScoreSign(selectedRating) : '—';
        return `
          <div class="voting-card ${selectedRating !== null ? 'rated' : ''}" id="voting-card-${game.id}">
            <div class="voting-card-header">
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
                <span class="voting-game-title">${escapeHtml(game.title)}</span>
                <a href="https://www.google.com/search?q=${encodeURIComponent(game.title + ' game')}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-google-search" 
                   title="${t('btn_google_title')}">
                  🔍 Google
                </a>
              </div>
              <span class="badge badge-purple">${t('score_rating_prefix')}<strong id="rating-label-${game.id}">${ratingLabel}</strong></span>
            </div>
            <div class="rating-scale-container">
              ${scaleValues.map(val => {
                const isActive = selectedRating === val;
                const info = getRatingInfo(val);
                const displayVal = formatScoreSign(val);
                const typeClass = val < 0 ? 'rating-btn-neg' : (val > 0 ? 'rating-btn-pos' : 'rating-btn-zero');
                return `
                  <button type="button" 
                    class="rating-btn ${typeClass} ${isActive ? 'active' : ''}" 
                    onclick="window.VoteApp.setRating('${game.id}', ${val})"
                    id="star-btn-${game.id}-${val}">
                    <span class="rating-val">${info.icon} ${displayVal}</span>
                    <span class="rating-desc">${info.label}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
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
      showToast(t('warn_rate_at_least_one'), 'error');
      return;
    }

    if (ratedCount < games.length) {
      if (!confirm(t('confirm_partial_votes', ratedCount, games.length))) {
        return;
      }
    }

    try {
      el.btnSubmitVotes.disabled = true;
      el.btnSubmitVotes.textContent = t('btn_submitting');

      const data = await apiRequest(`/api/rooms/${state.roomId}/vote`, 'POST', {
        client_id: state.clientId,
        votes: state.userDraftVotes,
      });

      state.roomData = data.room;
      state.hasSubmittedVote = true;
      renderCurrentState();
      showToast(t('toast_vote_submitted'), 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnSubmitVotes.disabled = false;
      el.btnSubmitVotes.innerHTML = `<span>${t('btn_submit_votes')}</span>`;
    }
  }

  async function handleForceFinishVote() {
    if (!confirm(t('confirm_force_finish'))) {
      return;
    }

    try {
      el.btnForceFinishVote.disabled = true;
      const data = await apiRequest(`/api/rooms/${state.roomId}/finish-vote`, 'POST', {
        client_id: state.clientId,
      });
      state.roomData = data.room;
      renderCurrentState();
      showToast(t('toast_vote_finished'), 'info');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.btnForceFinishVote.disabled = false;
    }
  }

  function renderVoterTagsHtml(voterTags) {
    if (!voterTags || voterTags.length === 0) return '';
    const tagsHtml = voterTags.map(vt => {
      const typeClass = vt.rating < 0 ? 'voter-tag-neg' : (vt.rating > 0 ? 'voter-tag-pos' : 'voter-tag-zero');
      const info = getRatingInfo(vt.rating);
      const icon = info ? info.icon : '';
      return `
        <span class="voter-tag ${typeClass}" title="${escapeHtml(vt.name)}: ${vt.formatted_rating}">
          <span class="voter-tag-name">${escapeHtml(vt.name)}:</span>
          <span class="voter-tag-score">${icon} ${vt.formatted_rating}</span>
        </span>
      `;
    }).join('');
    return `<div class="voter-tags-container">${tagsHtml}</div>`;
  }

  // --- Results Rendering ---
  function renderResults() {
    const room = state.roomData;
    const results = room.results;
    if (!results) return;

    el.totalVotersLabel.textContent = t('total_voters_text', results.total_voters);
    el.hostResultsControls.style.display = state.isHost ? 'flex' : 'none';

    // 1. Render Winners Podium
    const winners = results.winners || [];
    const isTie = results.is_tie;

    if (winners.length === 0) {
      el.winnersContainer.innerHTML = `
        <div class="winner-card">
          <div class="winner-trophy">🤔</div>
          <div class="winner-title">${t('results_no_votes_title')}</div>
          <p class="text-muted">${t('results_no_votes_desc')}</p>
        </div>
      `;
    } else {
      let tieNoticeHtml = '';
      if (isTie) {
        const topScoreFormatted = winners[0].formatted_score || formatScoreSign(winners[0].score || winners[0].total_score);
        tieNoticeHtml = `
          <div class="tie-banner">
            ${t('tie_banner', topScoreFormatted)}
          </div>
        `;
      }

      const winnerCardsHtml = winners.map((w, idx) => {
        const scoreStr = w.formatted_score || formatScoreSign(w.score || w.total_score);
        return `
          <div class="winner-card">
            <div class="winner-trophy">${isTie ? '🎉' : '🏆'}</div>
            <div class="winner-badge">${isTie ? t('winner_badge_tie', idx + 1) : t('winner_badge_single')}</div>
            <div class="winner-title">${escapeHtml(w.title)}</div>
            <div class="winner-stats">
              <div>${t('stat_score')} <span class="winner-score-highlight">${scoreStr} ${t('pts_suffix')}</span></div>
              <div>${t('stat_votes')} <strong>${w.vote_count}</strong></div>
            </div>
            ${renderVoterTagsHtml(w.voter_tags)}
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

      const scoreStr = item.formatted_score || formatScoreSign(item.score || item.total_score);
      return `
        <div class="leaderboard-item ${item.is_winner ? 'is-winner' : ''}">
          <div class="leaderboard-rank">${medal}</div>
          <div class="leaderboard-game-info">
            <div class="leaderboard-game-title">${escapeHtml(item.title)}</div>
            <div class="leaderboard-game-meta">${t('added_by_prefix')}${escapeHtml(item.added_by)} &bull; ${item.vote_count} ${t('voted_players_suffix')}</div>
            ${renderVoterTagsHtml(item.voter_tags)}
          </div>
          <div class="leaderboard-score-box">
            <span class="score-badge">${scoreStr} ${t('pts_suffix')}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  async function handleResetRound(keepGames) {
    const actionText = keepGames
      ? t('confirm_restart_keep')
      : t('confirm_restart_clear');

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
      showToast(t('toast_session_reset'), 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // --- Copy Invite Link ---
  function copyInviteLink() {
    copyShareUrl();
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
    setLanguage,
  };

  // Start on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
