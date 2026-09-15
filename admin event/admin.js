document.addEventListener('DOMContentLoaded', () => {
  const state = {
    user: null,
    eventId: '',
    event: null,
    seasons: [],
    currentSeasonId: '',
    currentSeason: null,
    clubs: [],
    people: [],
    committee: [],
    matches: [],
    groups: [],
    groupMembers: [],
    standings: [],
    brackets: [],
    sponsors: [],
    banks: [],
    seasonContacts: [],
    history: [],
    topScorers: [],
    selectedMatch: null,
    selectedValidation: null
  };

  const $ = id => document.getElementById(id);
  const $$ = selector => document.querySelectorAll(selector);

  const value = id => $(id) ? $(id).value.trim() : '';
  const checked = id => $(id) ? $(id).checked : false;

  function setValue(id, val = '') {
    if ($(id)) $(id).value = val ?? '';
  }

  function setChecked(id, val) {
    if ($(id)) $(id).checked = !!val;
  }

  function show(id) {
    if ($(id)) $(id).classList.remove('hidden');
  }

  function hide(id) {
    if ($(id)) $(id).classList.add('hidden');
  }

  function text(id, val = '-') {
    if ($(id)) $(id).textContent = val ?? '-';
  }

  function html(id, val = '') {
    if ($(id)) $(id).innerHTML = val;
  }

  function modalOpen(id) {
    const modal = $(id);
    const backdrop = $('modalBackdrop');

    if (modal) modal.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
  }

  function modalClose(id) {
    const modal = $(id);
    const backdrop = $('modalBackdrop');

    if (modal) modal.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }

  function normalizeId(value) {
    return String(value ?? '').trim();
  }

  function dateValue(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
    return d.toISOString().slice(0, 10);
  }

  function dateDisplay(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function timeDisplay(value) {
    if (!value) return '-';
    return String(value).slice(0, 5);
  }

  function numberValue(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function activeValue(item) {
    return item?.active === true ||
      item?.active === 'true' ||
      item?.aktif === true ||
      item?.aktif === 'true' ||
      item?.status === 'ACTIVE';
  }

  function rowId(item) {
    return normalizeId(
      item?.id ||
      item?.ID ||
      item?.Id ||
      item?._id
    );
  }

  function eventIdOf(item) {
    return normalizeId(
      item?.eventId ||
      item?.event_id ||
      item?.EVENT_ID
    );
  }

  function seasonIdOf(item) {
    return normalizeId(
      item?.seasonId ||
      item?.season_id ||
      item?.SEASON_ID
    );
  }

  function clubIdOf(item) {
    return normalizeId(
      item?.clubId ||
      item?.club_id ||
      item?.CLUB_ID
    );
  }

  function escape(value) {
    return window.escapeHtml
      ? window.escapeHtml(value ?? '')
      : String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
  }

  function toast(message, type = 'success') {
    if (window.showToast) {
      window.showToast(message, type);
      return;
    }

    const container = $('toastContainer');
    if (!container) return;

    const item = document.createElement('div');
    item.className = `toast-item ${type}`;
    item.textContent = message;
    container.appendChild(item);

    setTimeout(() => item.remove(), 3500);
  }

  function loading(showLoading = true) {
    if (window.showLoading && showLoading) {
      window.showLoading();
      return;
    }

    if (window.closeLoading && !showLoading) {
      window.closeLoading();
      return;
    }

    const overlay = $('loadingOverlay');
    if (overlay) overlay.classList.toggle('show', showLoading);
  }

  function currentSeason() {
    return state.seasons.find(
      season => rowId(season) === state.currentSeasonId
    ) || null;
  }

  function currentEvent() {
    return state.event;
  }

  function filterEvent(rows) {
    return (rows || []).filter(item => {
      const id = eventIdOf(item);
      return !id || !state.eventId || id === state.eventId;
    });
  }

  function filterSeason(rows) {
    return (rows || []).filter(item => {
      const id = seasonIdOf(item);
      return !id || !state.currentSeasonId || id === state.currentSeasonId;
    });
  }

  async function loadSheet(sheet, options = {}) {
    const result = await App.list(sheet, options);
    if (!result?.success) {
      toast(result?.message || `Gagal mengambil data ${sheet}.`, 'error');
      return [];
    }

    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.rows)) return result.rows;
    return [];
  }

  async function saveSheet(sheet, data) {
    const result = await App.save(sheet, data);
    if (!result?.success) {
      toast(result?.message || `Gagal menyimpan ${sheet}.`, 'error');
      return null;
    }

    toast(result.message || 'Data berhasil disimpan.');
    return result.data || result.row || result;
  }

  async function deleteSheet(sheet, id) {
    const result = await App.remove(sheet, id);

    if (!result?.success) {
      toast(result?.message || 'Gagal menghapus data.', 'error');
      return false;
    }

    toast(result.message || 'Data berhasil dihapus.');
    return true;
  }

  async function init() {
    const user = App.getUser();

    if (!user) {
      window.location.href = '../index.html';
      return;
    }

    if (user.role && user.role !== 'ADMIN_EVENT') {
      App.logout();
      return;
    }

    state.user = user;
    state.eventId = normalizeId(
      user.eventId ||
      user.event_id ||
      user.EVENT_ID
    );

    if (!state.eventId) {
      toast('Akun Admin Event belum memiliki event.', 'error');
      return;
    }

    if (!await App.validateSession()) {
      App.logout();
      return;
    }

    showApplication();
    await loadApplication();
  }

  function showLogin() {
    hide('appShell');
    hide('adminApp');
    window.location.href = '../index.html';
  }

  function showApplication() {
    hide('loginScreen');
    show('appShell');
    show('adminApp');
  }

  async function login() {
    const username = value('loginUsername');
    const password = value('loginPassword');

    if (!username || !password) {
      toast('Username dan password wajib diisi.', 'error');
      return;
    }

    loading(true);

    try {
      const result = await App.login(username, password);

      if (!result?.success) {
        toast(result?.message || 'Login gagal.', 'error');
        return;
      }

      const user = result.user || App.getUser();

      if (
        user?.role &&
        user.role !== 'ADMIN_EVENT'
      ) {
        App.logout();
        toast('Akun ini bukan akun Admin Event.', 'error');
        return;
      }

      state.user = user;
      state.eventId = normalizeId(
        user?.eventId ||
        user?.event_id ||
        user?.EVENT_ID
      );

      if (!state.eventId) {
        App.logout();
        toast('Akun Admin Event belum terhubung ke event.', 'error');
        return;
      }

      showApplication();
      await loadApplication();
    } finally {
      loading(false);
    }
  }

  async function loadApplication() {
    loading(true);

    try {
      await Promise.all([
        loadEvent(),
        loadSeasons(),
        loadCommittee(),
        loadClubs(),
        loadPeople(),
        loadSponsors(),
        loadBanks()
      ]);

      await loadSeasonData();
      updateUserInfo();
      updateDashboard();
      renderAll();
    } finally {
      loading(false);
    }
  }

  async function loadEvent() {
    const rows = await loadSheet('EVENTS');
    const events = filterEvent(rows);

    state.event =
      events.find(item => rowId(item) === state.eventId) ||
      events[0] ||
      null;
  }

  async function loadSeasons() {
    const rows = await loadSheet('SEASONS');

    state.seasons = filterEvent(rows)
      .sort((a, b) =>
        String(b.createdAt || b.tanggal || '').localeCompare(
          String(a.createdAt || a.tanggal || '')
        )
      );

    if (
      !state.currentSeasonId ||
      !state.seasons.some(
        item => rowId(item) === state.currentSeasonId
      )
    ) {
      state.currentSeasonId = rowId(state.seasons[0]);
    }

    state.currentSeason = currentSeason();
  }

  async function loadCommittee() {
    const rows = await loadSheet('COMMITTEE');
    state.committee = filterEvent(rows);
  }

  async function loadClubs() {
    const rows = await loadSheet('CLUBS');
    state.clubs = filterEvent(rows);
  }

  async function loadPeople() {
    const rows = await loadSheet('PEOPLE');
    state.people = filterEvent(rows);
  }

  async function loadSponsors() {
    const rows = await loadSheet('SPONSORS');
    state.sponsors = filterEvent(rows);
  }

  async function loadBanks() {
    const rows = await loadSheet('BANKS');
    state.banks = filterSeason(rows);
  }

  async function loadSeasonData() {
    if (!state.currentSeasonId) {
      state.matches = [];
      state.groups = [];
      state.groupMembers = [];
      state.standings = [];
      state.brackets = [];
      state.seasonContacts = [];
      state.history = [];
      state.topScorers = [];
      return;
    }

    const [
      matches,
      groups,
      groupMembers,
      standings,
      brackets,
      contacts,
      history,
      topScorers
    ] = await Promise.all([
      loadSheet('MATCHES'),
      loadSheet('GROUPS'),
      loadSheet('GROUP_MEMBERS'),
      loadSheet('GROUP_STANDINGS'),
      loadSheet('BRACKETS'),
      loadSheet('SEASON_CONTACTS'),
      loadSheet('HISTORY'),
      loadTopScorers()
    ]);

    state.matches = filterSeason(matches);
    state.groups = filterSeason(groups);
    state.groupMembers = filterSeason(groupMembers);
    state.standings = filterSeason(standings);
    state.brackets = filterSeason(brackets);
    state.seasonContacts = filterSeason(contacts);
    state.history = filterSeason(history);
    state.topScorers = topScorers;
  }

  async function loadTopScorers() {
    if (!state.currentSeasonId) return [];

    const result = await App.topScorers(state.currentSeasonId);

    if (!result?.success) return [];

    return result.data || result.rows || [];
  }

  function updateUserInfo() {
    const user = state.user || {};
    const event = currentEvent();

    text('topbarUserName', user.name || user.username || 'Admin Event');
    text('sidebarUserName', user.name || user.username || 'Admin Event');
    text('sidebarEventName', event?.name || 'Event');
    text('topbarEventName', event?.name || 'Event');
    text('topbarSeasonName', currentSeason()?.name || 'Belum ada season');
  }

  function updateDashboard() {
    const season = currentSeason();

    const matchCount = state.matches.length;
    const clubCount = state.clubs.length;
    const peopleCount = state.people.length;
    const seasonCount = state.seasons.length;

    text('statMatches', matchCount);
    text('statClubs', clubCount);
    text('statPeople', peopleCount);
    text('statSeasons', seasonCount);

    text('dashboardEventName', state.event?.name || '-');
    text('dashboardSeasonName', season?.name || 'Belum ada season');

    const pending = state.matches.filter(match => {
      const status = String(
        match.status ||
        match.matchStatus ||
        ''
      ).toUpperCase();

      return !['VALID', 'SELESAI', 'FINISHED'].includes(status);
    });

    text('statPendingMatches', pending.length);
  }

  function renderAll() {
    renderSeasonSelects();
    renderSeasonInfo();
    renderSeasons();
    renderCommittee();
    renderClubs();
    renderPeople();
    renderMatches();
    renderGroups();
    renderStandings();
    renderBracket();
    renderSponsors();
    renderBanks();
    renderSeasonContacts();
    renderTopScorers();
    renderHistory();
    renderDashboardMatches();
    populateClubSelects();
    populateMatchClubSelects();
  }

  function renderSeasons() {
    const body = $('seasonTableBody');
    if (!body) return;

    if (!state.seasons.length) {
      body.innerHTML = `
        <tr>
          <td colspan="5" class="empty-cell">Belum ada season.</td>
        </tr>
      `;
      return;
    }

    body.innerHTML = state.seasons.map(season => `
      <tr>
        <td>${escape(season.name || '-')}</td>
        <td>${escape(season.eventType || '-')}</td>
        <td>${escape(season.status || 'ACTIVE')}</td>
        <td>${escape(dateDisplay(season.createdAt))}</td>
        <td>
          <button class="btn-icon" data-action="edit-season" data-id="${escape(rowId(season))}" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderSeasonSelects() {
    const selectors = [
      'seasonSelector',
      'groupSeasonSelect',
      'standingsSeasonSelect',
      'knockoutSeasonSelect',
      'validationSeasonSelect',
      'topScorerSeasonSelect',
      'historySeasonSelect'
    ];

    selectors.forEach(id => {
      const select = $(id);
      if (!select) return;

      const previous = select.value;

      select.innerHTML =
        '<option value="">Pilih season</option>' +
        state.seasons.map(season => {
          const idValue = rowId(season);
          return `<option value="${escape(idValue)}">${escape(
            season.name || season.nama || '-'
          )}</option>`;
        }).join('');

      select.value =
        state.currentSeasonId ||
        previous ||
        '';
    });
  }

  function renderSeasonInfo() {
    const season = currentSeason();
    const setupAlert = $('seasonSetupAlert');

    if (setupAlert) {
      setupAlert.classList.toggle('hidden', !!season);
    }

    if (!season) {
      text('currentSeasonName', 'Belum ada season');
      text('currentSeasonBio', '-');
      text('currentSeasonType', '-');
      return;
    }

    text(
      'currentSeasonName',
      season.name || season.nama || '-'
    );

    text(
      'currentSeasonBio',
      season.bio || season.deskripsi || '-'
    );

    text(
      'currentSeasonType',
      season.eventType ||
      season.type ||
      season.jenis ||
      '-'
    );
  }

  function renderCommittee() {
    const body = $('committeeTableBody');
    if (!body) return;

    body.innerHTML = state.committee.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escape(item.name || item.nama || '-')}</td>
        <td>${escape(item.position || item.jabatan || '-')}</td>
        <td>${escape(item.phone || item.telepon || '-')}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" data-action="edit-committee" data-id="${escape(rowId(item))}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon danger" data-action="delete-committee" data-id="${escape(rowId(item))}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    if (!state.committee.length) {
      body.innerHTML = `
        <tr>
          <td colspan="5" class="empty-cell">Belum ada data panitia.</td>
        </tr>
      `;
    }
  }

  function renderClubs() {
    const body = $('clubsTableBody');
    if (!body) return;

    let rows = [...state.clubs];

    const search = value('clubSearch').toLowerCase();
    if (search) {
      rows = rows.filter(item =>
        String(
          item.name ||
          item.nama ||
          ''
        ).toLowerCase().includes(search)
      );
    }

    rows.sort((a, b) =>
      String(a.name || a.nama || '').localeCompare(
        String(b.name || b.nama || ''),
        'id'
      )
    );

    body.innerHTML = rows.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div class="club-cell">
            ${
              item.logoUrl || item.logo
                ? `<img src="${escape(item.logoUrl || item.logo)}" alt="">`
                : '<div class="club-logo-placeholder"><i class="bi bi-shield"></i></div>'
            }
            <span>${escape(item.name || item.nama || '-')}</span>
          </div>
        </td>
        <td>${escape(
          item.managerName ||
          item.manager ||
          '-'
        )}</td>
        <td>${escape(
          item.managerPhone ||
          item.phone ||
          item.telepon ||
          '-'
        )}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" data-action="edit-club" data-id="${escape(rowId(item))}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon danger" data-action="delete-club" data-id="${escape(rowId(item))}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    if (!rows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="5" class="empty-cell">Belum ada klub.</td>
        </tr>
      `;
    }
  }

  function renderPeople() {
    const body = $('peopleTableBody');
    if (!body) return;

    let rows = [...state.people];

    const search = value('peopleSearch').toLowerCase();

    if (search) {
      rows = rows.filter(item => {
        const club = findClub(clubIdOf(item));
        return [
          item.name,
          item.nama,
          item.position,
          item.jabatan,
          club?.name,
          club?.nama
        ].join(' ').toLowerCase().includes(search);
      });
    }

    rows.sort((a, b) =>
      String(a.name || a.nama || '').localeCompare(
        String(b.name || b.nama || ''),
        'id'
      )
    );

    body.innerHTML = rows.map((item, index) => {
      const club = findClub(clubIdOf(item));

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escape(item.name || item.nama || '-')}</td>
          <td>${escape(club?.name || club?.nama || '-')}</td>
          <td>${escape(item.position || item.jabatan || '-')}</td>
          <td>${escape(item.phone || item.telepon || '-')}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" data-action="edit-person" data-id="${escape(rowId(item))}">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-icon danger" data-action="delete-person" data-id="${escape(rowId(item))}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (!rows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="6" class="empty-cell">Belum ada data management.</td>
        </tr>
      `;
    }
  }

  function renderMatches() {
    const body = $('matchesTableBody');
    if (!body) return;

    let rows = [...state.matches];

    const search = value('matchSearch').toLowerCase();
    const filter = value('matchStatusFilter');

    if (search) {
      rows = rows.filter(item =>
        [
          item.homeName,
          item.awayName,
          item.homeTeam,
          item.awayTeam,
          item.stage,
          item.groupName
        ].join(' ').toLowerCase().includes(search)
      );
    }

    if (filter) {
      rows = rows.filter(item =>
        String(item.status || '').toLowerCase() === filter.toLowerCase()
      );
    }

    rows.sort((a, b) =>
      `${b.date || ''} ${b.time || ''}`.localeCompare(
        `${a.date || ''} ${a.time || ''}`
      )
    );

    body.innerHTML = rows.map((item, index) => {
      const home = matchClubName(item, 'home');
      const away = matchClubName(item, 'away');

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${dateDisplay(item.date || item.matchDate)}</td>
          <td>${timeDisplay(item.time || item.matchTime)}</td>
          <td>${escape(item.stage || item.type || '-')}</td>
          <td>${escape(item.groupName || item.group || '-')}</td>
          <td>${escape(home)}</td>
          <td>${escape(away)}</td>
          <td>${scoreDisplay(item)}</td>
          <td>${matchStatus(item)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" data-action="validate-match" data-id="${escape(rowId(item))}">
                <i class="bi bi-check2-square"></i>
              </button>
              <button class="btn-icon" data-action="edit-match" data-id="${escape(rowId(item))}">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-icon danger" data-action="delete-match" data-id="${escape(rowId(item))}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (!rows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="10" class="empty-cell">Belum ada pertandingan.</td>
        </tr>
      `;
    }
  }

  function renderDashboardMatches() {
    const body = $('dashboardMatchesBody');
    if (!body) return;

    const rows = [...state.matches]
      .sort((a, b) =>
        `${b.date || ''} ${b.time || ''}`.localeCompare(
          `${a.date || ''} ${a.time || ''}`
        )
      )
      .slice(0, 8);

    body.innerHTML = rows.map(item => `
      <tr>
        <td>${dateDisplay(item.date || item.matchDate)}</td>
        <td>${timeDisplay(item.time || item.matchTime)}</td>
        <td>${escape(matchClubName(item, 'home'))}</td>
        <td>${scoreDisplay(item)}</td>
        <td>${escape(matchClubName(item, 'away'))}</td>
        <td>${matchStatus(item)}</td>
      </tr>
    `).join('');

    if (!rows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="6" class="empty-cell">Belum ada pertandingan.</td>
        </tr>
      `;
    }
  }

  function renderGroups() {
    const container = $('groupsContainer');
    if (!container) return;

    const groups = [...state.groups]
      .sort((a, b) =>
        String(a.name || a.nama || '').localeCompare(
          String(b.name || b.nama || ''),
          'id'
        )
      );

    container.innerHTML = groups.map(group => {
      const gid = rowId(group);
      const members = state.groupMembers.filter(
        member =>
          normalizeId(
            member.groupId ||
            member.group_id
          ) === gid
      );

      return `
        <div class="group-card">
          <div class="group-card-header">
            <div>
              <span class="group-label">GROUP</span>
              <h3>${escape(group.name || group.nama || '-')}</h3>
            </div>
            <span class="group-count">${members.length} klub</span>
          </div>
          <div class="group-clubs">
            ${members.map(member => {
              const club = findClub(
                normalizeId(
                  member.clubId ||
                  member.club_id
                )
              );

              return `
                <div class="group-club">
                  ${
                    club?.logoUrl || club?.logo
                      ? `<img src="${escape(club.logoUrl || club.logo)}" alt="">`
                      : '<div class="club-logo-placeholder"><i class="bi bi-shield"></i></div>'
                  }
                  <span>${escape(
                    club?.name ||
                    club?.nama ||
                    member.clubName ||
                    '-'
                  )}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    if (!groups.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-diagram-3"></i>
          <strong>Belum ada group</strong>
          <span>Buat group terlebih dahulu untuk memulai pembagian klub.</span>
        </div>
      `;
    }
  }

  function renderStandings() {
    const container = $('standingsContainer');
    if (!container) return;

    const groups = [...state.groups];

    container.innerHTML = groups.map(group => {
      const gid = rowId(group);

      const rows = state.standings
        .filter(item =>
          normalizeId(
            item.groupId ||
            item.group_id
          ) === gid
        )
        .sort((a, b) =>
          numberValue(a.position) -
          numberValue(b.position)
        );

      return `
        <div class="standings-card">
          <div class="section-card-header">
            <div>
              <span class="eyebrow">KLASEMEN</span>
              <h3>Group ${escape(group.name || group.nama || '-')}</h3>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table standings-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Klub</th>
                  <th>Main</th>
                  <th>Menang</th>
                  <th>Seri</th>
                  <th>Kalah</th>
                  <th>GM</th>
                  <th>GK</th>
                  <th>GD</th>
                  <th>Poin</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map((item, index) => {
                  const club = findClub(clubIdOf(item));

                  return `
                    <tr>
                      <td>${numberValue(item.position) || index + 1}</td>
                      <td>
                        <div class="club-cell">
                          ${
                            club?.logoUrl || club?.logo
                              ? `<img src="${escape(club.logoUrl || club.logo)}" alt="">`
                              : '<div class="club-logo-placeholder"><i class="bi bi-shield"></i></div>'
                          }
                          <span>${escape(
                            club?.name ||
                            club?.nama ||
                            item.clubName ||
                            '-'
                          )}</span>
                        </div>
                      </td>
                      <td>${numberValue(item.played)}</td>
                      <td>${numberValue(item.wins)}</td>
                      <td>${numberValue(item.draws)}</td>
                      <td>${numberValue(item.losses)}</td>
                      <td>${numberValue(item.gf)}</td>
                      <td>${numberValue(item.ga)}</td>
                      <td>${numberValue(item.gd)}</td>
                      <td><strong>${numberValue(item.points)}</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');

    if (!groups.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-table"></i>
          <strong>Belum ada klasemen</strong>
          <span>Klasemen akan tampil setelah group dan klub dibuat.</span>
        </div>
      `;
    }
  }

  function renderBracket() {
    const container = $('bracketContainer');
    if (!container) return;

    const rounds = {
      '16 BESAR': [],
      'PEREMPAT FINAL': [],
      'SEMIFINAL': [],
      'FINAL': []
    };

    state.brackets.forEach(match => {
      const round =
        String(
          match.round ||
          match.stage ||
          ''
        ).toUpperCase();

      if (round.includes('16')) rounds['16 BESAR'].push(match);
      else if (
        round.includes('QF') ||
        round.includes('PEREMPAT')
      ) rounds['PEREMPAT FINAL'].push(match);
      else if (
        round.includes('SF') ||
        round.includes('SEMIFINAL')
      ) rounds['SEMIFINAL'].push(match);
      else if (round.includes('FINAL')) rounds['FINAL'].push(match);
    });

    const roundHtml = Object.entries(rounds).map(([title, matches]) => `
      <div class="bracket-round">
        <div class="bracket-round-title">${escape(title)}</div>
        <div class="bracket-round-matches">
          ${matches.map(match => `
            <div class="bracket-match">
              <div class="bracket-match-number">
                ${escape(match.code || match.matchCode || '-')}
              </div>
              <div class="bracket-team">
                <span>${escape(bracketTeam(match, 'home'))}</span>
                <strong>${bracketScore(match, 'home')}</strong>
              </div>
              <div class="bracket-team">
                <span>${escape(bracketTeam(match, 'away'))}</span>
                <strong>${bracketScore(match, 'away')}</strong>
              </div>
              <div class="bracket-date">
                ${escape(shortDate(match.date || match.matchDate))}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    container.innerHTML = roundHtml;

    if (!state.brackets.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-trophy"></i>
          <strong>Bracket belum tersedia</strong>
          <span>Bracket akan dibuat setelah fase group diselesaikan.</span>
        </div>
      `;
    }
  }

  function renderSponsors() {
    const body = $('sponsorsTableBody');
    if (!body) return;

    body.innerHTML = state.sponsors.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div class="club-cell">
            ${
              item.logoUrl || item.logo
                ? `<img src="${escape(item.logoUrl || item.logo)}" alt="">`
                : '<div class="club-logo-placeholder"><i class="bi bi-image"></i></div>'
            }
            <span>${escape(item.name || item.nama || '-')}</span>
          </div>
        </td>
        <td>
          <span class="status-badge ${activeValue(item) ? 'active' : 'inactive'}">
            ${activeValue(item) ? 'Aktif' : 'Tidak Aktif'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" data-action="edit-sponsor" data-id="${escape(rowId(item))}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon danger" data-action="delete-sponsor" data-id="${escape(rowId(item))}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    if (!state.sponsors.length) {
      body.innerHTML = `
        <tr>
          <td colspan="4" class="empty-cell">Belum ada sponsorship.</td>
        </tr>
      `;
    }
  }

  function renderBanks() {
    const body = $('banksTableBody');
    if (!body) return;

    body.innerHTML = state.banks.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escape(item.bank || item.bankName || '-')}</td>
        <td>${escape(item.accountNumber || item.nomorRekening || '-')}</td>
        <td>${escape(item.accountName || item.namaRekening || '-')}</td>
        <td>
          ${
            item.qrUrl || item.qr
              ? `<a class="table-link" href="${escape(item.qrUrl || item.qr)}" target="_blank">Lihat QR</a>`
              : '-'
          }
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" data-action="edit-bank" data-id="${escape(rowId(item))}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon danger" data-action="delete-bank" data-id="${escape(rowId(item))}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    if (!state.banks.length) {
      body.innerHTML = `
        <tr>
          <td colspan="6" class="empty-cell">Belum ada rekening.</td>
        </tr>
      `;
    }
  }

  function renderSeasonContacts() {
    const body = $('seasonContactsTableBody');
    if (!body) return;

    body.innerHTML = state.seasonContacts.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escape(item.type || item.jenis || '-')}</td>
        <td>${escape(item.name || item.nama || '-')}</td>
        <td>${escape(item.link || item.url || '-')}</td>
        <td>
          <span class="status-badge ${activeValue(item) ? 'active' : 'inactive'}">
            ${activeValue(item) ? 'Aktif' : 'Tidak Aktif'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" data-action="edit-season-contact" data-id="${escape(rowId(item))}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon danger" data-action="delete-season-contact" data-id="${escape(rowId(item))}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    if (!state.seasonContacts.length) {
      body.innerHTML = `
        <tr>
          <td colspan="6" class="empty-cell">Belum ada kontak season.</td>
        </tr>
      `;
    }
  }

  function renderTopScorers() {
    const body = $('topScorersTableBody');
    if (!body) return;

    const rows = [...state.topScorers]
      .sort((a, b) =>
        numberValue(b.totalGoals || b.goals) -
        numberValue(a.totalGoals || a.goals)
      );

    body.innerHTML = rows.map((item, index) => {
      const club = findClub(clubIdOf(item));

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escape(
            item.playerName ||
            item.name ||
            item.nama ||
            '-'
          )}</td>
          <td>${escape(
            club?.name ||
            club?.nama ||
            item.clubName ||
            '-'
          )}</td>
          <td><strong>${numberValue(
            item.totalGoals ||
            item.goals
          )}</strong></td>
        </tr>
      `;
    }).join('');

    if (!rows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="4" class="empty-cell">Belum ada data top skor.</td>
        </tr>
      `;
    }
  }

  function renderHistory() {
    const body = $('historyTableBody');
    if (!body) return;

    body.innerHTML = [...state.history]
      .sort((a, b) =>
        String(b.createdAt || b.date || '').localeCompare(
          String(a.createdAt || a.date || '')
        )
      )
      .map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${dateDisplay(item.date || item.createdAt)}</td>
          <td>${escape(item.type || item.action || '-')}</td>
          <td>${escape(item.description || item.notes || '-')}</td>
          <td>${escape(item.userName || item.username || '-')}</td>
        </tr>
      `).join('');

    if (!state.history.length) {
      body.innerHTML = `
        <tr>
          <td colspan="5" class="empty-cell">Belum ada histori.</td>
        </tr>
      `;
    }
  }

  function findClub(id) {
    return state.clubs.find(
      club => rowId(club) === normalizeId(id)
    );
  }

  function matchClubId(match, side) {
    if (side === 'home') {
      return normalizeId(
        match.homeClubId ||
        match.home_club_id ||
        match.homeId
      );
    }

    return normalizeId(
      match.awayClubId ||
      match.away_club_id ||
      match.awayId
    );
  }

  function matchClubName(match, side) {
    const id = matchClubId(match, side);
    const club = findClub(id);

    if (club) return club.name || club.nama || '-';

    return side === 'home'
      ? match.homeName || match.homeTeam || 'TBD'
      : match.awayName || match.awayTeam || 'TBD';
  }

  function scoreDisplay(match) {
    const home = match.homeScore ?? match.scoreHome;
    const away = match.awayScore ?? match.scoreAway;

    if (
      home === undefined ||
      home === null ||
      home === '' ||
      away === undefined ||
      away === null ||
      away === ''
    ) {
      return '-';
    }

    return `${numberValue(home)} - ${numberValue(away)}`;
  }

  function matchStatus(match) {
    const status = String(
      match.status ||
      match.matchStatus ||
      'BELUM'
    ).toUpperCase();

    if (
      status === 'VALID' ||
      status === 'SELESAI' ||
      status === 'FINISHED'
    ) {
      return '<span class="status-badge active">Selesai</span>';
    }

    if (
      status === 'POSTPONED' ||
      status === 'DITUNDA'
    ) {
      return '<span class="status-badge warning">Ditunda</span>';
    }

    return '<span class="status-badge pending">Belum</span>';
  }

  function shortDate(value) {
    if (!value) return '-';

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);

    return `${d.getDate()}/${d.getMonth() + 1}/${String(
      d.getFullYear()
    ).slice(-2)}`;
  }

  function bracketTeam(match, side) {
    if (side === 'home') {
      return match.homeName ||
        match.homeTeam ||
        match.homeClubName ||
        'TBD';
    }

    return match.awayName ||
      match.awayTeam ||
      match.awayClubName ||
      'TBD';
  }

  function bracketScore(match, side) {
    if (side === 'home') {
      return match.homeScore ?? '';
    }

    return match.awayScore ?? '';
  }

  function populateClubSelects() {
    const selectors = [
      'personClub',
      'matchHome',
      'matchAway'
    ];

    selectors.forEach(id => {
      const select = $(id);
      if (!select) return;

      const previous = select.value;

      select.innerHTML =
        '<option value="">Pilih klub</option>' +
        [...state.clubs]
          .sort((a, b) =>
            String(a.name || a.nama || '').localeCompare(
              String(b.name || b.nama || ''),
              'id'
            )
          )
          .map(club =>
            `<option value="${escape(rowId(club))}">${escape(
              club.name || club.nama || '-'
            )}</option>`
          ).join('');

      select.value = previous;
    });
  }

  function populateMatchClubSelects() {
    const home = $('matchHome');
    const away = $('matchAway');

    if (!home || !away) return;

    const season = currentSeason();
    const isKnockout =
      String(
        value('matchPhase') ||
        ''
      ).toLowerCase().includes('knockout');

    if (
      season &&
      isKnockout
    ) {
      home.disabled = true;
      away.disabled = true;
    } else {
      home.disabled = false;
      away.disabled = false;
    }
  }

  function selectSeason(id) {
    const seasonId = normalizeId(id);
    if (!seasonId) return;

    state.currentSeasonId = seasonId;
    state.currentSeason = currentSeason();

    loadBanks();
    loadSeasonData().then(() => {
      renderAll();
      updateDashboard();
    });
  }

  function openSeasonModal(item = null) {
    setValue('seasonId', rowId(item));
    setValue('seasonName', item?.name || item?.nama || '');
    setValue('seasonBio', item?.bio || item?.deskripsi || '');
    setValue(
      'seasonEventType',
      item?.eventType ||
      item?.type ||
      ''
    );

    modalOpen('seasonModal');
  }

  async function saveSeason() {
    const name = value('seasonName');
    const bio = value('seasonBio');
    const eventType = value('seasonEventType');

    if (!name) {
      toast('Nama season wajib diisi.', 'error');
      return;
    }

    const id = value('seasonId');

    if (!id && state.seasons.length) {
      toast('Event ini sudah memiliki season.', 'error');
      modalClose('seasonModal');
      return;
    }

    const data = {
      id,
      eventId: state.eventId,
      name,
      bio,
      eventType,
      status: 'ACTIVE'
    };

    loading(true);

    try {
      const saved = await saveSheet('SEASONS', data);

      if (!saved) return;

      modalClose('seasonModal');
      await loadSeasons();

      if (!state.currentSeasonId) {
        state.currentSeasonId = rowId(saved);
      }

      await loadSeasonData();
      renderAll();
      updateDashboard();
    } finally {
      loading(false);
    }
  }

  function openCommitteeModal(item = null) {
    setValue('committeeId', rowId(item));
    setValue('committeeName', item?.name || item?.nama || '');
    setValue(
      'committeePosition',
      item?.position ||
      item?.jabatan ||
      ''
    );
    setValue(
      'committeePhone',
      item?.phone ||
      item?.telepon ||
      ''
    );

    modalOpen('committeeModal');
  }

  async function saveCommittee() {
    const name = value('committeeName');
    const position = value('committeePosition');
    const phone = value('committeePhone');

    if (!name || !position) {
      toast('Nama dan jabatan panitia wajib diisi.', 'error');
      return;
    }

    if (
      !value('committeeId') &&
      state.committee.length === 0 &&
      !String(position).toLowerCase().includes('ketua')
    ) {
      toast('Data pertama harus Ketua Panitia.', 'error');
      return;
    }

    const data = {
      id: value('committeeId'),
      eventId: state.eventId,
      seasonId: state.currentSeasonId,
      name,
      position,
      phone
    };

    loading(true);

    try {
      if (await saveSheet('COMMITTEE', data)) {
        modalClose('committeeModal');
        await loadCommittee();
        renderCommittee();
      }
    } finally {
      loading(false);
    }
  }

  function openClubModal(item = null) {
    setValue('clubId', rowId(item));
    setValue('clubName', item?.name || item?.nama || '');
    setValue(
      'clubManager',
      item?.managerName ||
      item?.manager ||
      ''
    );
    setValue(
      'clubManagerPhone',
      item?.managerPhone ||
      item?.phone ||
      ''
    );
    setValue(
      'clubLogoUrl',
      item?.logoUrl ||
      item?.logo ||
      ''
    );

    modalOpen('clubModal');
  }

  async function saveClub() {
    const name = value('clubName');
    const managerName = value('clubManager');
    const managerPhone = value('clubManagerPhone');
    const logoUrl = value('clubLogoUrl');

    if (!name) {
      toast('Nama klub wajib diisi.', 'error');
      return;
    }

    const data = {
      id: value('clubId'),
      eventId: state.eventId,
      name,
      managerName,
      managerPhone,
      logoUrl
    };

    loading(true);

    try {
      if (await saveSheet('CLUBS', data)) {
        modalClose('clubModal');
        await loadClubs();
        renderClubs();
        populateClubSelects();
        updateDashboard();
      }
    } finally {
      loading(false);
    }
  }

  async function uploadClubLogo() {
    const input = $('clubLogo');
    if (!input?.files?.[0]) return;

    loading(true);

    try {
      const result = await App.uploadFile(
        input.files[0],
        '03_CLUBS'
      );

      if (!result?.success) {
        toast(result?.message || 'Upload logo gagal.', 'error');
        return;
      }

      setValue(
        'clubLogoUrl',
        result.url ||
        result.fileUrl ||
        result.data?.url ||
        ''
      );

      toast('Logo klub berhasil diupload.');
    } finally {
      loading(false);
    }
  }

  function openPersonModal(item = null) {
    setValue('personId', rowId(item));
    setValue('personName', item?.name || item?.nama || '');
    setValue('personClub', clubIdOf(item));
    setValue(
      'personPosition',
      item?.position ||
      item?.jabatan ||
      ''
    );
    setValue(
      'personPhone',
      item?.phone ||
      item?.telepon ||
      ''
    );

    modalOpen('personModal');
  }

  async function savePerson() {
    const name = value('personName');
    const clubId = value('personClub');
    const position = value('personPosition');
    const phone = value('personPhone');

    if (!name || !clubId || !position) {
      toast('Nama, klub, dan posisi wajib diisi.', 'error');
      return;
    }

    const data = {
      id: value('personId'),
      eventId: state.eventId,
      seasonId: state.currentSeasonId,
      name,
      clubId,
      position,
      phone
    };

    loading(true);

    try {
      if (await saveSheet('PEOPLE', data)) {
        modalClose('personModal');
        await loadPeople();
        renderPeople();
        updateDashboard();
      }
    } finally {
      loading(false);
    }
  }

  function openMatchModal(item = null) {
    setValue('matchId', rowId(item));
    setValue(
      'matchPhase',
      item?.stage ||
      item?.type ||
      ''
    );
    setValue(
      'matchDate',
      dateValue(item?.date || item?.matchDate)
    );
    setValue(
      'matchTime',
      timeDisplay(item?.time || item?.matchTime)
    );
    setValue(
      'matchGroup',
      item?.groupId ||
      item?.group_id ||
      ''
    );
    setValue(
      'matchHome',
      matchClubId(item, 'home')
    );
    setValue(
      'matchAway',
      matchClubId(item, 'away')
    );
    setValue(
      'matchRound',
      item?.round ||
      item?.roundName ||
      ''
    );

    updateMatchMode();
    modalOpen('matchModal');
  }

  function updateMatchMode() {
    const stage = String(
      value('matchPhase')
    ).toLowerCase();

    const knockout = stage.includes('knockout');

    if ($('matchGroupWrap')) {
      $('matchGroupWrap').classList.toggle(
        'hidden',
        knockout
      );
    }

    if ($('matchHome')) {
      $('matchHome').disabled = knockout;
    }

    if ($('matchAway')) {
      $('matchAway').disabled = knockout;
    }
  }

  async function saveMatch() {
    if (!state.currentSeasonId) {
      toast('Buat season terlebih dahulu.', 'error');
      return;
    }

    const stage = value('matchPhase');
    const date = value('matchDate');
    const time = value('matchTime');
    const groupId = value('matchGroup');
    const homeClubId = value('matchHome');
    const awayClubId = value('matchAway');
    const round = value('matchRound');

    if (!stage || !date || !time) {
      toast('Jenis, tanggal, dan waktu pertandingan wajib diisi.', 'error');
      return;
    }

    const knockout = stage.toLowerCase().includes('knockout');

    if (!knockout && (!homeClubId || !awayClubId)) {
      toast('Klub home dan away wajib dipilih.', 'error');
      return;
    }

    if (!knockout && homeClubId === awayClubId) {
      toast('Klub home dan away tidak boleh sama.', 'error');
      return;
    }

    const data = {
      id: value('matchId'),
      eventId: state.eventId,
      seasonId: state.currentSeasonId,
      stage,
      date,
      time,
      groupId: knockout ? '' : groupId,
      homeClubId: knockout ? '' : homeClubId,
      awayClubId: knockout ? '' : awayClubId,
      round,
      status: 'BELUM'
    };

    loading(true);

    try {
      if (await saveSheet('MATCHES', data)) {
        modalClose('matchModal');
        await reloadMatches();
      }
    } finally {
      loading(false);
    }
  }

  async function reloadMatches() {
    const rows = await loadSheet('MATCHES');
    state.matches = filterSeason(rows);
    renderMatches();
    renderDashboardMatches();
    updateDashboard();
  }

  function openValidationModal(item = null) {
    const match = item ||
      state.matches.find(
        row => rowId(row) === value('validationMatchId')
      );

    if (!match) {
      toast('Pertandingan tidak ditemukan.', 'error');
      return;
    }

    state.selectedMatch = match;

    setValue('validationId', '');
    setValue('validationMatchId', rowId(match));
    setValue('validationHalfHome', match.halfHomeScore ?? '');
    setValue('validationHalfAway', match.halfAwayScore ?? '');
    setValue('validationFullHome', match.homeScore ?? '');
    setValue('validationFullAway', match.awayScore ?? '');
    setValue(
      'validationResultNote',
      match.validationNote ||
      match.notes ||
      ''
    );

    renderValidationTeams(match);
    modalOpen('validationModal');
  }

  function renderValidationTeams(match) {
    text(
      'validationHomeName',
      matchClubName(match, 'home')
    );

    text(
      'validationAwayName',
      matchClubName(match, 'away')
    );

    const homeId = matchClubId(match, 'home');
    const awayId = matchClubId(match, 'away');

    const homePlayers = state.people.filter(
      person => clubIdOf(person) === homeId
    );

    const awayPlayers = state.people.filter(
      person => clubIdOf(person) === awayId
    );

    const homeSelect = $('goalHomePlayer');
    const awaySelect = $('goalAwayPlayer');

    if (homeSelect) {
      homeSelect.innerHTML =
        '<option value="">Pilih pencetak gol</option>' +
        homePlayers.map(player =>
          `<option value="${escape(rowId(player))}">${escape(
            player.name || player.nama || '-'
          )}</option>`
        ).join('');
    }

    if (awaySelect) {
      awaySelect.innerHTML =
        '<option value="">Pilih pencetak gol</option>' +
        awayPlayers.map(player =>
          `<option value="${escape(rowId(player))}">${escape(
            player.name || player.nama || '-'
          )}</option>`
        ).join('');
    }

    const cardHome = $('cardHomePlayer');
    const cardAway = $('cardAwayPlayer');

    if (cardHome) {
      cardHome.innerHTML =
        '<option value="">Pilih pemain</option>' +
        homePlayers.map(player =>
          `<option value="${escape(rowId(player))}">${escape(
            player.name || player.nama || '-'
          )}</option>`
        ).join('');
    }

    if (cardAway) {
      cardAway.innerHTML =
        '<option value="">Pilih pemain</option>' +
        awayPlayers.map(player =>
          `<option value="${escape(rowId(player))}">${escape(
            player.name || player.nama || '-'
          )}</option>`
        ).join('');
    }
  }

  async function validateSelectedMatch() {
    const matchId = value('validationMatchId');

    if (!matchId) {
      toast('Pertandingan belum dipilih.', 'error');
      return;
    }

    const data = {
      halfHomeScore: numberValue(
        value('validationHalfHome')
      ),
      halfAwayScore: numberValue(
        value('validationHalfAway')
      ),
      homeScore: numberValue(
        value('validationFullHome')
      ),
      awayScore: numberValue(
        value('validationFullAway')
      ),
      notes: value('validationResultNote'),
      status: 'VALID'
    };

    const knockout = String(
      state.selectedMatch?.stage ||
      ''
    ).toLowerCase().includes('knockout');

    if (
      knockout &&
      data.homeScore === data.awayScore
    ) {
      const penaltyHome = value('validationPenaltyHome');
      const penaltyAway = value('validationPenaltyAway');

      if (
        penaltyHome === '' ||
        penaltyAway === ''
      ) {
        toast('Jika knockout imbang, isi hasil adu penalti.', 'error');
        return;
      }

      data.penaltyHome = numberValue(penaltyHome);
      data.penaltyAway = numberValue(penaltyAway);
    }

    loading(true);

    try {
      const result = await App.validateMatch(
        matchId,
        data
      );

      if (!result?.success) {
        toast(
          result?.message ||
          'Validasi pertandingan gagal.',
          'error'
        );
        return;
      }

      await saveValidationExtras(matchId);
      modalClose('validationModal');
      await reloadMatches();
      await loadSeasonData();
      renderAll();
    } finally {
      loading(false);
    }
  }

  async function saveValidationExtras(matchId) {
    const goalPlayer =
      value('goalHomePlayer') ||
      value('goalAwayPlayer');

    const goalClub =
      value('goalHomePlayer')
        ? matchClubId(state.selectedMatch, 'home')
        : value('goalAwayPlayer')
          ? matchClubId(state.selectedMatch, 'away')
          : '';

    const goalMinute = value('goalMinute');

    if (goalPlayer) {
      await saveSheet('GOALS', {
        id: '',
        eventId: state.eventId,
        seasonId: state.currentSeasonId,
        matchId,
        playerId: goalPlayer,
        clubId: goalClub,
        minute: goalMinute
      });
    }

    const cardPlayer =
      value('cardHomePlayer') ||
      value('cardAwayPlayer');

    const cardClub =
      value('cardHomePlayer')
        ? matchClubId(state.selectedMatch, 'home')
        : value('cardAwayPlayer')
          ? matchClubId(state.selectedMatch, 'away')
          : '';

    if (cardPlayer) {
      await saveSheet('CARDS', {
        id: '',
        eventId: state.eventId,
        seasonId: state.currentSeasonId,
        matchId,
        playerId: cardPlayer,
        clubId: cardClub,
        cardType: value('cardType'),
        minute: value('cardMinute')
      });
    }
  }

  function openPostponeModal(item) {
    if (!item) return;

    setValue('postponeMatchId', rowId(item));
    setValue(
      'postponeDate',
      dateValue(item.date || item.matchDate)
    );
    setValue(
      'postponeTime',
      timeDisplay(item.time || item.matchTime)
    );
    setValue(
      'postponeNotes',
      item.notes || ''
    );

    modalOpen('postponeModal');
  }

  async function savePostpone() {
    const matchId = value('postponeMatchId');
    const date = value('postponeDate');
    const time = value('postponeTime');
    const notes = value('postponeNotes');

    if (!matchId || !date || !time) {
      toast('Data penundaan belum lengkap.', 'error');
      return;
    }

    loading(true);

    try {
      const result = await App.postponeMatch(
        matchId,
        date,
        time,
        notes
      );

      if (!result?.success) {
        toast(
          result?.message ||
          'Pertandingan gagal ditunda.',
          'error'
        );
        return;
      }

      modalClose('postponeModal');
      await reloadMatches();
    } finally {
      loading(false);
    }
  }

  async function createGroups() {
    if (!state.currentSeasonId) {
      toast('Pilih season terlebih dahulu.', 'error');
      return;
    }

    const input = value('groupNames');
    if (!input) {
      toast('Masukkan nama group.', 'error');
      return;
    }

    const names = input
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    if (!names.length) {
      toast('Nama group belum diisi.', 'error');
      return;
    }

    loading(true);

    try {
      const result = await App.createGroups(
        state.currentSeasonId,
        names
      );

      if (!result?.success) {
        toast(
          result?.message ||
          'Gagal membuat group.',
          'error'
        );
        return;
      }

      toast('Group berhasil dibuat.');
      await loadSeasonData();
      renderGroups();
      renderStandings();
    } finally {
      loading(false);
    }
  }

  async function randomizeGroups() {
    if (!state.currentSeasonId) {
      toast('Pilih season terlebih dahulu.', 'error');
      return;
    }

    const selectedClubs = getSelectedRandomizerClubs();
    const groupIds = state.groups.map(rowId);

    if (!groupIds.length) {
      toast('Buat group terlebih dahulu.', 'error');
      return;
    }

    if (!selectedClubs.length) {
      toast('Pilih klub untuk diacak.', 'error');
      return;
    }

    loading(true);

    try {
      const result = await App.randomizeGroups(
        state.currentSeasonId,
        selectedClubs,
        groupIds
      );

      if (!result?.success) {
        toast(
          result?.message ||
          'Pengacakan group gagal.',
          'error'
        );
        return;
      }

      toast('Pembagian group berhasil.');
      await loadSeasonData();
      renderGroups();
      renderStandings();
    } finally {
      loading(false);
    }
  }

  function getSelectedRandomizerClubs() {
    return [...$$(
      '#randomizerClubs input[type="checkbox"]:checked'
    )].map(input => input.value);
  }

  function renderRandomizerClubs() {
    const container = $('randomizerClubs');
    if (!container) return;

    container.innerHTML = [...state.clubs]
      .sort((a, b) =>
        String(a.name || a.nama || '').localeCompare(
          String(b.name || b.nama || ''),
          'id'
        )
      )
      .map(club => `
        <label class="randomizer-club">
          <input
            type="checkbox"
            value="${escape(rowId(club))}"
          >
          <span>${escape(club.name || club.nama || '-')}</span>
        </label>
      `).join('');
  }

  async function finishGroupPhase() {
    if (!state.currentSeasonId) {
      toast('Season belum dipilih.', 'error');
      return;
    }

    if (!confirm(
      'Fase group akan dikunci dan standings tidak dapat berubah otomatis. Lanjutkan?'
    )) {
      return;
    }

    loading(true);

    try {
      const result = await App.finishGroupPhase(
        state.currentSeasonId
      );

      if (!result?.success) {
        toast(
          result?.message ||
          'Gagal menyelesaikan fase group.',
          'error'
        );
        return;
      }

      toast('Fase group berhasil diselesaikan.');

      await App.generateBracket(
        state.currentSeasonId
      );

      await loadSeasonData();
      renderAll();
    } finally {
      loading(false);
    }
  }

  async function generateBracket() {
    if (!state.currentSeasonId) {
      toast('Season belum dipilih.', 'error');
      return;
    }

    loading(true);

    try {
      const result = await App.generateBracket(
        state.currentSeasonId
      );

      if (!result?.success) {
        toast(
          result?.message ||
          'Gagal membuat bracket.',
          'error'
        );
        return;
      }

      toast('Bracket knockout berhasil dibuat.');
      await loadSeasonData();
      renderBracket();
    } finally {
      loading(false);
    }
  }

  function openSponsorModal(item = null) {
    setValue('sponsorId', rowId(item));
    setValue('sponsorName', item?.name || item?.nama || '');
    setValue(
      'sponsorLogoUrl',
      item?.logoUrl ||
      item?.logo ||
      ''
    );
    setChecked(
      'sponsorActive',
      activeValue(item)
    );

    modalOpen('sponsorModal');
  }

  async function saveSponsor() {
    const name = value('sponsorName');

    if (!name) {
      toast('Nama sponsor wajib diisi.', 'error');
      return;
    }

    const data = {
      id: value('sponsorId'),
      eventId: state.eventId,
      seasonId: state.currentSeasonId,
      name,
      logoUrl: value('sponsorLogoUrl'),
      active: checked('sponsorActive')
    };

    loading(true);

    try {
      if (await saveSheet('SPONSORS', data)) {
        modalClose('sponsorModal');
        await loadSponsors();
        renderSponsors();
      }
    } finally {
      loading(false);
    }
  }

  async function uploadSponsorLogo() {
    const input = $('sponsorLogo');
    if (!input?.files?.[0]) return;

    loading(true);

    try {
      const result = await App.uploadFile(
        input.files[0],
        '06_SPONSORS'
      );

      if (!result?.success) {
        toast(result?.message || 'Upload logo gagal.', 'error');
        return;
      }

      setValue(
        'sponsorLogoUrl',
        result.url ||
        result.fileUrl ||
        result.data?.url ||
        ''
      );

      toast('Logo sponsor berhasil diupload.');
    } finally {
      loading(false);
    }
  }

  function openBankModal(item = null) {
    setValue('bankId', rowId(item));
    setValue(
      'bankName',
      item?.bank ||
      item?.bankName ||
      ''
    );
    setValue(
      'bankAccountNumber',
      item?.accountNumber ||
      item?.nomorRekening ||
      ''
    );
    setValue(
      'bankAccountName',
      item?.accountName ||
      item?.namaRekening ||
      ''
    );
    setValue(
      'bankQrUrl',
      item?.qrUrl ||
      item?.qr ||
      ''
    );

    modalOpen('bankModal');
  }

  async function saveBank() {
    if (!state.currentSeasonId) {
      toast('Pilih season terlebih dahulu.', 'error');
      return;
    }

    const bank = value('bankName');
    const accountNumber = value('bankAccountNumber');
    const accountName = value('bankAccountName');

    if (!bank || !accountNumber || !accountName) {
      toast('Data rekening belum lengkap.', 'error');
      return;
    }

    const data = {
      id: value('bankId'),
      eventId: state.eventId,
      seasonId: state.currentSeasonId,
      bank,
      accountNumber,
      accountName,
      qrUrl: value('bankQrUrl')
    };

    loading(true);

    try {
      if (await saveSheet('BANKS', data)) {
        modalClose('bankModal');
        await loadBanks();
        renderBanks();
      }
    } finally {
      loading(false);
    }
  }

  async function uploadBankQr() {
    const input = $('bankQr');
    if (!input?.files?.[0]) return;

    loading(true);

    try {
      const result = await App.uploadFile(
        input.files[0],
        '09_QR'
      );

      if (!result?.success) {
        toast(result?.message || 'Upload QR gagal.', 'error');
        return;
      }

      setValue(
        'bankQrUrl',
        result.url ||
        result.fileUrl ||
        result.data?.url ||
        ''
      );

      toast('QR berhasil diupload.');
    } finally {
      loading(false);
    }
  }

  function openSeasonContactModal(item = null) {
    setValue('seasonContactId', rowId(item));
    setValue(
      'seasonContactType',
      item?.type ||
      item?.jenis ||
      ''
    );
    setValue(
      'seasonContactName',
      item?.name ||
      item?.nama ||
      ''
    );
    setValue(
      'seasonContactLink',
      item?.link ||
      item?.url ||
      ''
    );
    setChecked(
      'seasonContactActive',
      activeValue(item)
    );

    modalOpen('seasonContactModal');
  }

  async function saveSeasonContact() {
    if (!state.currentSeasonId) {
      toast('Pilih season terlebih dahulu.', 'error');
      return;
    }

    const type = value('seasonContactType');
    const name = value('seasonContactName');
    const link = value('seasonContactLink');

    if (!type || !name || !link) {
      toast('Jenis, nama, dan link kontak wajib diisi.', 'error');
      return;
    }

    const data = {
      id: value('seasonContactId'),
      eventId: state.eventId,
      seasonId: state.currentSeasonId,
      type,
      name,
      link,
      active: checked('seasonContactActive')
    };

    loading(true);

    try {
      if (await saveSheet('SEASON_CONTACTS', data)) {
        modalClose('seasonContactModal');

        const rows = await loadSheet('SEASON_CONTACTS');
        state.seasonContacts = filterSeason(rows);

        renderSeasonContacts();
      }
    } finally {
      loading(false);
    }
  }

  function openProfileModal() {
    const event = currentEvent();

    setValue(
      'profileEventId',
      rowId(event)
    );
    setValue(
      'profileEventName',
      event?.name ||
      event?.nama ||
      ''
    );
    setValue(
      'profileDescription',
      event?.description ||
      event?.bio ||
      ''
    );
    setValue(
      'profileLogoUrl',
      event?.logoUrl ||
      event?.logo ||
      ''
    );

    modalOpen('profileModal');
  }

  async function saveProfile() {
    const name = value('profileEventName');

    if (!name) {
      toast('Nama event wajib diisi.', 'error');
      return;
    }

    const event = {
      id: value('profileEventId') || state.eventId,
      eventId: state.eventId,
      name,
      description: value('profileDescription'),
      logoUrl: value('profileLogoUrl')
    };

    loading(true);

    try {
      if (await saveSheet('EVENTS', event)) {
        modalClose('profileModal');
        await loadEvent();
        updateUserInfo();
        renderSeasonInfo();
        updateDashboard();
      }
    } finally {
      loading(false);
    }
  }

  async function uploadEventLogo() {
    const input = $('profileLogo');
    if (!input?.files?.[0]) return;

    loading(true);

    try {
      const result = await App.uploadFile(
        input.files[0],
        '01_EVENTS'
      );

      if (!result?.success) {
        toast(result?.message || 'Upload logo gagal.', 'error');
        return;
      }

      setValue(
        'profileLogoUrl',
        result.url ||
        result.fileUrl ||
        result.data?.url ||
        ''
      );

      toast('Logo event berhasil diupload.');
    } finally {
      loading(false);
    }
  }

  async function finishSeason() {
    if (!state.currentSeasonId) {
      toast('Pilih season terlebih dahulu.', 'error');
      return;
    }

    const season = currentSeason();

    if (!confirm(
      `Season "${season?.name || ''}" akan difinalisasi dan tidak dapat digunakan sebagai season aktif lagi. Lanjutkan?`
    )) {
      return;
    }

    loading(true);

    try {
      const result = await App.finishSeason(
        state.currentSeasonId
      );

      if (!result?.success) {
        toast(
          result?.message ||
          'Finalisasi season gagal.',
          'error'
        );
        return;
      }

      toast('Season berhasil difinalisasi.');

      state.currentSeasonId = '';
      await loadSeasons();

      if (state.seasons.length) {
        state.currentSeasonId = rowId(state.seasons[0]);
      }

      await loadSeasonData();
      renderAll();
      updateDashboard();
    } finally {
      loading(false);
    }
  }

  async function deleteItem(sheet, id, reload) {
    if (!id) return;

    if (!confirm('Data ini akan dihapus. Lanjutkan?')) {
      return;
    }

    loading(true);

    try {
      if (await deleteSheet(sheet, id)) {
        if (reload) await reload();
      }
    } finally {
      loading(false);
    }
  }

  function editById(collection, id, callback) {
    const item = collection.find(
      row => rowId(row) === normalizeId(id)
    );

    if (item) callback(item);
  }

  function setupNavigation() {
    $$('[data-section]').forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.section;
        if (!target) return;

        $$('[data-section]').forEach(item =>
          item.classList.remove('active')
        );

        button.classList.add('active');

        $$('[data-page]').forEach(page => {
          page.classList.toggle(
            'active',
            page.dataset.page === target
          );
        });

        if (window.innerWidth <= 991) {
          $('sidebar')?.classList.remove('open');
          $('sidebarOverlay')?.classList.remove('active');
        }
      });
    });
  }

  function setupEvents() {
    document.addEventListener('click', async event => {
      const sectionLink = event.target.closest('[data-section-link]');

      if (sectionLink) {
        event.preventDefault();
        const targetSection = sectionLink.dataset.sectionLink;
        const navigationButton = document.querySelector(
          `[data-section="${targetSection}"]`
        );

        navigationButton?.click();
        modalOpen('seasonModal');
        return;
      }

      const modalTrigger = event.target.closest('[data-modal]');

      if (modalTrigger) {
        event.preventDefault();
        modalOpen(modalTrigger.dataset.modal);
        return;
      }

      const modalCloseButton = event.target.closest('[data-close-modal]');

      if (modalCloseButton) {
        event.preventDefault();
        const modal = modalCloseButton.closest('.modal');
        modalClose(modal?.id || modalCloseButton.dataset.modal);
        return;
      }

      const target = event.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const id = target.dataset.id;

      switch (action) {
        case 'login':
          await login();
          break;

        case 'logout':
          App.logout();
          break;

        case 'close-modal':
          modalClose(target.dataset.modal);
          break;

        case 'new-season':
          openSeasonModal();
          break;

        case 'edit-season':
          editById(
            state.seasons,
            id,
            openSeasonModal
          );
          break;

        case 'delete-season':
          await deleteItem(
            'SEASONS',
            id,
            async () => {
              await loadSeasons();
              await loadSeasonData();
              renderAll();
            }
          );
          break;

        case 'new-committee':
          openCommitteeModal();
          break;

        case 'edit-committee':
          editById(
            state.committee,
            id,
            openCommitteeModal
          );
          break;

        case 'delete-committee':
          await deleteItem(
            'COMMITTEE',
            id,
            async () => {
              await loadCommittee();
              renderCommittee();
            }
          );
          break;

        case 'new-club':
          openClubModal();
          break;

        case 'edit-club':
          editById(
            state.clubs,
            id,
            openClubModal
          );
          break;

        case 'delete-club':
          await deleteItem(
            'CLUBS',
            id,
            async () => {
              await loadClubs();
              renderClubs();
              populateClubSelects();
            }
          );
          break;

        case 'new-person':
          openPersonModal();
          break;

        case 'edit-person':
          editById(
            state.people,
            id,
            openPersonModal
          );
          break;

        case 'delete-person':
          await deleteItem(
            'PEOPLE',
            id,
            async () => {
              await loadPeople();
              renderPeople();
            }
          );
          break;

        case 'new-match':
          if (!state.currentSeasonId) {
            toast('Buat atau pilih season terlebih dahulu.', 'error');
            break;
          }

          openMatchModal();
          break;

        case 'edit-match':
          editById(
            state.matches,
            id,
            openMatchModal
          );
          break;

        case 'delete-match':
          await deleteItem(
            'MATCHES',
            id,
            reloadMatches
          );
          break;

        case 'validate-match':
          editById(
            state.matches,
            id,
            openValidationModal
          );
          break;

        case 'postpone-match':
          editById(
            state.matches,
            id,
            openPostponeModal
          );
          break;

        case 'new-sponsor':
          openSponsorModal();
          break;

        case 'edit-sponsor':
          editById(
            state.sponsors,
            id,
            openSponsorModal
          );
          break;

        case 'delete-sponsor':
          await deleteItem(
            'SPONSORS',
            id,
            async () => {
              await loadSponsors();
              renderSponsors();
            }
          );
          break;

        case 'new-bank':
          openBankModal();
          break;

        case 'edit-bank':
          editById(
            state.banks,
            id,
            openBankModal
          );
          break;

        case 'delete-bank':
          await deleteItem(
            'BANKS',
            id,
            async () => {
              await loadBanks();
              renderBanks();
            }
          );
          break;

        case 'new-season-contact':
          openSeasonContactModal();
          break;

        case 'edit-season-contact':
          editById(
            state.seasonContacts,
            id,
            openSeasonContactModal
          );
          break;

        case 'delete-season-contact':
          await deleteItem(
            'SEASON_CONTACTS',
            id,
            async () => {
              const rows = await loadSheet('SEASON_CONTACTS');
              state.seasonContacts = filterSeason(rows);
              renderSeasonContacts();
            }
          );
          break;

        case 'profile':
          openProfileModal();
          break;

        case 'finish-group':
          await finishGroupPhase();
          break;

        case 'generate-bracket':
          await generateBracket();
          break;

        case 'finish-season':
          await finishSeason();
          break;

        case 'randomize-groups':
          await randomizeGroups();
          break;

        case 'create-groups':
          await createGroups();
          break;

        case 'upload-club-logo':
          await uploadClubLogo();
          break;

        case 'upload-sponsor-logo':
          await uploadSponsorLogo();
          break;

        case 'upload-bank-qr':
          await uploadBankQr();
          break;

        case 'upload-event-logo':
          await uploadEventLogo();
          break;

        case 'validate-selected':
          await validateSelectedMatch();
          break;

        case 'postpone-selected':
          await savePostpone();
          break;

        case 'save-season':
          await saveSeason();
          break;

        case 'save-committee':
          await saveCommittee();
          break;

        case 'save-club':
          await saveClub();
          break;

        case 'save-person':
          await savePerson();
          break;

        case 'save-match':
          await saveMatch();
          break;

        case 'save-sponsor':
          await saveSponsor();
          break;

        case 'save-bank':
          await saveBank();
          break;

        case 'save-season-contact':
          await saveSeasonContact();
          break;

        case 'save-profile':
          await saveProfile();
          break;
      }
    });

    document.addEventListener('change', event => {
      const target = event.target;

      if (
        target.matches('#seasonSelector') ||
        target.matches('#groupSeasonSelect') ||
        target.matches('#standingsSeasonSelect') ||
        target.matches('#knockoutSeasonSelect') ||
        target.matches('#validationSeasonSelect') ||
        target.matches('#topScorerSeasonSelect') ||
        target.matches('#historySeasonSelect')
      ) {
        selectSeason(target.value);
      }

      if (target.matches('#matchPhase')) {
        updateMatchMode();
      }
    });

    document.addEventListener('input', event => {
      if (
        event.target.matches('#clubSearch')
      ) {
        renderClubs();
      }

      if (
        event.target.matches('#peopleSearch')
      ) {
        renderPeople();
      }

      if (
        event.target.matches('#matchSearch') ||
        event.target.matches('#matchStatusFilter')
      ) {
        renderMatches();
      }
    });
  }

  function setupLogin() {
    const form = $('loginForm');

    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        await login();
      });
    }

    const toggle = $('toggleLoginPassword');

    if (toggle) {
      toggle.addEventListener('click', () => {
        const input = $('loginPassword');
        if (!input) return;

        input.type =
          input.type === 'password'
            ? 'text'
            : 'password';

        toggle.innerHTML =
          input.type === 'password'
            ? '<i class="bi bi-eye"></i>'
            : '<i class="bi bi-eye-slash"></i>';
      });
    }
  }

  function setupSidebar() {
    const button = $('sidebarOpen');
    const sidebar = $('sidebar');
    const close = $('sidebarClose');
    const overlay = $('sidebarOverlay');

    const closeSidebar = () => {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('active');
    };

    const openSidebar = () => {
      sidebar?.classList.add('open');
      overlay?.classList.add('active');
    };

    button?.addEventListener('click', () => {
      if (sidebar?.classList.contains('open')) closeSidebar();
      else openSidebar();
    });

    close?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);

    let touchStartX = 0;

    document.addEventListener('touchstart', event => {
      if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
      }
    }, { passive: true });

    document.addEventListener('touchend', event => {
      if (!touchStartX || event.changedTouches.length !== 1) return;

      const distance = event.changedTouches[0].clientX - touchStartX;

      if (window.innerWidth <= 800 && Math.abs(distance) >= 55) {
        if (distance > 0 && touchStartX <= 48) openSidebar();
        if (distance < 0) closeSidebar();
      }

      touchStartX = 0;
    }, { passive: true });
  }

  function setupForms() {
    const seasonForm = $('seasonForm');
    if (seasonForm) {
      seasonForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveSeason();
      });
    }

    const committeeForm = $('committeeForm');
    if (committeeForm) {
      committeeForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveCommittee();
      });
    }

    const clubForm = $('clubForm');
    if (clubForm) {
      clubForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveClub();
      });
    }

    const personForm = $('personForm');
    if (personForm) {
      personForm.addEventListener('submit', async event => {
        event.preventDefault();
        await savePerson();
      });
    }

    const matchForm = $('matchForm');
    if (matchForm) {
      matchForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveMatch();
      });
    }

    const validationForm = $('validationForm');
    if (validationForm) {
      validationForm.addEventListener('submit', async event => {
        event.preventDefault();
        await validateSelectedMatch();
      });
    }

    const postponeForm = $('postponeForm');
    if (postponeForm) {
      postponeForm.addEventListener('submit', async event => {
        event.preventDefault();
        await savePostpone();
      });
    }

    const sponsorForm = $('sponsorForm');
    if (sponsorForm) {
      sponsorForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveSponsor();
      });
    }

    const bankForm = $('bankForm');
    if (bankForm) {
      bankForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveBank();
      });
    }

    const seasonContactForm = $('seasonContactForm');
    if (seasonContactForm) {
      seasonContactForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveSeasonContact();
      });
    }

    const profileForm = $('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', async event => {
        event.preventDefault();
        await saveProfile();
      });
    }
  }

  function preparePage() {
    renderRandomizerClubs();

    const currentSeasonSelector = $('seasonSelector');

    if (currentSeasonSelector) {
      currentSeasonSelector.value =
        state.currentSeasonId;
    }
  }

  setupLogin();
  setupNavigation();
  setupEvents();
  setupSidebar();
  setupForms();

  init().then(() => {
    preparePage();
  });
});
