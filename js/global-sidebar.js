```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GoalCurrent Layout</title>

  <style>
    :root {
      --sidebar-open: 260px;
      --sidebar-collapsed: 76px;
      --blue-dark: #08245c;
      --blue-main: #123fba;
      --blue-soft: #eaf2ff;
      --text-main: #101827;
      --text-muted: #667085;
      --border: #d8e2f3;
      --white: #ffffff;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #eef6ff;
      color: var(--text-main);
    }

    .site-shell {
      display: flex;
      min-height: 100vh;
      width: 100%;
    }

    /* Sidebar sits inside normal page flow, not fixed */
    .sidebar {
      width: var(--sidebar-open);
      background: linear-gradient(180deg, var(--blue-dark), var(--blue-main));
      color: var(--white);
      transition: width 0.25s ease, opacity 0.25s ease;
      overflow: hidden;
      flex-shrink: 0;
    }

    .sidebar.is-collapsed {
      width: var(--sidebar-collapsed);
    }

    .sidebar.is-hidden {
      display: none;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }

    .brand {
      font-weight: 800;
      white-space: nowrap;
    }

    .sidebar.is-collapsed .brand,
    .sidebar.is-collapsed .nav-text {
      display: none;
    }

    .sidebar-actions {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      border: 0;
      background: rgba(255,255,255,0.14);
      color: white;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
    }

    .sidebar-nav {
      padding: 14px 10px;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      margin-bottom: 6px;
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      white-space: nowrap;
    }

    .sidebar-nav a:hover,
    .sidebar-nav a.active {
      background: rgba(255,255,255,0.16);
    }

    .nav-icon {
      width: 24px;
      text-align: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .main-area {
      flex: 1;
      min-width: 0;
      transition: all 0.25s ease;
    }

    .topbar {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #0d3187;
      color: white;
      padding: 16px 22px;
    }

    .show-sidebar-btn {
      display: none;
      border: 0;
      background: #ffffff;
      color: #0d3187;
      padding: 9px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 800;
    }

    .show-sidebar-btn.is-visible {
      display: inline-flex;
    }

    .page-content {
      padding: 28px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.4fr 0.8fr;
      gap: 22px;
      align-items: stretch;
    }

    .hosts-card,
    .games-counter-card {
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 10px 24px rgba(15, 50, 110, 0.08);
    }

    .hosts-layout {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 16px;
    }

    .host-box {
      background: var(--blue-soft);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      text-align: center;
      font-weight: 800;
    }

    .counter-number {
      font-size: clamp(42px, 8vw, 76px);
      font-weight: 900;
      color: var(--blue-main);
      line-height: 1;
      margin: 18px 0 8px;
    }

    .counter-label {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .counter-note {
      color: var(--text-muted);
      margin-bottom: 18px;
    }

    .primary-btn {
      border: 0;
      background: var(--blue-main);
      color: white;
      padding: 12px 18px;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
    }

    .primary-btn:hover {
      background: #0d3194;
    }

    @media (max-width: 900px) {
      .site-shell {
        flex-direction: column;
      }

      .sidebar,
      .sidebar.is-collapsed {
        width: 100%;
      }

      .sidebar.is-collapsed .brand,
      .sidebar.is-collapsed .nav-text {
        display: inline;
      }

      .sidebar-nav {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }

      .hero-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 560px) {
      .page-content {
        padding: 18px;
      }

      .sidebar-nav {
        grid-template-columns: 1fr;
      }

      .hosts-layout {
        grid-template-columns: 1fr;
      }

      .topbar {
        flex-wrap: wrap;
      }
    }
  </style>
</head>

<body>
  <div class="site-shell">

    <aside class="sidebar" id="globalSidebar" aria-label="Main navigation">
      <div class="sidebar-header">
        <div class="brand">GoalCurrent.live</div>

        <div class="sidebar-actions">
          <button class="icon-btn" id="collapseSidebarBtn" aria-label="Collapse sidebar">☰</button>
          <button class="icon-btn" id="closeSidebarBtn" aria-label="Close sidebar">×</button>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a href="/" class="active"><span class="nav-icon">🏠</span><span class="nav-text">Home</span></a>
        <a href="/live/"><span class="nav-icon">🔴</span><span class="nav-text">Live Scores</span></a>
        <a href="/worldcup2026/fixtures/"><span class="nav-icon">📅</span><span class="nav-text">Fixtures</span></a>
        <a href="/worldcup2026/groups/"><span class="nav-icon">🏆</span><span class="nav-text">Groups</span></a>
        <a href="/worldcup2026/standings/"><span class="nav-icon">📊</span><span class="nav-text">Standings</span></a>
        <a href="/worldcup2026/teams/"><span class="nav-icon">👕</span><span class="nav-text">Teams</span></a>
      </nav>
    </aside>

    <main class="main-area">
      <header class="topbar">
        <button class="show-sidebar-btn" id="showSidebarBtn">☰ Menu</button>
        <h1>World Cup 2026</h1>
      </header>

      <section class="page-content">
        <div class="hero-grid">

          <section class="hosts-card" aria-labelledby="hosts-title">
            <h2 id="hosts-title">3 Hosts</h2>
            <p>Canada, Mexico, and the United States host the expanded World Cup 2026 tournament.</p>

            <div class="hosts-layout">
              <div class="host-box">🇨🇦 Canada</div>
              <div class="host-box">🇲🇽 Mexico</div>
              <div class="host-box">🇺🇸 United States</div>
            </div>
          </section>

          <section class="games-counter-card" aria-labelledby="games-left-title">
            <h2 id="games-left-title">Games Left to Play</h2>
            <div class="counter-number" id="gamesLeftNumber">100</div>
            <div class="counter-label" id="gamesLeftLabel">100 Games Left</div>
            <p class="counter-note">Updates instantly when a match is marked as played.</p>

            <button class="primary-btn" id="simulateGameBtn">
              Test: Mark 1 Game Played
            </button>
          </section>

        </div>
      </section>
    </main>
  </div>

  <script>
    /*
      GLOBAL SIDEBAR LOGIC
      Use this same script globally on every page.
    */
    const sidebar = document.getElementById('globalSidebar');
    const collapseBtn = document.getElementById('collapseSidebarBtn');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const showBtn = document.getElementById('showSidebarBtn');

    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('is-collapsed');
    });

    closeBtn.addEventListener('click', () => {
      sidebar.classList.add('is-hidden');
      showBtn.classList.add('is-visible');
    });

    showBtn.addEventListener('click', () => {
      sidebar.classList.remove('is-hidden');
      showBtn.classList.remove('is-visible');
    });

    /*
      LIVE GAMES LEFT COUNTER
      Replace totalGames and playedGames with real API/data values later.
    */
    const totalGames = 100;
    let playedGames = 0;

    const gamesLeftNumber = document.getElementById('gamesLeftNumber');
    const gamesLeftLabel = document.getElementById('gamesLeftLabel');
    const simulateGameBtn = document.getElementById('simulateGameBtn');

    function getGamesLeft() {
      return Math.max(totalGames - playedGames, 0);
    }

    function updateGamesLeftUI() {
      const gamesLeft = getGamesLeft();

      gamesLeftNumber.textContent = gamesLeft;
      gamesLeftLabel.textContent =
        gamesLeft === 1 ? '1 Game Left' : `${gamesLeft} Games Left`;
    }

    function markGameAsPlayed() {
      if (playedGames < totalGames) {
        playedGames += 1;
        updateGamesLeftUI();
      }
    }

    simulateGameBtn.addEventListener('click', markGameAsPlayed);

    updateGamesLeftUI();
  </script>
</body>
</html>
```

