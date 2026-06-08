/* ============================================
   GOALCURRENT.LIVE — World Cup 2026 Engine
   Replacement file: /js/gc-wc26.js
   Purpose:
   - No two-letter initials shown beside teams
   - Small clear flags + Apple-style UI support
   - Groups, teams, fixtures, standings, bracket, venues, news, favourites
   - Safe shared sidebar rebuild with Home + WC26 + Premier League + UCL
   ============================================ */

const WC26 = {
  groups: {
    A: [["🇲🇽","Mexico","MX"],["🇿🇦","South Africa","ZA"],["🇰🇷","South Korea","KR"],["🇨🇿","Czech Republic","CZ"]],
    B: [["🇨🇦","Canada","CA"],["🇧🇦","Bosnia & Herzegovina","BA"],["🇶🇦","Qatar","QA"],["🇨🇭","Switzerland","CH"]],
    C: [["🇧🇷","Brazil","BR"],["🇲🇦","Morocco","MA"],["🇭🇹","Haiti","HT"],["🏴","Scotland","SCO"]],
    D: [["🇺🇸","USA","US"],["🇵🇾","Paraguay","PY"],["🇦🇺","Australia","AU"],["🇹🇷","Turkey","TR"]],
    E: [["🇩🇪","Germany","DE"],["🇨🇼","Curaçao","CW"],["🇨🇮","Côte d’Ivoire","CI"],["🇪🇨","Ecuador","EC"]],
    F: [["🇳🇱","Netherlands","NL"],["🇯🇵","Japan","JP"],["🇸🇪","Sweden","SE"],["🇹🇳","Tunisia","TN"]],
    G: [["🇧🇪","Belgium","BE"],["🇪🇬","Egypt","EG"],["🇮🇷","Iran","IR"],["🇳🇿","New Zealand","NZ"]],
    H: [["🇪🇸","Spain","ES"],["🇨🇻","Cape Verde","CV"],["🇸🇦","Saudi Arabia","SA"],["🇺🇾","Uruguay","UY"]],
    I: [["🇫🇷","France","FR"],["🇸🇳","Senegal","SN"],["🇮🇶","Iraq","IQ"],["🇳🇴","Norway","NO"]],
    J: [["🇦🇷","Argentina","AR"],["🇩🇿","Algeria","DZ"],["🇦🇹","Austria","AT"],["🇯🇴","Jordan","JO"]],
    K: [["🇵🇹","Portugal","PT"],["🇨🇩","DR Congo","CD"],["🇺🇿","Uzbekistan","UZ"],["🇨🇴","Colombia","CO"]],
    L: [["🏴","England","EN"],["🇭🇷","Croatia","HR"],["🇬🇭","Ghana","GH"],["🇵🇦","Panama","PA"]]
  },

  venues: [
    ["🇺🇸","MetLife Stadium","New York/New Jersey","USA","82,500","Final venue","8"],
    ["🇺🇸","Rose Bowl","Los Angeles","USA","92,542","Historic World Cup final venue","8"],
    ["🇺🇸","SoFi Stadium","Los Angeles","USA","70,240","Modern indoor/outdoor stadium","7"],
    ["🇺🇸","AT&T Stadium","Dallas","USA","80,000","Major knockout venue","8"],
    ["🇺🇸","Levi’s Stadium","San Francisco Bay Area","USA","68,500","West Coast venue","7"],
    ["🇺🇸","Hard Rock Stadium","Miami","USA","65,326","Florida venue","7"],
    ["🇺🇸","Gillette Stadium","Boston","USA","65,878","Group-stage venue","7"],
    ["🇺🇸","Lincoln Financial Field","Philadelphia","USA","69,796","East Coast venue","6"],
    ["🇺🇸","NRG Stadium","Houston","USA","72,220","Texas venue","7"],
    ["🇺🇸","Arrowhead Stadium","Kansas City","USA","76,416","High-atmosphere venue","6"],
    ["🇺🇸","Lumen Field","Seattle","USA","68,740","Pacific Northwest venue","6"],
    ["🇲🇽","Estadio Azteca","Mexico City","Mexico","87,523","Opening match venue","5"],
    ["🇲🇽","Estadio Akron","Guadalajara","Mexico","48,071","Mexico group venue","4"],
    ["🇲🇽","Estadio BBVA","Monterrey","Mexico","53,500","Northern Mexico venue","4"],
    ["🇨🇦","BMO Field","Toronto","Canada","45,500","Canada opening venue","6"],
    ["🇨🇦","BC Place","Vancouver","Canada","54,500","West Canada venue","7"]
  ],

  fixtures: [
    ["2026-06-11T20:00:00+01:00","A","Mexico","South Africa","Estadio Azteca","Opening match"],
    ["2026-06-12T03:00:00+01:00","A","South Korea","Czech Republic","TBD","Group match"],
    ["2026-06-12T20:00:00+01:00","B","Canada","Bosnia & Herzegovina","BMO Field","Group match"],
    ["2026-06-13T00:00:00+01:00","B","Qatar","Switzerland","TBD","Group match"],
    ["2026-06-14T00:00:00+01:00","C","Haiti","Scotland","Boston","Group match"],
    ["2026-06-14T18:00:00+01:00","E","Germany","Curaçao","Houston","Group match"],
    ["2026-06-15T20:00:00+01:00","D","USA","Paraguay","Los Angeles","Group match"],
    ["2026-06-16T18:00:00+01:00","J","Argentina","Algeria","TBD","Group match"]
  ]
};

