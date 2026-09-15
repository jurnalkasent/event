const CONFIG = {
  ROOT_FOLDER_ID: '1EcGy_R6cn2IZbc-9xr9OiTeNuq9Zr6dA',
  SPREADSHEET_ID: '1VuwMcr6Tmz8Q4OKxXJuXBhVlU4yXTdaUE9v6EPhiUkY',
  SPREADSHEET_NAME: 'JURNAL_KASENT_DATABASE',
  TIMEZONE: 'Asia/Makassar',
  MASTER_USERNAME: 'Keeki',
  MASTER_PASSWORD: 'Rizqi193@',
  TOKEN_EXPIRY_HOURS: 12
};

const SHEETS = {
  SETTINGS: 'SETTINGS',
  USERS: 'USERS',
  EVENTS: 'EVENTS',
  SEASONS: 'SEASONS',
  CONTACTS: 'CONTACTS',
  COMMITTEE: 'COMMITTEE',
  CLUBS: 'CLUBS',
  PEOPLE: 'PEOPLE',
  MATCHES: 'MATCHES',
  VALIDATIONS: 'VALIDATIONS',
  GOALS: 'GOALS',
  CARDS: 'CARDS',
  GROUPS: 'GROUPS',
  GROUP_MEMBERS: 'GROUP_MEMBERS',
  GROUP_STANDINGS: 'GROUP_STANDINGS',
  SPONSORS: 'SPONSORS',
  BANKS: 'BANKS',
  SEASON_CONTACTS: 'SEASON_CONTACTS',
  BRACKETS: 'BRACKETS',
  HISTORY: 'HISTORY',
  TOKENS: 'TOKENS'
};

const HEADERS = {
  SETTINGS: [
    'id',
    'key',
    'value',
    'createdAt',
    'updatedAt'
  ],
  USERS: [
    'id',
    'eventId',
    'name',
    'username',
    'password',
    'role',
    'active',
    'createdAt',
    'updatedAt'
  ],
  EVENTS: [
    'id',
    'name',
    'slug',
    'logoFileId',
    'logoUrl',
    'active',
    'createdAt',
    'updatedAt'
  ],
  SEASONS: [
    'id',
    'eventId',
    'name',
    'bio',
    'eventType',
    'status',
    'completed',
    'createdAt',
    'updatedAt'
  ],
  CONTACTS: [
    'id',
    'type',
    'name',
    'link',
    'active',
    'createdAt',
    'updatedAt'
  ],
  COMMITTEE: [
    'id',
    'eventId',
    'seasonId',
    'name',
    'position',
    'phone',
    'sortOrder',
    'active',
    'createdAt',
    'updatedAt'
  ],
  CLUBS: [
    'id',
    'eventId',
    'seasonId',
    'name',
    'managerName',
    'managerPhone',
    'logoFileId',
    'logoUrl',
    'active',
    'createdAt',
    'updatedAt'
  ],
  PEOPLE: [
    'id',
    'eventId',
    'seasonId',
    'clubId',
    'name',
    'position',
    'phone',
    'active',
    'createdAt',
    'updatedAt'
  ],
  MATCHES: [
    'id',
    'eventId',
    'seasonId',
    'matchType',
    'stage',
    'matchNumber',
    'groupName',
    'matchDate',
    'matchTime',
    'homeClubId',
    'awayClubId',
    'homeClubName',
    'awayClubName',
    'status',
    'postponedDate',
    'postponedTime',
    'notes',
    'createdAt',
    'updatedAt'
  ],
  VALIDATIONS: [
    'id',
    'matchId',
    'seasonId',
    'status',
    'halfHome',
    'halfAway',
    'fullHome',
    'fullAway',
    'penaltyHome',
    'penaltyAway',
    'validatedBy',
    'validatedAt',
    'notes',
    'createdAt',
    'updatedAt'
  ],
  GOALS: [
    'id',
    'matchId',
    'seasonId',
    'clubId',
    'playerId',
    'playerName',
    'minute',
    'period',
    'createdAt',
    'updatedAt'
  ],
  CARDS: [
    'id',
    'matchId',
    'seasonId',
    'clubId',
    'playerId',
    'playerName',
    'cardType',
    'minute',
    'createdAt',
    'updatedAt'
  ],
  GROUPS: [
    'id',
    'seasonId',
    'name',
    'status',
    'createdAt',
    'updatedAt'
  ],
  GROUP_MEMBERS: [
    'id',
    'groupId',
    'seasonId',
    'clubId',
    'clubName',
    'createdAt',
    'updatedAt'
  ],
  GROUP_STANDINGS: [
    'id',
    'seasonId',
    'groupId',
    'clubId',
    'clubName',
    'played',
    'wins',
    'draws',
    'losses',
    'goalsFor',
    'goalsAgainst',
    'goalDifference',
    'points',
    'position',
    'frozen',
    'createdAt',
    'updatedAt'
  ],
  SPONSORS: [
    'id',
    'eventId',
    'seasonId',
    'name',
    'logoFileId',
    'logoUrl',
    'active',
    'createdAt',
    'updatedAt'
  ],
  BANKS: [
    'id',
    'seasonId',
    'bankName',
    'accountNumber',
    'accountName',
    'qrFileId',
    'qrUrl',
    'active',
    'createdAt',
    'updatedAt'
  ],
  SEASON_CONTACTS: [
    'id',
    'seasonId',
    'type',
    'name',
    'phone',
    'link',
    'active',
    'createdAt',
    'updatedAt'
  ],
  BRACKETS: [
    'id',
    'seasonId',
    'stage',
    'matchCode',
    'leftSource',
    'rightSource',
    'leftClubId',
    'rightClubId',
    'leftClubName',
    'rightClubName',
    'winnerClubId',
    'winnerClubName',
    'matchId',
    'position',
    'createdAt',
    'updatedAt'
  ],
  HISTORY: [
    'id',
    'seasonId',
    'matchId',
    'action',
    'snapshot',
    'createdBy',
    'createdAt'
  ],
  TOKENS: [
    'token',
    'userId',
    'role',
    'eventId',
    'expiresAt',
    'createdAt'
  ]
};

const FOLDERS = [
  '01_EVENTS',
  '02_SEASONS',
  '03_CLUBS',
  '04_PEOPLE',
  '05_MATCHES',
  '06_SPONSORS',
  '07_CONTACTS',
  '08_LOGOS',
  '09_QR',
  '10_DOCUMENTS',
  '99_ARCHIVE'
];

function doGet(e) {
  if (
    e &&
    e.parameter &&
    e.parameter.action === 'setup'
  ) {
    return jsonOutput(setupDatabase());
  }

  return jsonOutput({
    success: true,
    app: 'JURNAL KASENT API',
    version: '2.0.0',
    time: now()
  });
}

function initializeDatabase() {
  return setupDatabase();
}