WC26.teams = Object.entries(WC26.groups)
  .flatMap(([group, teams]) => teams.map(([flag, name, code]) => ({ flag, name, code, group })))
  .sort((a, b) => a.name.localeCompare(b.name));

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escAttr(value) {
  return escapeHtml(value);
}

function flagFor(name) {
  const team = WC26.teams.find((item) => item.name === name);
  return team ? team.flag : "🏳️";
}

/* Correct flag renderer.
   Important: this does NOT render MX / ZA / KR / CZ anywhere. */
function flagImg(name, code, emoji) {
  const fallback = emoji || flagFor(name);
  return `<span class="flag-wrap" title="${escapeHtml(name)}"><span class="flag-emoji-fallback" aria-hidden="true">${fallback}</span></span>`;
}

function openSide() {
  $("#side")?.classList.add("open");
  $("#shade")?.classList.add("show");
}

function closeSide() {
  $("#side")?.classList.remove("open");
  $("#shade")?.classList.remove("show");
}

function renderStandardSidebar() {
  const side = $("#side");
  if (!side) return;

  const current = location.pathname;
  const active = (path) => current === path || current.startsWith(path + "/") ? "active" : "";

  side.innerHTML = `
    <button id="closeSide" class="close" type="button">Close</button>

    <h3>MAIN MENU</h3>
    <a class="home-main ${current === "/" ? "active" : ""}" href="/">🏠 Home</a>
    <a href="/worldcup2026/fixtures/">🔴 Live Scores</a>
    <a href="/worldcup2026/fixtures/">🗓️ Today Fixtures</a>
    <a href="/worldcup2026/news/">📰 Latest News</a>

    <h3>WORLD CUP 2026</h3>
    <a class="${active("/worldcup2026")}" href="/worldcup2026/">📋 Overview</a>
    <a href="/worldcup2026/groups/">🔢 Groups</a>
    <a href="/worldcup2026/fixtures/">🗓️ Fixtures</a>
    <a href="/worldcup2026/standings/">📊 Standings</a>
    <a href="/worldcup2026/bracket/">🏆 Bracket</a>
    <a href="/worldcup2026/venues/">🏟️ Venues</a>
    <a href="/worldcup2026/teams/">👕 Teams</a>
    <a href="/worldcup2026/news/">📰 News</a>
    <a href="/worldcup2026/countdown/">⌛ Countdown</a>
    <a href="/worldcup2026/favourites/">⭐ Favourites</a>

    <h3>PREMIER LEAGUE</h3>
    <a href="/premier-league/">⚽ Overview</a>
    <a href="/premier-league/fixtures/">🗓️ Fixtures</a>
    <a href="/premier-league/standings/">📊 Standings</a>
    <a href="/premier-league/teams/">👕 Teams</a>
    <a href="/premier-league/news/">📰 News</a>

    <h3>UEFA CHAMPIONS LEAGUE</h3>
    <a href="/ucl/">🏆 Overview</a>
    <a href="/ucl/fixtures/">🗓️ Fixtures</a>
    <a href="/ucl/standings/">📊 Standings</a>
    <a href="/ucl/teams/">👕 Teams</a>
    <a href="/ucl/news/">📰 News</a>
  `;

  $("#closeSide")?.addEventListener("click", closeSide);
}