function doPost(e) {
  try {
    const body = parseRequest(e);
    const action = String(body.action || '').trim();

    if (action === 'setup') {
      return jsonOutput(setupDatabase());
    }

    if (action === 'login') {
      return jsonOutput(login(body));
    }

    if (action === 'logout') {
      return jsonOutput(logout(body));
    }

    if (action === 'publicData') {
      return jsonOutput(getPublicData());
    }

    const auth = authorize(body.token, body.requiredRole || '');

    if (!auth.success) {
      return jsonOutput(auth);
    }

    let result;

    switch (action) {
      case 'dashboard':
        result = getDashboard(auth);
        break;

      case 'list':
        result = listData(body, auth);
        break;

      case 'save':
        result = saveData(body, auth);
        break;

      case 'delete':
        result = deleteData(body, auth);
        break;

      case 'uploadFile':
        result = uploadFile(body, auth);
        break;

      case 'createGroups':
        result = createGroups(body, auth);
        break;

      case 'randomizeGroups':
        result = randomizeGroups(body, auth);
        break;

      case 'finishGroupPhase':
        result = finishGroupPhase(body, auth);
        break;

      case 'generateBracket':
        result = generateBracket(body, auth);
        break;

      case 'validateMatch':
        result = validateMatch(body, auth);
        break;

      case 'postponeMatch':
        result = postponeMatch(body, auth);
        break;

      case 'finishSeason':
        result = finishSeason(body, auth);
        break;

      case 'topScorers':
        result = getTopScorers(body, auth);
        break;

      case 'history':
        result = getHistory(body, auth);
        break;

      case 'groupStandings':
        result = getGroupStandings(body, auth);
        break;

      case 'bracket':
        result = getBracket(body, auth);
        break;

      default:
        result = {
          success: false,
          message: 'Action tidak dikenali'
        };
    }

    return jsonOutput(result);
  } catch (error) {
    return jsonOutput({
      success: false,
      message: error.message || 'Terjadi kesalahan server'
    });
  }
}

function setupDatabase() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const properties = PropertiesService.getScriptProperties();
    let spreadsheetId = CONFIG.SPREADSHEET_ID ||
      properties.getProperty('SPREADSHEET_ID');
    let spreadsheet = null;

    if (spreadsheetId) {
      try {
        spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      } catch (error) {
        throw new Error(
          'Spreadsheet tidak dapat dibuka. Pastikan ID benar dan akun Apps Script memiliki akses Editor.'
        );
      }
    }

    if (!spreadsheet) {
      spreadsheet = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    }

    properties.setProperty('SPREADSHEET_ID', spreadsheet.getId());

    Object.keys(SHEETS).forEach(function(key) {
      const sheetName = SHEETS[key];
      const sheet = spreadsheet.getSheetByName(sheetName) ||
        spreadsheet.insertSheet(sheetName);

      ensureSheetHeaders(sheet, HEADERS[key]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS[key].length)
        .setFontWeight('bold')
        .setBackground('#013b85')
        .setFontColor('#ffffff');
    });

    removeEmptyDefaultSheet(spreadsheet);

    const rootFolder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);

    FOLDERS.forEach(function(folderName) {
      getOrCreateFolder(rootFolder, folderName);
    });

    properties.setProperty('MASTER_USERNAME', CONFIG.MASTER_USERNAME);
    properties.setProperty('MASTER_PASSWORD', CONFIG.MASTER_PASSWORD);
    seedSettings();
    seedMasterAdmin();

    return {
      success: true,
      message: 'Database berhasil disiapkan',
      spreadsheetId: spreadsheet.getId(),
      spreadsheetUrl: spreadsheet.getUrl(),
      rootFolderId: CONFIG.ROOT_FOLDER_ID,
      masterUsername: CONFIG.MASTER_USERNAME,
      sheets: Object.keys(SHEETS).map(function(key) {
        return SHEETS[key];
      })
    };
  } finally {
    lock.releaseLock();
  }
}

function ensureSheetHeaders(sheet, headers) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow === 0 || lastColumn === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .map(function(value) {
      return String(value || '').trim();
    });

  if (headers.every(function(header, index) {
    return currentHeaders[index] === header;
  }) && currentHeaders.length === headers.length) {
    return;
  }

  const oldRows = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues()
    : [];
  const oldIndex = {};

  currentHeaders.forEach(function(header, index) {
    if (header) {
      oldIndex[header] = index;
    }
  });

  const migratedRows = oldRows.map(function(row) {
    return headers.map(function(header) {
      return oldIndex[header] === undefined
        ? ''
        : row[oldIndex[header]];
    });
  });

  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  if (migratedRows.length) {
    sheet.getRange(2, 1, migratedRows.length, headers.length)
      .setValues(migratedRows);
  }
}

function removeEmptyDefaultSheet(spreadsheet) {
  const defaultSheet = spreadsheet.getSheetByName('Sheet1');

  if (
    defaultSheet &&
    spreadsheet.getSheets().length > 1 &&
    defaultSheet.getLastRow() === 0 &&
    defaultSheet.getLastColumn() === 0
  ) {
    spreadsheet.deleteSheet(defaultSheet);
  }
}

function seedSettings() {
  const settings = readRows(SHEETS.SETTINGS);
  const defaults = {
    timezone: CONFIG.TIMEZONE,
    databaseVersion: '2.0.0'
  };

  Object.keys(defaults).forEach(function(key) {
    const existing = settings.find(function(item) {
      return item.key === key;
    });

    if (!existing) {
      appendRow(SHEETS.SETTINGS, {
        id: Utilities.getUuid(),
        key: key,
        value: defaults[key],
        createdAt: now(),
        updatedAt: now()
      });
    }
  });
}

function seedMasterAdmin() {
  const users = readRows(SHEETS.USERS);
  const existing = users.find(function(user) {
    return String(user.username || '').trim() === CONFIG.MASTER_USERNAME;
  });

  if (existing) {
    return existing;
  }

  return appendRow(SHEETS.USERS, {
    id: 'MASTER_ADMIN',
    eventId: '',
    name: 'Master Admin',
    username: CONFIG.MASTER_USERNAME,
    password: CONFIG.MASTER_PASSWORD,
    role: 'master',
    active: true,
    createdAt: now(),
    updatedAt: now()
  });
}

function login(body) {
  const username = String(body.username || '').trim();
  const password = String(body.password || '');

  if (!username || !password) {
    return {
      success: false,
      message: 'Username dan password wajib diisi'
    };
  }

  if (
    username === CONFIG.MASTER_USERNAME &&
    password === CONFIG.MASTER_PASSWORD
  ) {
    return createSession({
      id: 'MASTER_ADMIN',
      name: 'Master Admin',
      username: CONFIG.MASTER_USERNAME,
      role: 'master',
      eventId: ''
    });
  }

  const users = readRows(SHEETS.USERS);

  const user = users.find(function(item) {
    return String(item.username) === username &&
      String(item.password) === password &&
      toBoolean(item.active);
  });

  if (!user) {
    return {
      success: false,
      message: 'Username atau password salah'
    };
  }

  return createSession({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role || 'event',
    eventId: user.eventId || ''
  });
}

function createSession(user) {
  const token = Utilities.getUuid();

  const expiresAt = new Date(
    Date.now() + CONFIG.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  ).toISOString();

  appendRow(SHEETS.TOKENS, {
    token: token,
    userId: user.id,
    role: user.role,
    eventId: user.eventId,
    expiresAt: expiresAt,
    createdAt: now()
  });

  return {
    success: true,
    token: token,
    expiresAt: expiresAt,
    user: user
  };
}

function logout(body) {
  const token = String(body.token || '');

  if (!token) {
    return {
      success: true,
      message: 'Logout berhasil'
    };
  }

  const tokens = readRows(SHEETS.TOKENS);

  const index = tokens.findIndex(function(item) {
    return item.token === token;
  });

  if (index >= 0) {
    deleteRow(SHEETS.TOKENS, index + 2);
  }

  return {
    success: true,
    message: 'Logout berhasil'
  };
}