function favs() {
  try {
    return JSON.parse(localStorage.getItem("wc26Favs") || '{"teams":[],"matches":[],"groups":[]}');
  } catch {
    return { teams: [], matches: [], groups: [] };
  }
}

function saveFavs(data) {
  localStorage.setItem("wc26Favs", JSON.stringify(data));
  updateFavButtons();
}

function toggleFav(type, id) {
  const data = favs();
  if (!data[type]) data[type] = [];
  const index = data[type].indexOf(id);
  if (index >= 0) data[type].splice(index, 1);
  else data[type].push(id);
  saveFavs(data);
  if (location.pathname.includes("/favourites/")) renderFavourites();
}

function removeFav(type, id) {
  const data = favs();
  if (!data[type]) data[type] = [];
  data[type] = data[type].filter((item) => item !== id);
  saveFavs(data);
  renderFavourites();
}

function clearFav(type) {
  const data = favs();
  if (type === "all") {
    data.teams = [];
    data.matches = [];
    data.groups = [];
  } else {
    data[type] = [];
  }
  saveFavs(data);
  renderFavourites();
}

function updateFavButtons() {
  const data = favs();
  $$("[data-fav]").forEach((button) => {
    const [type, id] = button.dataset.fav.split(":");
    const selected = (data[type] || []).includes(id);
    button.classList.toggle("active", selected);
    button.textContent = selected ? "★" : "☆";
    button.setAttribute("aria-label", selected ? "Remove from favourites" : "Add to favourites");
  });
}

function groupNav(active) {
  return `<div class="group-nav">${Object.keys(WC26.groups)
    .map((group) => `<a class="${group === active ? "active" : ""}" href="/worldcup2026/groups/group-${group.toLowerCase()}/">Group ${group}</a>`)
    .join("")}</div>`;
}

function teamRow(team) {
  const [flag, name, code] = team;
  return `
    <div class="team-row">
      ${flagImg(name, code, flag)}
      <strong>${escapeHtml(name)}</strong>
      <button class="fav" data-fav="teams:${escAttr(name)}" onclick="toggleFav('teams','${escAttr(name)}')" type="button">☆</button>
    </div>
  `;
}

function renderGroups() {
  const el = $("#groupsGrid");
  if (!el) return;

  el.innerHTML = Object.entries(WC26.groups)
    .map(([group, teams]) => `
      <article class="card group-card">
        <h3>Group ${group} <button class="fav" data-fav="groups:${group}" onclick="toggleFav('groups','${group}')" type="button">☆</button></h3>
        ${teams.map(teamRow).join("")}
        <a class="status" href="/worldcup2026/groups/group-${group.toLowerCase()}/">Open Group ${group} →</a>
      </article>
    `)
    .join("");

  updateFavButtons();
}

function renderGroupPage(group) {
  const el = $("#groupPage");
  if (!el) return;

  const teams = WC26.groups[group] || [];
  const fixtures = WC26.fixtures.filter((match) => match[1] === group);

  el.innerHTML = `
    ${groupNav(group)}
    <div class="grid grid-2">
      <section class="card">
        <h3>Teams</h3>
        ${teams.map(teamRow).join("")}
      </section>
      <section class="card">
        <h3>Fixtures</h3>
        ${fixtures.map(matchCard).join("") || '<div class="empty">Fixtures to be confirmed.</div>'}
      </section>
    </div>
  `;

  updateFavButtons();
}

function renderTeams() {
  const el = $("#teamsGrid");
  if (!el) return;

  const query = ($("#teamSearch")?.value || "").toLowerCase();
  const group = $("#teamGroup")?.value || "";

  const teams = WC26.teams.filter((team) =>
    (!query || team.name.toLowerCase().includes(query)) &&
    (!group || team.group === group)
  );

  el.innerHTML = teams
    .map((team) => `
      <article class="card team-card" onclick="openTeam('${escAttr(team.name)}')">
        <div class="team-flag-large">${flagImg(team.name, team.code, team.flag)}</div>
        <div class="team-name">${escapeHtml(team.name)}</div>
        <div><span class="badge">Group ${team.group}</span></div>
        <p class="muted">Click for squad, fixtures, news and team profile.</p>
        <button class="fav" data-fav="teams:${escAttr(team.name)}" onclick="event.stopPropagation();toggleFav('teams','${escAttr(team.name)}')" type="button">☆</button>
      </article>
    `)
    .join("");

  updateFavButtons();
}

function matchStatus(dateTime) {
  const now = new Date();
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + 115 * 60000);

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "LIVE";
  return "Full-time";
}

function fmt(dateTime) {
  return new Date(dateTime).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function matchId(match) {
  return slug(`${match[2]}-${match[3]}-${match[0].slice(0, 10)}`);
}

function matchCard(match) {
  const status = matchStatus(match[0]);
  return `
    <article class="card match-card" onclick="openMatch('${matchId(match)}')">
      <div>
        <strong>${fmt(match[0])}</strong><br>
        <span class="muted">Group ${match[1]} · ${escapeHtml(match[4])}</span>
      </div>
      <div class="fixture-teams">
        <span class="fixture-team">${flagImg(match[2])}<strong>${escapeHtml(match[2])}</strong></span>
        <span class="vs">vs</span>
        <span class="fixture-team">${flagImg(match[3])}<strong>${escapeHtml(match[3])}</strong></span>
        <br><b>${escapeHtml(match[5])}</b>
      </div>
      <div class="status ${status === "LIVE" ? "live" : ""}">${status}</div>
      <button class="fav" data-fav="matches:${matchId(match)}" onclick="event.stopPropagation();toggleFav('matches','${matchId(match)}')" type="button">☆</button>
    </article>
  `;
}

function renderFixtures() {
  const el = $("#fixturesList");
  if (!el) return;

  const query = ($("#fixtureSearch")?.value || "").toLowerCase();
  const group = $("#fixtureGroup")?.value || "";
  const day = $("#fixtureDate")?.value || "";

  const matches = WC26.fixtures.filter((match) =>
    (!query || `${match[2]} ${match[3]} ${match[4]} ${match[5]}`.toLowerCase().includes(query)) &&
    (!group || match[1] === group) &&
    (!day || match[0].slice(0, 10) === day)
  );

  el.innerHTML = matches.map(matchCard).join("") || '<div class="empty">No fixtures match this search/date.</div>';
  updateFavButtons();
}

function renderStandings() {
  const el = $("#standings");
  if (!el) return;

  el.innerHTML = Object.entries(WC26.groups)
    .map(([group, teams]) => `
      <section class="card">
        <h3>Group ${group} <a class="badge" href="/worldcup2026/groups/group-${group.toLowerCase()}/">View Group →</a></h3>
        <table class="stand-table">
          <thead>
            <tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          </thead>
          <tbody>
            ${teams.map(([flag, name, code]) => `
              <tr>
                <td>${flagImg(name, code, flag)} <strong>${escapeHtml(name)}</strong></td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </section>
    `)
    .join("");
}

function renderBracket() {
  const el = $("#bracket");
  if (!el) return;

  const rounds = [["Round of 32", 16], ["Round of 16", 8], ["Quarter-finals", 4], ["Semi-finals / Final", 3]];

  el.innerHTML = rounds
    .map(([round, count]) => `
      <div class="bracket-col">
        <h3>${round}</h3>
        ${Array.from({ length: count }, (_, index) => `
          <article class="card bracket-match" onclick="openBracket('${round}','${index + 1}')">
            <strong>Match ${index + 1}</strong><br>
            <span class="muted">TBD vs TBD</span><br>
            <span class="badge">Clickable details</span>
          </article>
        `).join("")}
      </div>
    `)
    .join("");
}

function renderVenues() {
  const el = $("#venuesGrid");
  if (!el) return;

  el.innerHTML = WC26.venues
    .map((venue) => `
      <article class="card venue-card" onclick="openVenue('${escAttr(venue[1])}')">
        <div class="flag">${venue[0]}</div>
        <div class="venue-title">${escapeHtml(venue[1])}</div>
        <p>📍 ${escapeHtml(venue[2])}, ${escapeHtml(venue[3])}</p>
        <p>👥 Capacity: ${escapeHtml(venue[4])}</p>
        <p>⚽ ${escapeHtml(venue[6])} matches</p>
        <span class="badge">Click for stadium info</span>
      </article>
    `)
    .join("");
}

function renderNews() {
  const el = $("#newsList");
  if (!el) return;

  const news = [
    ["BREAKING", "World Cup 2026 preparation: follow official squads, fixtures and team updates", "GoalCurrent", "Live page"],
    ["FIXTURES", "Opening fixture countdown and match guide", "GoalCurrent", "Updated today"],
    ["GROUPS", "All 12 group pages use cards, flags and clickable team navigation", "GoalCurrent", "Site update"],
    ["LIVE", "Live match centre will show goals, cards and lineups when matches are active", "GoalCurrent", "Live coverage"],
    ["TEAMS", "Browse all 48 teams with flags and favourite controls", "GoalCurrent", "Guide"]
  ];

  el.innerHTML = news
    .map((item, index) => `
      <article class="card news-item" onclick="openNews(${index})">
        <span class="tag ${index === 0 ? "break" : ""}">${item[0]}</span>
        <div><strong>${escapeHtml(item[1])}</strong><br><span class="muted">${escapeHtml(item[2])} · ${escapeHtml(item[3])}</span></div>
        <span>Read →</span>
      </article>
    `)
    .join("");
}

function renderFavourites() {
  const el = $("#favContent");
  if (!el) return;

  const data = favs();
  const tab = window.favTab || "teams";
  const toolbar = (count, type) => `<div class="fav-toolbar"><strong>${count} saved</strong>${count ? `<button class="remove-fav danger" onclick="clearFav('${type}')" type="button">Remove all</button>` : ""}</div>`;

  let html = "";

  if (tab === "teams") {
    const items = data.teams || [];
    html = toolbar(items.length, "teams") + (items.map((name) => `
      <div class="team-row fav-item">
        ${flagImg(name)}
        <strong>${escapeHtml(name)}</strong>
        <button class="remove-fav" onclick="removeFav('teams','${escAttr(name)}')" type="button">Remove</button>
      </div>
    `).join("") || '<div class="empty">No favourite teams yet. Go to Teams and press ★.</div>');
  }

  if (tab === "matches") {
    const items = WC26.fixtures.filter((match) => (data.matches || []).includes(matchId(match)));
    html = toolbar(items.length, "matches") + (items.map((match) => `
      <div class="match-card card fav-item" onclick="openMatch('${matchId(match)}')">
        <div><strong>${fmt(match[0])}</strong><br><span class="muted">Group ${match[1]} · ${escapeHtml(match[4])}</span></div>
        <div><strong>${flagImg(match[2])} ${escapeHtml(match[2])} vs ${flagImg(match[3])} ${escapeHtml(match[3])}</strong><br><span class="muted">${escapeHtml(match[5])}</span></div>
        <span class="status ${matchStatus(match[0]) === "LIVE" ? "live" : ""}">${matchStatus(match[0])}</span>
        <button class="remove-fav" onclick="event.stopPropagation();removeFav('matches','${matchId(match)}')" type="button">Remove</button>
      </div>
    `).join("") || '<div class="empty">No favourite matches yet. Open Fixtures and press ★.</div>');
  }

  if (tab === "groups") {
    const items = data.groups || [];
    html = toolbar(items.length, "groups") + (items.map((group) => `
      <div class="card fav-item group-fav">
        <a style="display:block;text-decoration:none;color:inherit" href="/worldcup2026/groups/group-${group.toLowerCase()}/">
          <h3>Group ${group}</h3>
          <p>${(WC26.groups[group] || []).map(([flag, name, code]) => `${flagImg(name, code, flag)} ${escapeHtml(name)}`).join(" · ")}</p>
        </a>
        <button class="remove-fav" onclick="removeFav('groups','${group}')" type="button">Remove</button>
      </div>
    `).join("") || '<div class="empty">No favourite groups yet.</div>');
  }

  if (tab === "all") {
    html = '<div class="fav-toolbar"><strong>All 48 teams</strong><span class="muted">Press ★ to add/remove favourites</span></div>' +
      WC26.teams.map((team) => `
        <div class="team-row fav-item">
          ${flagImg(team.name, team.code, team.flag)}
          <strong>${escapeHtml(team.name)}</strong>
          <span class="badge">Group ${team.group}</span>
          <button class="fav inline-fav" data-fav="teams:${escAttr(team.name)}" onclick="toggleFav('teams','${escAttr(team.name)}')" type="button">☆</button>
        </div>
      `).join("");
  }

  el.innerHTML = html;
  updateFavButtons();
}

function setFavTab(tab) {
  window.favTab = tab;
  $$(".tabs-mini button[data-tab]").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  renderFavourites();
}

function modal(title, body) {
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");
  const modalEl = $("#modal");
  if (!modalTitle || !modalBody || !modalEl) return;

  modalTitle.innerHTML = title;
  modalBody.innerHTML = body;
  modalEl.classList.add("show");
}

function closeModal() {
  $("#modal")?.classList.remove("show");
}

function openMatch(id) {
  const match = WC26.fixtures.find((item) => matchId(item) === id);
  if (!match) return;

  modal(
    `${flagImg(match[2])} ${escapeHtml(match[2])} vs ${flagImg(match[3])} ${escapeHtml(match[3])}`,
    `<p><b>Kick-off:</b> ${fmt(match[0])}</p>
     <p><b>Group:</b> ${match[1]}</p>
     <p><b>Venue:</b> ${escapeHtml(match[4])}</p>
     <div class="tabs-mini"><button type="button">News</button><button type="button">Squads</button><button type="button">Lineups</button><button type="button">Live events</button></div>
     <div id="matchLiveBox" class="live-status">🔴 Live events will appear here when match coverage starts.</div>
     <p><b>Status:</b> ${matchStatus(match[0])}</p>`
  );
}

function openTeam(name) {
  const team = WC26.teams.find((item) => item.name === name);
  if (!team) return;

  modal(
    `${flagImg(team.name, team.code, team.flag)} ${escapeHtml(team.name)}`,
    `<p><b>Group:</b> ${team.group}</p>
     <div class="tabs-mini"><button type="button">Squad</button><button type="button">Fixtures</button><button type="button">News</button><button type="button">World Cup history</button></div>
     <p class="notice">Squad and lineup details should be populated from official FIFA or a secure football data provider when available.</p>
     <a class="badge" href="/worldcup2026/groups/group-${team.group.toLowerCase()}/">Open Group ${team.group} →</a>`
  );
}

function openVenue(name) {
  const venue = WC26.venues.find((item) => item[1] === name);
  if (!venue) return;

  modal(
    `${venue[0]} ${escapeHtml(venue[1])}`,
    `<p><b>City:</b> ${escapeHtml(venue[2])}</p>
     <p><b>Country:</b> ${escapeHtml(venue[3])}</p>
     <p><b>Capacity:</b> ${escapeHtml(venue[4])}</p>
     <p><b>Role:</b> ${escapeHtml(venue[5])}</p>
     <p><b>Scheduled matches:</b> ${escapeHtml(venue[6])}</p>
     <p>This popup is designed for stadium background, hosted matches and venue-specific fixtures.</p>`
  );
}

function openBracket(round, number) {
  modal(
    `${escapeHtml(round)} — Match ${escapeHtml(number)}`,
    `<p><b>Status:</b> Awaiting group-stage qualification.</p>
     <p><b>Teams:</b> TBD vs TBD</p>
     <p><b>Match page:</b> this placeholder remains clickable now and can be populated automatically after group standings are confirmed.</p>`
  );
}

function openNews() {
  modal("News item", "<p>News details, related fixtures and source links will open here. Latest headlines update on the news page when the feed is available.</p>");
}

function initCountdown() {
  const el = $("#countdown");
  if (!el) return;

  const target = new Date("2026-06-11T20:00:00+01:00");
  const matchTitle = "Mexico vs South Africa";
  const matchMeta = "Opening match · 11 June 2026 · 20:00 BST · Estadio Azteca";

  const pad = (number) => String(number).padStart(2, "0");

  function tick() {
    const diff = target - new Date();

    if (diff <= 0) {
      el.innerHTML = `<div class="countdown-live"><div class="pulse-dot"></div><div><h3>World Cup 2026 has started</h3><p>${matchTitle} coverage is now live when match data is available.</p></div></div>`;
      return;
    }

    const days = Math.floor(diff / 864e5);
    const hours = Math.floor((diff % 864e5) / 36e5);
    const minutes = Math.floor((diff % 36e5) / 6e4);
    const seconds = Math.floor((diff % 6e4) / 1000);

    el.innerHTML = `
      <div class="countdown-clock" aria-label="Countdown to ${matchTitle}">
        <div class="countdown-match">
          <span class="kicker">Next match countdown</span>
          <h3>${matchTitle}</h3>
          <p>${matchMeta}</p>
        </div>
        <div class="time-ring"><b>${days}</b><span>Days</span></div>
        <div class="time-ring"><b>${pad(hours)}</b><span>Hours</span></div>
        <div class="time-ring"><b>${pad(minutes)}</b><span>Minutes</span></div>
        <div class="time-ring"><b>${pad(seconds)}</b><span>Seconds</span></div>
      </div>
    `;
  }

  tick();
  setInterval(tick, 1000);
}

function renderApiStatus(message, cls = "") {
  const el = $("#liveApiStatus");
  if (!el) return;
  el.className = `live-status ${cls}`;
  el.innerHTML = message;
}

function apiMatchRow(match) {
  const live = ["live", "IN_PLAY", "1H", "2H"].includes(match.status);
  const status = live ? "live" : (match.status || "upcoming");
  const score = (match.home.score != null || match.away.score != null) ? `${match.home.score ?? 0} - ${match.away.score ?? 0}` : "vs";

  return `
    <article class="card match-card" onclick="modal('${escapeHtml(match.home.name)} vs ${escapeHtml(match.away.name)}', '<p><b>Status:</b> ${escapeHtml(status)}</p><p><b>Kick-off:</b> ${escapeHtml(match.dateBST || "")}</p><p><b>Venue:</b> ${escapeHtml(match.venue || "")}</p><div class=\\'live-status\\'>Live goals, cards, lineups and substitutions appear here during official live coverage.</div>')">
      <div><strong>${escapeHtml(match.dateLabelBST || "")}</strong><br><span class="muted">${escapeHtml(match.dateBST || "")}</span></div>
      <div><strong>${escapeHtml(match.home.name)} ${score} ${escapeHtml(match.away.name)}</strong><br><span class="muted">${escapeHtml(match.group || "")} · ${escapeHtml(match.venue || "")}</span></div>
      <span class="status ${live ? "live" : ""}">${escapeHtml(status)}</span>
      <button class="fav" type="button">☆</button>
    </article>
  `;
}

async function enhanceLiveApi() {
  if (!$("#fixturesList")) return;

  if (!window.GC) {
    renderApiStatus("🔴 Live match events will appear here when matches start.");
    return;
  }

  try {
    let live = [];
    try { live = await GC.liveScores(); } catch { live = []; }

    if (live && live.length) {
      const box = $("#fixturesList");
      if (box) box.innerHTML = live.map(apiMatchRow).join("") + box.innerHTML;
      renderApiStatus("🔴 Live coverage active — scores and events update automatically.");
      return;
    }

    let today = [];
    try { today = await GC.todayFixtures(); } catch { today = []; }

    if (today && today.length) {
      renderApiStatus("📅 Today’s fixtures loaded. Live events will appear when matches start.");
      const box = $("#fixturesList");
      if (box) box.innerHTML = today.map(apiMatchRow).join("") || box.innerHTML;
    } else {
      renderApiStatus("📅 No World Cup match today. Showing upcoming fixtures.");
    }
  } catch {
    renderApiStatus("📅 Live match events will appear here when matches start.", "error");
  }
}

function injectNordVPNBanner() {
  if ($(".nordvpn-banner")) return;

  const banner = document.createElement("div");
  banner.className = "nordvpn-banner";
  banner.innerHTML = '🔒 Watching football abroad? Use NordVPN to access your favourite streams securely. <a href="#" rel="sponsored nofollow">Get NordVPN deal</a> <small>#AD · Affiliate link</small>';

  const footer = $(".footer");
  if (footer) footer.parentNode.insertBefore(banner, footer);
  else document.body.appendChild(banner);
}

function initCookieBanner() {
  if ($("#gcCookieBanner")) return;

  const banner = document.createElement("div");
  banner.id = "gcCookieBanner";
  banner.className = "cookie-banner";
  banner.innerHTML = '<p><strong>Cookies notice:</strong> GoalCurrent.live uses essential cookies and local storage for favourites, alerts, analytics and affiliate disclosure preferences.</p><button class="cookie-accept" type="button">Accept</button><button class="cookie-reject" type="button">Reject non-essential</button>';

  document.body.appendChild(banner);
  banner.classList.add("show");

  banner.querySelector(".cookie-accept").onclick = () => banner.classList.remove("show");
  banner.querySelector(".cookie-reject").onclick = () => banner.classList.remove("show");
}

function initSubscribePopup() {
  if ($("#gcSubscribePopup")) return;

  const popup = document.createElement("div");
  popup.id = "gcSubscribePopup";
  popup.className = "subscribe-popup";
  popup.innerHTML = `
    <div class="subscribe-card">
      <h2>Get World Cup updates</h2>
      <p>Subscribe for fixtures, live-score alerts, team news and breaking World Cup updates from GoalCurrent.live.</p>
      <form id="gcSubscribeForm">
        <input type="email" required placeholder="Enter your email address" aria-label="Email address">
        <button class="subscribe-submit" type="submit">Subscribe</button>
      </form>
      <div class="subscribe-actions"><button class="subscribe-close" type="button">Not now</button></div>
      <div class="subscribe-note">Free World Cup updates. You can unsubscribe anytime.</div>
    </div>
  `;

  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 900);

  popup.querySelector(".subscribe-close").onclick = () => popup.classList.remove("show");
  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.classList.remove("show");
  });

  popup.querySelector("#gcSubscribeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = popup.querySelector("input").value.trim();
    if (!email) return;

    localStorage.setItem("gcSubscribed", email);
    popup.querySelector(".subscribe-card").innerHTML = '<h2>Subscription saved</h2><p>Thank you. You are subscribed to GoalCurrent.live World Cup updates.</p><div class="subscribe-actions"><button class="subscribe-close" type="button">Close</button></div>';
    popup.querySelector(".subscribe-close").onclick = () => popup.classList.remove("show");
  });
}

function initSiteMarketing() {
  injectNordVPNBanner();
  initCookieBanner();
  initSubscribePopup();
}

document.addEventListener("DOMContentLoaded", () => {
  renderStandardSidebar();

  $("#hamb")?.addEventListener("click", openSide);
  $("#shade")?.addEventListener("click", closeSide);
  $("#modalClose")?.addEventListener("click", closeModal);
  $("#modal")?.addEventListener("click", (event) => {
    if (event.target.id === "modal") closeModal();
  });

  renderGroups();
  renderTeams();
  renderFixtures();
  renderStandings();
  renderBracket();
  renderVenues();
  renderNews();
  renderFavourites();
  initCountdown();
  updateFavButtons();
  initSiteMarketing();

  ["teamSearch", "teamGroup"].forEach((id) => $("#" + id)?.addEventListener("input", renderTeams));
  ["fixtureSearch", "fixtureGroup", "fixtureStatus", "fixtureDate"].forEach((id) => $("#" + id)?.addEventListener("input", renderFixtures));

  const groupPage = document.body.dataset.group;
  if (groupPage) renderGroupPage(groupPage);

  enhanceLiveApi();
});