function authorize(token, requiredRole) {
  if (!token) {
    return {
      success: false,
      message: 'Token tidak ditemukan'
    };
  }

  const tokens = readRows(SHEETS.TOKENS);

  const session = tokens.find(function(item) {
    return item.token === token;
  });

  if (!session) {
    return {
      success: false,
      message: 'Sesi tidak valid'
    };
  }

  if (!session.expiresAt) {
    return {
      success: false,
      message: 'Sesi tidak valid'
    };
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    return {
      success: false,
      message: 'Sesi sudah kedaluwarsa'
    };
  }

  if (
    requiredRole &&
    session.role !== requiredRole &&
    session.role !== 'master'
  ) {
    return {
      success: false,
      message: 'Akses ditolak'
    };
  }

  return {
    success: true,
    session: session
  };
}

function getDashboard(auth) {
  const session = auth.session;

  const events = readRows(SHEETS.EVENTS);
  const seasons = readRows(SHEETS.SEASONS);
  const users = readRows(SHEETS.USERS);
  const clubs = readRows(SHEETS.CLUBS);
  const matches = readRows(SHEETS.MATCHES);
  const sponsors = readRows(SHEETS.SPONSORS);

  const filteredEvents = session.role === 'master'
    ? events
    : events.filter(function(item) {
        return item.id === session.eventId;
      });

  const filteredSeasons = session.role === 'master'
    ? seasons
    : seasons.filter(function(item) {
        return item.eventId === session.eventId;
      });

  const filteredUsers = session.role === 'master'
    ? users
    : users.filter(function(item) {
        return item.eventId === session.eventId;
      });

  const filteredClubs = session.role === 'master'
    ? clubs
    : clubs.filter(function(item) {
        return item.eventId === session.eventId;
      });

  const filteredMatches = session.role === 'master'
    ? matches
    : matches.filter(function(item) {
        return item.eventId === session.eventId;
      });

  const filteredSponsors = session.role === 'master'
    ? sponsors
    : sponsors.filter(function(item) {
        return item.eventId === session.eventId;
      });

  return {
    success: true,
    data: {
      events: filteredEvents,
      seasons: filteredSeasons,
      users: filteredUsers,
      clubs: filteredClubs,
      matches: filteredMatches,
      sponsors: filteredSponsors,
      counts: {
        events: filteredEvents.length,
        seasons: filteredSeasons.length,
        users: filteredUsers.length,
        clubs: filteredClubs.length,
        matches: filteredMatches.length,
        sponsors: filteredSponsors.length
      }
    }
  };
}

function listData(body, auth) {
  const sheetName = body.sheet;
  const session = auth.session;

  if (!HEADERS[sheetName]) {
    return {
      success: false,
      message: 'Sheet tidak diizinkan'
    };
  }

  if (sheetName === SHEETS.HISTORY && session.role !== 'master') {
    const historyRows = readRows(SHEETS.HISTORY).filter(function(item) {
      return seasonBelongsToEvent(item.seasonId, session.eventId);
    });

    return {
      success: true,
      data: filterRows(historyRows, body)
    };
  }

  let rows = readRows(sheetName);

  rows = scopeRows(rows, sheetName, session);

  if (body.seasonId) {
    rows = rows.filter(function(item) {
      return !item.seasonId || item.seasonId === body.seasonId;
    });
  }

  rows = filterRows(rows, body);

  return {
    success: true,
    data: rows
  };
}

function saveData(body, auth) {
  const sheetName = body.sheet;
  const input = body.data || {};
  const session = auth.session;

  if (!HEADERS[sheetName]) {
    return {
      success: false,
      message: 'Sheet tidak diizinkan'
    };
  }

  if (
    sheetName === SHEETS.HISTORY ||
    sheetName === SHEETS.TOKENS
  ) {
    return {
      success: false,
      message: 'Sheet tersebut tidak dapat diubah melalui CRUD'
    };
  }

  if (
    session.role !== 'master' &&
    !canAccessData(sheetName, input, session)
  ) {
    return {
      success: false,
      message: 'Akses data ditolak'
    };
  }

  if (
    sheetName === SHEETS.USERS &&
    session.role !== 'master'
  ) {
    return {
      success: false,
      message: 'Hanya Master Admin yang dapat mengubah admin'
    };
  }

  if (
    sheetName === SHEETS.SEASONS &&
    session.role !== 'master' &&
    input.eventId !== session.eventId
  ) {
    return {
      success: false,
      message: 'Season bukan milik event sesi ini'
    };
  }

  if (
    sheetName !== SHEETS.EVENTS &&
    sheetName !== SHEETS.USERS &&
    session.role !== 'master' &&
    !input.eventId &&
    input.seasonId
  ) {
    const season = getSeason(input.seasonId);

    if (!season || season.eventId !== session.eventId) {
      return {
        success: false,
        message: 'Season tidak sesuai event'
      };
    }
  }

  if (sheetName === SHEETS.COMMITTEE) {
    const validation = validateCommitteeInput(input, session);

    if (!validation.success) {
      return validation;
    }
  }

  if (sheetName === SHEETS.SEASONS) {
    const validation = validateSeasonInput(input, session);

    if (!validation.success) {
      return validation;
    }
  }

  if (
    sheetName !== SHEETS.EVENTS &&
    sheetName !== SHEETS.USERS &&
    sheetName !== SHEETS.SEASONS &&
    input.seasonId
  ) {
    const seasonCheck = requireSeason(input.seasonId);

    if (!seasonCheck.success) {
      return seasonCheck;
    }
  }

  const result = upsertRow(sheetName, prepareData(sheetName, input));

  writeHistory({
    seasonId: input.seasonId || '',
    matchId: input.matchId || '',
    action: 'SAVE_' + sheetName,
    snapshot: result,
    createdBy: session.userId || session.token
  });

  return {
    success: true,
    data: result
  };
}

function deleteData(body, auth) {
  const sheetName = body.sheet;
  const id = String(body.id || '');
  const session = auth.session;

  if (!HEADERS[sheetName]) {
    return {
      success: false,
      message: 'Sheet tidak diizinkan'
    };
  }

  if (
    sheetName === SHEETS.HISTORY ||
    sheetName === SHEETS.TOKENS
  ) {
    return {
      success: false,
      message: 'Data tersebut bersifat terlindungi'
    };
  }

  const rows = readRows(sheetName);

  const rowIndex = rows.findIndex(function(item) {
    return item.id === id;
  });

  if (rowIndex < 0) {
    return {
      success: false,
      message: 'Data tidak ditemukan'
    };
  }

  const target = rows[rowIndex];

  if (
    session.role !== 'master' &&
    !canAccessData(sheetName, target, session)
  ) {
    return {
      success: false,
      message: 'Akses data ditolak'
    };
  }

  if (
    sheetName === SHEETS.EVENTS &&
    session.role !== 'master'
  ) {
    return {
      success: false,
      message: 'Hanya Master Admin yang dapat menghapus event'
    };
  }

  deleteRow(sheetName, rowIndex + 2);

  writeHistory({
    seasonId: target.seasonId || '',
    matchId: target.matchId || '',
    action: 'DELETE_' + sheetName,
    snapshot: target,
    createdBy: session.userId || session.token
  });

  return {
    success: true,
    message: 'Data berhasil dihapus'
  };
}

function uploadFile(body, auth) {
  const fileName = String(body.fileName || '').trim();
  const mimeType = String(body.mimeType || 'application/octet-stream');
  const base64 = String(body.base64 || '');
  const folderType = String(body.folderType || '10_DOCUMENTS');

  if (!fileName || !base64) {
    return {
      success: false,
      message: 'File tidak lengkap'
    };
  }

  if (FOLDERS.indexOf(folderType) === -1) {
    return {
      success: false,
      message: 'Folder upload tidak diizinkan'
    };
  }

  const rootFolder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
  const folder = getOrCreateFolder(rootFolder, folderType);

  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const file = folder.createFile(blob);

  return {
    success: true,
    data: {
      fileId: file.getId(),
      fileName: file.getName(),
      url: 'https://drive.google.com/uc?export=view&id=' + file.getId()
    }
  };
}

function createGroups(body, auth) {
  const seasonId = String(body.seasonId || '');
  const names = Array.isArray(body.names) ? body.names : [];

  const seasonCheck = requireSeason(seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  if (!names.length) {
    return {
      success: false,
      message: 'Jumlah grup wajib diisi'
    };
  }

  if (seasonCheck.season.status === 'group_finished') {
    return {
      success: false,
      message: 'Fase grup sudah diselesaikan'
    };
  }

  const cleanNames = names
    .map(function(name) {
      return String(name || '').trim();
    })
    .filter(Boolean);

  const uniqueNames = [];

  cleanNames.forEach(function(name) {
    if (uniqueNames.indexOf(name) === -1) {
      uniqueNames.push(name);
    }
  });

  const existing = readRows(SHEETS.GROUPS).filter(function(item) {
    return item.seasonId === seasonId;
  });

  existing.forEach(function(group) {
    deleteGroupMembers(group.id);
    deleteById(SHEETS.GROUPS, group.id);
  });

  const created = uniqueNames.map(function(name, index) {
    return upsertRow(SHEETS.GROUPS, {
      id: Utilities.getUuid(),
      seasonId: seasonId,
      name: name || String.fromCharCode(65 + index),
      status: 'draft',
      createdAt: now(),
      updatedAt: now()
    });
  });

  return {
    success: true,
    data: created
  };
}

function randomizeGroups(body, auth) {
  const seasonId = String(body.seasonId || '');
  const clubIds = Array.isArray(body.clubIds) ? body.clubIds : [];
  const groupIds = Array.isArray(body.groupIds) ? body.groupIds : [];

  const seasonCheck = requireSeason(seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  if (seasonCheck.season.status === 'group_finished') {
    return {
      success: false,
      message: 'Fase grup sudah diselesaikan'
    };
  }

  if (!clubIds.length || !groupIds.length) {
    return {
      success: false,
      message: 'Klub dan grup wajib diisi'
    };
  }

  const clubs = readRows(SHEETS.CLUBS).filter(function(club) {
    return clubIds.indexOf(club.id) !== -1 &&
      club.seasonId === seasonId &&
      toBoolean(club.active);
  });

  const groups = readRows(SHEETS.GROUPS).filter(function(group) {
    return groupIds.indexOf(group.id) !== -1 &&
      group.seasonId === seasonId;
  });

  if (!clubs.length || !groups.length) {
    return {
      success: false,
      message: 'Klub atau grup tidak ditemukan'
    };
  }

  const oldMembers = readRows(SHEETS.GROUP_MEMBERS).filter(function(member) {
    return member.seasonId === seasonId;
  });

  oldMembers.forEach(function(member) {
    deleteById(SHEETS.GROUP_MEMBERS, member.id);
  });

  const shuffled = shuffleArray(clubs);
  const members = [];

  shuffled.forEach(function(club, index) {
    const group = groups[index % groups.length];

    members.push(
      upsertRow(SHEETS.GROUP_MEMBERS, {
        id: Utilities.getUuid(),
        groupId: group.id,
        seasonId: seasonId,
        clubId: club.id,
        clubName: club.name,
        createdAt: now(),
        updatedAt: now()
      })
    );
  });

  return {
    success: true,
    data: members
  };
}

function finishGroupPhase(body, auth) {
  const seasonId = String(body.seasonId || '');

  const seasonCheck = requireSeason(seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  const season = seasonCheck.season;

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  if (season.status === 'group_finished') {
    return {
      success: false,
      message: 'Fase grup sudah diselesaikan'
    };
  }

  const groups = readRows(SHEETS.GROUPS).filter(function(group) {
    return group.seasonId === seasonId;
  });

  if (groups.length < 2) {
    return {
      success: false,
      message: 'Buat grup terlebih dahulu'
    };
  }

  const members = readRows(SHEETS.GROUP_MEMBERS).filter(function(member) {
    return member.seasonId === seasonId;
  });

  if (!members.length) {
    return {
      success: false,
      message: 'Masukkan klub ke grup terlebih dahulu'
    };
  }

  groups.forEach(function(group) {
    const standings = calculateGroupStanding(seasonId, group.id);

    standings.forEach(function(row, index) {
      upsertRow(SHEETS.GROUP_STANDINGS, {
        id: Utilities.getUuid(),
        seasonId: seasonId,
        groupId: group.id,
        clubId: row.clubId,
        clubName: row.clubName,
        played: row.played,
        wins: row.wins,
        draws: row.draws,
        losses: row.losses,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDifference: row.goalDifference,
        points: row.points,
        position: index + 1,
        frozen: true,
        createdAt: now(),
        updatedAt: now()
      });
    });

    group.status = 'finished';
    group.updatedAt = now();

    upsertRow(SHEETS.GROUPS, group);
  });

  season.status = 'group_finished';
  season.completed = false;
  season.updatedAt = now();

  upsertRow(SHEETS.SEASONS, season);

  const bracketResult = generateBracket(
    {
      seasonId: seasonId
    },
    auth
  );

  if (!bracketResult.success) {
    return bracketResult;
  }

  writeHistory({
    seasonId: seasonId,
    action: 'FINISH_GROUP_PHASE',
    snapshot: {
      season: season,
      groups: groups
    },
    createdBy: auth.session.userId || auth.session.token
  });

  return {
    success: true,
    message: 'Fase grup berhasil diselesaikan',
    data: {
      groups: groups,
      bracket: bracketResult.data
    }
  };
}

function generateBracket(body, auth) {
  const seasonId = String(body.seasonId || '');

  const seasonCheck = requireSeason(seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  const season = seasonCheck.season;

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  if (season.status !== 'group_finished') {
    return {
      success: false,
      message: 'Fase grup belum diselesaikan'
    };
  }

  const groups = readRows(SHEETS.GROUPS)
    .filter(function(item) {
      return item.seasonId === seasonId;
    })
    .sort(function(a, b) {
      return String(a.name).localeCompare(String(b.name));
    });

  if (groups.length < 8) {
    return {
      success: false,
      message: 'Knock-out membutuhkan 8 grup'
    };
  }

  const standings = readRows(SHEETS.GROUP_STANDINGS)
    .filter(function(item) {
      return item.seasonId === seasonId &&
        toBoolean(item.frozen);
    });

  if (!standings.length) {
    return {
      success: false,
      message: 'Standing fase grup belum dibekukan'
    };
  }

  const byGroup = {};

  groups.forEach(function(group) {
    byGroup[group.name] = standings
      .filter(function(row) {
        return row.groupId === group.id;
      })
      .sort(function(a, b) {
        return Number(a.position) - Number(b.position);
      });
  });

  const letters = groups.slice(0, 8).map(function(group, index) {
    return {
      letter: String.fromCharCode(65 + index),
      name: group.name,
      rows: byGroup[group.name] || []
    };
  });

  const oldBracket = readRows(SHEETS.BRACKETS).filter(function(item) {
    return item.seasonId === seasonId;
  });

  oldBracket.forEach(function(item) {
    deleteById(SHEETS.BRACKETS, item.id);
  });

  const bracketRows = [];

  const round16Pairs = [
    [0, 1],
    [1, 0],
    [2, 3],
    [3, 2],
    [4, 5],
    [5, 4],
    [6, 7],
    [7, 6]
  ];

  round16Pairs.forEach(function(pair, index) {
    const leftGroup = letters[pair[0]];
    const rightGroup = letters[pair[1]];

    const leftRow = leftGroup && leftGroup.rows[0];
    const rightRow = rightGroup && rightGroup.rows[1];

    bracketRows.push({
      id: Utilities.getUuid(),
      seasonId: seasonId,
      stage: 'round16',
      matchCode: 'M' + (index + 1),
      leftSource: 'Juara ' + leftGroup.letter,
      rightSource: 'Runner-up ' + rightGroup.letter,
      leftClubId: leftRow ? leftRow.clubId : '',
      rightClubId: rightRow ? rightRow.clubId : '',
      leftClubName: leftRow ? leftRow.clubName : '',
      rightClubName: rightRow ? rightRow.clubName : '',
      winnerClubId: '',
      winnerClubName: '',
      matchId: '',
      position: index + 1,
      createdAt: now(),
      updatedAt: now()
    });
  });

  const quarterPairs = [
    ['QF1', 'M1', 'M3'],
    ['QF2', 'M5', 'M7'],
    ['QF3', 'M2', 'M4'],
    ['QF4', 'M6', 'M8']
  ];

  quarterPairs.forEach(function(pair, index) {
    bracketRows.push({
      id: Utilities.getUuid(),
      seasonId: seasonId,
      stage: 'quarterfinal',
      matchCode: pair[0],
      leftSource: 'Pemenang ' + pair[1],
      rightSource: 'Pemenang ' + pair[2],
      leftClubId: '',
      rightClubId: '',
      leftClubName: '',
      rightClubName: '',
      winnerClubId: '',
      winnerClubName: '',
      matchId: '',
      position: index + 1,
      createdAt: now(),
      updatedAt: now()
    });
  });

  bracketRows.push({
    id: Utilities.getUuid(),
    seasonId: seasonId,
    stage: 'semifinal',
    matchCode: 'SF1',
    leftSource: 'Pemenang QF1',
    rightSource: 'Pemenang QF2',
    leftClubId: '',
    rightClubId: '',
    leftClubName: '',
    rightClubName: '',
    winnerClubId: '',
    winnerClubName: '',
    matchId: '',
    position: 1,
    createdAt: now(),
    updatedAt: now()
  });

  bracketRows.push({
    id: Utilities.getUuid(),
    seasonId: seasonId,
    stage: 'semifinal',
    matchCode: 'SF2',
    leftSource: 'Pemenang QF3',
    rightSource: 'Pemenang QF4',
    leftClubId: '',
    rightClubId: '',
    leftClubName: '',
    rightClubName: '',
    winnerClubId: '',
    winnerClubName: '',
    matchId: '',
    position: 2,
    createdAt: now(),
    updatedAt: now()
  });

  bracketRows.push({
    id: Utilities.getUuid(),
    seasonId: seasonId,
    stage: 'final',
    matchCode: 'FINAL',
    leftSource: 'Pemenang SF1',
    rightSource: 'Pemenang SF2',
    leftClubId: '',
    rightClubId: '',
    leftClubName: '',
    rightClubName: '',
    winnerClubId: '',
    winnerClubName: '',
    matchId: '',
    position: 1,
    createdAt: now(),
    updatedAt: now()
  });

  bracketRows.forEach(function(item) {
    upsertRow(SHEETS.BRACKETS, item);
  });

  return {
    success: true,
    data: bracketRows
  };
}

function validateMatch(body, auth) {
  const matchId = String(body.matchId || '');
  const data = body.data || {};

  const matches = readRows(SHEETS.MATCHES);

  const match = matches.find(function(item) {
    return item.id === matchId;
  });

  if (!match) {
    return {
      success: false,
      message: 'Pertandingan tidak ditemukan'
    };
  }

  if (!canAccessData(SHEETS.MATCHES, match, auth.session)) {
    return {
      success: false,
      message: 'Akses pertandingan ditolak'
    };
  }

  const seasonCheck = requireSeason(match.seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  const season = seasonCheck.season;

  if (season.completed) {
    return {
      success: false,
      message: 'Season sudah selesai'
    };
  }

  const fullHome = toScore(data.fullHome);
  const fullAway = toScore(data.fullAway);
  const halfHome = toScore(data.halfHome);
  const halfAway = toScore(data.halfAway);
  const penaltyHome = toScore(data.penaltyHome);
  const penaltyAway = toScore(data.penaltyAway);

  if (
    halfHome > fullHome ||
    halfAway > fullAway
  ) {
    return {
      success: false,
      message: 'Skor babak pertama tidak boleh melebihi skor akhir'
    };
  }

  if (
    match.matchType === 'knockout' &&
    fullHome === fullAway &&
    penaltyHome === penaltyAway
  ) {
    return {
      success: false,
      message: 'Pertandingan knockout seri membutuhkan skor penalti berbeda'
    };
  }

  if (
    match.matchType === 'knockout' &&
    fullHome !== fullAway &&
    (penaltyHome !== 0 || penaltyAway !== 0)
  ) {
    return {
      success: false,
      message: 'Skor penalti hanya diisi jika skor akhir seri'
    };
  }

  const validationId = data.id || Utilities.getUuid();

  const validation = upsertRow(SHEETS.VALIDATIONS, {
    id: validationId,
    matchId: matchId,
    seasonId: match.seasonId,
    status: 'validated',
    halfHome: halfHome,
    halfAway: halfAway,
    fullHome: fullHome,
    fullAway: fullAway,
    penaltyHome: penaltyHome,
    penaltyAway: penaltyAway,
    validatedBy: auth.session.userId || auth.session.token,
    validatedAt: now(),
    notes: String(data.notes || ''),
    createdAt: data.createdAt || now(),
    updatedAt: now()
  });

  removeMatchEvents(matchId);

  const players = readRows(SHEETS.PEOPLE).filter(function(person) {
    return person.seasonId === match.seasonId &&
      (
        person.clubId === match.homeClubId ||
        person.clubId === match.awayClubId
      );
  });

  const validPlayerIds = players.map(function(player) {
    return player.id;
  });

  const goals = Array.isArray(data.goals) ? data.goals : [];

  goals.forEach(function(goal) {
    if (
      !goal.playerId ||
      validPlayerIds.indexOf(goal.playerId) === -1
    ) {
      return;
    }

    const player = players.find(function(item) {
      return item.id === goal.playerId;
    });

    if (!player) {
      return;
    }

    const clubAllowed =
      player.clubId === match.homeClubId ||
      player.clubId === match.awayClubId;

    if (!clubAllowed) {
      return;
    }

    upsertRow(SHEETS.GOALS, {
      id: Utilities.getUuid(),
      matchId: matchId,
      seasonId: match.seasonId,
      clubId: player.clubId,
      playerId: player.id,
      playerName: player.name,
      minute: goal.minute || '',
      period: goal.period || 'fulltime',
      createdAt: now(),
      updatedAt: now()
    });
  });

  const cards = Array.isArray(data.cards) ? data.cards : [];

  cards.forEach(function(card) {
    if (
      !card.playerId ||
      validPlayerIds.indexOf(card.playerId) === -1
    ) {
      return;
    }

    const player = players.find(function(item) {
      return item.id === card.playerId;
    });

    if (!player) {
      return;
    }

    if (
      card.cardType !== 'yellow' &&
      card.cardType !== 'red'
    ) {
      return;
    }

    upsertRow(SHEETS.CARDS, {
      id: Utilities.getUuid(),
      matchId: matchId,
      seasonId: match.seasonId,
      clubId: player.clubId,
      playerId: player.id,
      playerName: player.name,
      cardType: card.cardType,
      minute: card.minute || '',
      createdAt: now(),
      updatedAt: now()
    });
  });

  match.status = 'validated';
  match.updatedAt = now();

  upsertRow(SHEETS.MATCHES, match);

  updateBracketAfterValidation(match, validation);

  writeHistory({
    seasonId: match.seasonId,
    matchId: matchId,
    action: 'VALIDATE_MATCH',
    snapshot: {
      match: match,
      validation: validation,
      goals: goals,
      cards: cards
    },
    createdBy: auth.session.userId || auth.session.token
  });

  return {
    success: true,
    message: 'Pertandingan berhasil divalidasi',
    data: validation
  };
}

function postponeMatch(body, auth) {
  const matchId = String(body.matchId || '');
  const postponedDate = String(body.postponedDate || '');
  const postponedTime = String(body.postponedTime || '');
  const notes = String(body.notes || '');

  const matches = readRows(SHEETS.MATCHES);

  const match = matches.find(function(item) {
    return item.id === matchId;
  });

  if (!match) {
    return {
      success: false,
      message: 'Pertandingan tidak ditemukan'
    };
  }

  if (!canAccessData(SHEETS.MATCHES, match, auth.session)) {
    return {
      success: false,
      message: 'Akses pertandingan ditolak'
    };
  }

  if (!postponedDate || !postponedTime) {
    return {
      success: false,
      message: 'Tanggal dan waktu penundaan wajib diisi'
    };
  }

  match.status = 'postponed';
  match.postponedDate = postponedDate;
  match.postponedTime = postponedTime;
  match.notes = notes;
  match.updatedAt = now();

  upsertRow(SHEETS.MATCHES, match);

  writeHistory({
    seasonId: match.seasonId,
    matchId: match.id,
    action: 'POSTPONE_MATCH',
    snapshot: match,
    createdBy: auth.session.userId || auth.session.token
  });

  return {
    success: true,
    message: 'Pertandingan ditunda',
    data: match
  };
}

function finishSeason(body, auth) {
  const seasonId = String(body.seasonId || '');

  const seasonCheck = requireSeason(seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  const season = seasonCheck.season;

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  season.status = 'finished';
  season.completed = true;
  season.updatedAt = now();

  upsertRow(SHEETS.SEASONS, season);

  writeHistory({
    seasonId: seasonId,
    action: 'FINISH_SEASON',
    snapshot: season,
    createdBy: auth.session.userId || auth.session.token
  });

  return {
    success: true,
    message: 'Season berhasil diselesaikan',
    data: season
  };
}

function getTopScorers(body, auth) {
  const seasonId = String(body.seasonId || '');

  const seasonCheck = requireSeason(seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  const goals = readRows(SHEETS.GOALS).filter(function(item) {
    return item.seasonId === seasonId;
  });

  const people = readRows(SHEETS.PEOPLE).filter(function(item) {
    return item.seasonId === seasonId;
  });

  const clubs = readRows(SHEETS.CLUBS).filter(function(item) {
    return item.seasonId === seasonId;
  });

  const map = {};

  goals.forEach(function(goal) {
    const key = goal.playerId || goal.playerName;

    if (!map[key]) {
      const person = people.find(function(item) {
        return item.id === goal.playerId;
      });

      const club = clubs.find(function(item) {
        return item.id === goal.clubId;
      });

      map[key] = {
        playerId: goal.playerId || '',
        playerName: goal.playerName || '',
        clubId: goal.clubId || '',
        clubName: club ? club.name : '',
        totalGoals: 0
      };
    }

    map[key].totalGoals++;
  });

  const result = Object.keys(map).map(function(key) {
    return map[key];
  });

  result.sort(function(a, b) {
    return b.totalGoals - a.totalGoals ||
      a.playerName.localeCompare(b.playerName);
  });

  result.forEach(function(item, index) {
    item.position = index + 1;
  });

  return {
    success: true,
    data: result
  };
}

function getHistory(body, auth) {
  const seasonId = String(body.seasonId || '');
  const rows = readRows(SHEETS.HISTORY);

  let filtered = rows;

  if (seasonId) {
    filtered = rows.filter(function(item) {
      return item.seasonId === seasonId;
    });

    if (!canAccessSeason(seasonId, auth.session)) {
      return {
        success: false,
        message: 'Akses histori ditolak'
      };
    }
  } else if (auth.session.role !== 'master') {
    filtered = rows.filter(function(item) {
      return seasonBelongsToEvent(item.seasonId, auth.session.eventId);
    });
  }

  filtered.sort(function(a, b) {
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });

  return {
    success: true,
    data: filtered
  };
}

function getGroupStandings(body, auth) {
  const seasonId = String(body.seasonId || '');

  const seasonCheck = requireSeason(seasonId);

  if (!seasonCheck.success) {
    return seasonCheck;
  }

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  const groups = readRows(SHEETS.GROUPS).filter(function(item) {
    return item.seasonId === seasonId;
  });

  const frozenRows = readRows(SHEETS.GROUP_STANDINGS).filter(function(item) {
    return item.seasonId === seasonId &&
      toBoolean(item.frozen);
  });

  const result = groups.map(function(group) {
    let rows = frozenRows.filter(function(item) {
      return item.groupId === group.id;
    });

    if (!rows.length) {
      rows = calculateGroupStanding(seasonId, group.id);
    }

    rows.sort(function(a, b) {
      return Number(a.position || 999) - Number(b.position || 999) ||
        Number(b.points || 0) - Number(a.points || 0) ||
        Number(b.goalDifference || 0) - Number(a.goalDifference || 0);
    });

    return {
      group: group,
      standings: rows
    };
  });

  return {
    success: true,
    data: result
  };
}

function getBracket(body, auth) {
  const seasonId = String(body.seasonId || '');

  if (!canAccessSeason(seasonId, auth.session)) {
    return {
      success: false,
      message: 'Akses season ditolak'
    };
  }

  const rows = readRows(SHEETS.BRACKETS)
    .filter(function(item) {
      return item.seasonId === seasonId;
    })
    .sort(function(a, b) {
      return Number(a.position || 0) - Number(b.position || 0);
    });

  return {
    success: true,
    data: rows
  };
}

function getPublicData() {
  const events = readRows(SHEETS.EVENTS).filter(function(item) {
    return toBoolean(item.active);
  });

  const seasons = readRows(SHEETS.SEASONS).filter(function(item) {
    return !toBoolean(item.completed);
  });

  const contacts = readRows(SHEETS.CONTACTS).filter(function(item) {
    return toBoolean(item.active);
  });

  const matches = readRows(SHEETS.MATCHES).filter(function(item) {
    return item.status === 'validated' ||
      item.status === 'scheduled' ||
      item.status === 'postponed';
  });

  const validations = readRows(SHEETS.VALIDATIONS);
  const goals = readRows(SHEETS.GOALS);
  const cards = readRows(SHEETS.CARDS);

  const sponsors = readRows(SHEETS.SPONSORS).filter(function(item) {
    return toBoolean(item.active);
  });

  const clubs = readRows(SHEETS.CLUBS).filter(function(item) {
    return toBoolean(item.active);
  });

  const people = readRows(SHEETS.PEOPLE).filter(function(item) {
    return toBoolean(item.active);
  });

  const seasonContacts = readRows(SHEETS.SEASON_CONTACTS).filter(function(item) {
    return toBoolean(item.active);
  });

  const banks = readRows(SHEETS.BANKS).filter(function(item) {
    return toBoolean(item.active);
  });

  const committee = readRows(SHEETS.COMMITTEE).filter(function(item) {
    return toBoolean(item.active);
  });

  const brackets = readRows(SHEETS.BRACKETS);

  const enrichedMatches = matches.map(function(match) {
    const validation = validations.find(function(item) {
      return item.matchId === match.id;
    });

    return {
      id: match.id,
      eventId: match.eventId,
      seasonId: match.seasonId,
      matchType: match.matchType,
      stage: match.stage,
      matchNumber: match.matchNumber,
      groupName: match.groupName,
      matchDate: match.matchDate,
      matchTime: match.matchTime,
      postponedDate: match.postponedDate,
      postponedTime: match.postponedTime,
      homeClubId: match.homeClubId,
      awayClubId: match.awayClubId,
      homeClubName: match.homeClubName,
      awayClubName: match.awayClubName,
      status: match.status,
      notes: match.notes,
      validation: validation || null,
      goals: goals.filter(function(goal) {
        return goal.matchId === match.id;
      }),
      cards: cards.filter(function(card) {
        return card.matchId === match.id;
      })
    };
  });

  enrichedMatches.sort(function(a, b) {
    const dateA = getMatchDateTime(a);
    const dateB = getMatchDateTime(b);

    return dateB - dateA;
  });

  return {
    success: true,
    data: {
      events: events,
      seasons: seasons,
      contacts: contacts,
      matches: enrichedMatches,
      sponsors: sponsors,
      clubs: clubs,
      people: people,
      seasonContacts: seasonContacts,
      banks: banks,
      committee: committee,
      brackets: brackets
    }
  };
}

function calculateGroupStanding(seasonId, groupId) {
  const members = readRows(SHEETS.GROUP_MEMBERS).filter(function(item) {
    return item.seasonId === seasonId &&
      item.groupId === groupId;
  });

  const groups = readRows(SHEETS.GROUPS);

  const group = groups.find(function(item) {
    return item.id === groupId;
  });

  const groupName = group ? group.name : '';

  const matches = readRows(SHEETS.MATCHES).filter(function(item) {
    return item.seasonId === seasonId &&
      item.groupName === groupName &&
      item.matchType === 'group' &&
      item.status === 'validated';
  });

  const validations = readRows(SHEETS.VALIDATIONS);

  const table = {};

  members.forEach(function(member) {
    table[member.clubId] = {
      clubId: member.clubId,
      clubName: member.clubName,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    };
  });

  matches.forEach(function(match) {
    const validation = validations.find(function(item) {
      return item.matchId === match.id;
    });

    if (!validation) {
      return;
    }

    const home = table[match.homeClubId];
    const away = table[match.awayClubId];

    if (!home || !away) {
      return;
    }

    const homeScore = Number(validation.fullHome || 0);
    const awayScore = Number(validation.fullAway || 0);

    home.played++;
    away.played++;

    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;

    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.wins++;
      away.losses++;
      home.points += 3;
    } else if (awayScore > homeScore) {
      away.wins++;
      home.losses++;
      away.points += 3;
    } else {
      home.draws++;
      away.draws++;
      home.points++;
      away.points++;
    }
  });

  const result = Object.keys(table).map(function(key) {
    const row = table[key];

    row.goalDifference =
      row.goalsFor - row.goalsAgainst;

    return row;
  });

  result.sort(function(a, b) {
    return b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.clubName.localeCompare(b.clubName);
  });

  result.forEach(function(row, index) {
    row.position = index + 1;
  });

  return result;
}

function updateBracketAfterValidation(match, validation) {
  if (match.matchType !== 'knockout') {
    return;
  }

  const homeScore = Number(validation.fullHome || 0);
  const awayScore = Number(validation.fullAway || 0);

  let winnerId = '';
  let winnerName = '';

  if (homeScore > awayScore) {
    winnerId = match.homeClubId;
    winnerName = match.homeClubName;
  } else if (awayScore > homeScore) {
    winnerId = match.awayClubId;
    winnerName = match.awayClubName;
  } else {
    const penaltyHome = Number(validation.penaltyHome || 0);
    const penaltyAway = Number(validation.penaltyAway || 0);

    if (penaltyHome > penaltyAway) {
      winnerId = match.homeClubId;
      winnerName = match.homeClubName;
    } else if (penaltyAway > penaltyHome) {
      winnerId = match.awayClubId;
      winnerName = match.awayClubName;
    }
  }

  if (!winnerId) {
    return;
  }

  const brackets = readRows(SHEETS.BRACKETS);

  const current = brackets.find(function(item) {
    return item.matchId === match.id;
  });

  if (current) {
    current.winnerClubId = winnerId;
    current.winnerClubName = winnerName;
    current.updatedAt = now();

    upsertRow(SHEETS.BRACKETS, current);
  }

  const next = getNextBracket(match.stage, match.matchNumber);

  if (!next) {
    return;
  }

  const target = brackets.find(function(item) {
    return item.matchCode === next.matchCode &&
      item.seasonId === match.seasonId;
  });

  if (!target) {
    return;
  }

  if (next.side === 'left') {
    target.leftClubId = winnerId;
    target.leftClubName = winnerName;
  } else {
    target.rightClubId = winnerId;
    target.rightClubName = winnerName;
  }

  target.updatedAt = now();

  upsertRow(SHEETS.BRACKETS, target);
}

function getNextBracket(stage, matchNumber) {
  const number = Number(matchNumber || 0);

  if (stage === 'round16' && number >= 1 && number <= 8) {
    const map = {
      1: {matchCode: 'QF1', side: 'left'},
      3: {matchCode: 'QF1', side: 'right'},
      5: {matchCode: 'QF2', side: 'left'},
      7: {matchCode: 'QF2', side: 'right'},
      2: {matchCode: 'QF3', side: 'left'},
      4: {matchCode: 'QF3', side: 'right'},
      6: {matchCode: 'QF4', side: 'left'},
      8: {matchCode: 'QF4', side: 'right'}
    };

    return map[number] || null;
  }

  if (stage === 'quarterfinal') {
    const map = {
      1: {matchCode: 'SF1', side: 'left'},
      2: {matchCode: 'SF1', side: 'right'},
      3: {matchCode: 'SF2', side: 'left'},
      4: {matchCode: 'SF2', side: 'right'}
    };

    return map[number] || null;
  }

  if (stage === 'semifinal') {
    const map = {
      1: {matchCode: 'FINAL', side: 'left'},
      2: {matchCode: 'FINAL', side: 'right'}
    };

    return map[number] || null;
  }

  return null;
}

function getSeason(seasonId) {
  return readRows(SHEETS.SEASONS).find(function(item) {
    return item.id === seasonId;
  }) || null;
}

function requireSeason(seasonId) {
  if (!seasonId) {
    return {
      success: false,
      message: 'Season wajib dibuat terlebih dahulu'
    };
  }

  const season = getSeason(seasonId);

  if (!season) {
    return {
      success: false,
      message: 'Season tidak ditemukan'
    };
  }

  return {
    success: true,
    season: season
  };
}

function canAccessSeason(seasonId, session) {
  if (session.role === 'master') {
    return true;
  }

  const season = getSeason(seasonId);

  return !!season &&
    season.eventId === session.eventId;
}

function seasonBelongsToEvent(seasonId, eventId) {
  if (!seasonId) {
    return false;
  }

  const season = getSeason(seasonId);

  return !!season &&
    season.eventId === eventId;
}

function canAccessData(sheetName, data, session) {
  if (session.role === 'master') {
    return true;
  }

  if (sheetName === SHEETS.EVENTS) {
    return data.id === session.eventId;
  }

  if (sheetName === SHEETS.USERS) {
    return data.eventId === session.eventId;
  }

  if (data.eventId) {
    return data.eventId === session.eventId;
  }

  if (data.seasonId) {
    return canAccessSeason(data.seasonId, session);
  }

  if (sheetName === SHEETS.CONTACTS) {
    return true;
  }

  return false;
}

function scopeRows(rows, sheetName, session) {
  if (session.role === 'master') {
    return rows;
  }

  if (sheetName === SHEETS.CONTACTS) {
    return rows;
  }

  if (sheetName === SHEETS.EVENTS) {
    return rows.filter(function(item) {
      return item.id === session.eventId;
    });
  }

  return rows.filter(function(item) {
    if (item.eventId) {
      return item.eventId === session.eventId;
    }

    if (item.seasonId) {
      return seasonBelongsToEvent(
        item.seasonId,
        session.eventId
      );
    }

    return false;
  });
}

function filterRows(rows, body) {
  let result = rows;

  if (body.search) {
    const search = String(body.search).toLowerCase();

    result = result.filter(function(item) {
      return JSON.stringify(item)
        .toLowerCase()
        .indexOf(search) !== -1;
    });
  }

  return result;
}

function prepareData(sheetName, data) {
  const result = {};

  HEADERS[sheetName].forEach(function(header) {
    if (data[header] !== undefined) {
      result[header] = data[header];
    }
  });

  if (!result.id) {
    result.id = Utilities.getUuid();
  }

  const timestamp = now();

  if (!result.createdAt) {
    result.createdAt = timestamp;
  }

  result.updatedAt = timestamp;

  if (
    result.active === undefined &&
    [
      SHEETS.EVENTS,
      SHEETS.USERS,
      SHEETS.CONTACTS,
      SHEETS.COMMITTEE,
      SHEETS.CLUBS,
      SHEETS.PEOPLE,
      SHEETS.SPONSORS,
      SHEETS.BANKS,
      SHEETS.SEASON_CONTACTS
    ].indexOf(sheetName) !== -1
  ) {
    result.active = true;
  }

  return result;
}

function validateSeasonInput(data, session) {
  if (!data.name || !String(data.name).trim()) {
    return {
      success: false,
      message: 'Nama season wajib diisi'
    };
  }

  if (!data.eventId) {
    return {
      success: false,
      message: 'Event wajib dipilih'
    };
  }

  if (
    session.role !== 'master' &&
    data.eventId !== session.eventId
  ) {
    return {
      success: false,
      message: 'Event tidak sesuai sesi'
    };
  }

  if (
    data.eventType &&
    ['group8', 'knockout16'].indexOf(data.eventType) === -1
  ) {
    return {
      success: false,
      message: 'Tipe event tidak valid'
    };
  }

  return {
    success: true
  };
}

function validateCommitteeInput(data, session) {
  if (!data.name || !String(data.name).trim()) {
    return {
      success: false,
      message: 'Nama panitia wajib diisi'
    };
  }

  if (!data.position || !String(data.position).trim()) {
    return {
      success: false,
      message: 'Jabatan panitia wajib diisi'
    };
  }

  if (data.seasonId && !canAccessSeason(data.seasonId, session)) {
    return {
      success: false,
      message: 'Season tidak sesuai akses'
    };
  }

  return {
    success: true
  };
}

function removeMatchEvents(matchId) {
  [SHEETS.GOALS, SHEETS.CARDS].forEach(function(sheetName) {
    const rows = readRows(sheetName);

    rows
      .filter(function(row) {
        return row.matchId === matchId;
      })
      .forEach(function(row) {
        deleteById(sheetName, row.id);
      });
  });
}

function deleteGroupMembers(groupId) {
  const rows = readRows(SHEETS.GROUP_MEMBERS);

  rows
    .filter(function(row) {
      return row.groupId === groupId;
    })
    .forEach(function(row) {
      deleteById(SHEETS.GROUP_MEMBERS, row.id);
    });
}

function writeHistory(data) {
  appendRow(SHEETS.HISTORY, {
    id: Utilities.getUuid(),
    seasonId: data.seasonId || '',
    matchId: data.matchId || '',
    action: data.action || '',
    snapshot: JSON.stringify(data.snapshot || {}),
    createdBy: data.createdBy || '',
    createdAt: now()
  });
}

function readRows(sheetName) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }

  const headers = HEADERS[sheetName];

  const values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    headers.length
  ).getValues();

  return values.map(function(row) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = normalizeCell(row[index]);
    });

    return item;
  });
}

function appendRow(sheetName, data) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  const headers = HEADERS[sheetName];

  const row = headers.map(function(header) {
    return data[header] !== undefined
      ? data[header]
      : '';
  });

  sheet.appendRow(row);

  return data;
}

function upsertRow(sheetName, data) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  const headers = HEADERS[sheetName];

  const id = data.id || Utilities.getUuid();

  data.id = id;

  const rows = readRows(sheetName);

  const rowIndex = rows.findIndex(function(item) {
    return item.id === id;
  });

  const row = headers.map(function(header) {
    return data[header] !== undefined
      ? data[header]
      : '';
  });

  if (rowIndex >= 0) {
    sheet
      .getRange(rowIndex + 2, 1, 1, headers.length)
      .setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return data;
}

function deleteById(sheetName, id) {
  const rows = readRows(sheetName);

  const index = rows.findIndex(function(item) {
    return item.id === id;
  });

  if (index >= 0) {
    deleteRow(sheetName, index + 2);
    return true;
  }

  return false;
}

function deleteRow(sheetName, rowNumber) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    return;
  }

  if (rowNumber >= 2 && rowNumber <= sheet.getLastRow()) {
    sheet.deleteRow(rowNumber);
  }
}

function getSpreadsheet() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = CONFIG.SPREADSHEET_ID ||
    properties.getProperty('SPREADSHEET_ID');

  if (!spreadsheetId) {
    setupDatabase();
    spreadsheetId = properties.getProperty('SPREADSHEET_ID');
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function getOrCreateFolder(parent, name) {
  const folders = parent.getFoldersByName(name);

  if (folders.hasNext()) {
    return folders.next();
  }

  return parent.createFolder(name);
}

function parseRequest(e) {
  if (
    !e ||
    !e.postData ||
    !e.postData.contents
  ) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeCell(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(
      value,
      CONFIG.TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ss"
    );
  }

  return value;
}

function toBoolean(value) {
  return value === true ||
    value === 'true' ||
    value === 'TRUE' ||
    value === 1 ||
    value === '1';
}

function toScore(value) {
  const number = Number(value);

  if (isNaN(number) || number < 0) {
    return 0;
  }

  return Math.floor(number);
}

function now() {
  return Utilities.formatDate(
    new Date(),
    CONFIG.TIMEZONE,
    "yyyy-MM-dd'T'HH:mm:ss"
  );
}

function shuffleArray(array) {
  const result = array.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    const temporary = result[i];

    result[i] = result[randomIndex];
    result[randomIndex] = temporary;
  }

  return result;
}

function getMatchDateTime(match) {
  const dateValue =
    match.postponedDate ||
    match.matchDate ||
    '';

  const timeValue =
    match.postponedTime ||
    match.matchTime ||
    '00:00';

  if (!dateValue) {
    return 0;
  }

  const date = new Date(
    String(dateValue) +
    'T' +
    String(timeValue).slice(0, 5) +
    ':00+08:00'
  );

  return isNaN(date.getTime())
    ? 0
    : date.getTime();
}
