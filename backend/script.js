const API_URL = 'https://script.google.com/macros/s/AKfycbzCIw3zrEXlg3pPkpRjThfTddReIY5Zfs7RKkkVGcdD8pAZeRqsyF4dZZbIZ0kO1Jqj/exec';

const App = {
  tokenKey: 'jurnal_kasent_token',
  userKey: 'jurnal_kasent_user',

  async request(action, payload = {}) {
    const token = localStorage.getItem(this.tokenKey);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action,
          token,
          ...payload
        })
      });

      const result = await response.json();

      if (!result.success && result.message === 'Sesi tidak valid') {
        this.logout();
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Gagal terhubung ke server.'
      };
    }
  },

  saveSession(data) {
    if (!data) return;

    if (data.token) {
      localStorage.setItem(this.tokenKey, data.token);
    }

    if (data.user) {
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
    }
  },

  getToken() {
    return localStorage.getItem(this.tokenKey) || '';
  },

  getUser() {
    try {
      return JSON.parse(
        localStorage.getItem(this.userKey) || 'null'
      );
    } catch (error) {
      return null;
    }
  },

  logout() {
    const token = this.getToken();

    if (token) {
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'logout',
          token
        })
      }).catch(() => {});
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    window.location.href = 'index.html';
  },

  requireLogin(role = '') {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) {
      window.location.href = 'index.html';
      return false;
    }

    if (role && user.role !== role && user.role !== 'master') {
      window.location.href = 'index.html';
      return false;
    }

    return true;
  },

  async login(username, password) {
    const result = await this.request('login', {
      username,
      password
    });

    if (result.success) {
      this.saveSession(result);
    }

    return result;
  },

  async publicData() {
    return this.request('publicData');
  },

  async dashboard() {
    return this.request('dashboard');
  },

  async list(sheet, options = {}) {
    return this.request('list', {
      sheet,
      ...options
    });
  },

  async save(sheet, data) {
    return this.request('save', {
      sheet,
      data
    });
  },

  async remove(sheet, id) {
    return this.request('delete', {
      sheet,
      id
    });
  },

  async uploadFile(file, folderType = '10_DOCUMENTS') {
    const base64 = await this.fileToBase64(file);

    return this.request('uploadFile', {
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      base64,
      folderType
    });
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result || '');
        resolve(result.split(',')[1] || '');
      };

      reader.onerror = () => {
        reject(new Error('File gagal dibaca.'));
      };

      reader.readAsDataURL(file);
    });
  },

  async createGroups(seasonId, names) {
    return this.request('createGroups', {
      seasonId,
      names
    });
  },

  async randomizeGroups(seasonId, clubIds, groupIds) {
    return this.request('randomizeGroups', {
      seasonId,
      clubIds,
      groupIds
    });
  },

  async finishGroupPhase(seasonId) {
    return this.request('finishGroupPhase', {
      seasonId
    });
  },

  async generateBracket(seasonId) {
    return this.request('generateBracket', {
      seasonId
    });
  },

  async validateMatch(matchId, data) {
    return this.request('validateMatch', {
      matchId,
      data
    });
  },

  async postponeMatch(
    matchId,
    postponedDate,
    postponedTime,
    notes = ''
  ) {
    return this.request('postponeMatch', {
      matchId,
      postponedDate,
      postponedTime,
      notes
    });
  },

  async finishSeason(seasonId) {
    return this.request('finishSeason', {
      seasonId
    });
  },

  async topScorers(seasonId) {
    return this.request('topScorers', {
      seasonId
    });
  },

  async history(seasonId = '') {
    return this.request('history', {
      seasonId
    });
  },

  async groupStandings(seasonId) {
    return this.request('groupStandings', {
      seasonId
    });
  },

  async bracket(seasonId) {
    return this.request('bracket', {
      seasonId
    });
  }
};

function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

function formatShortDate(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

function formatTime(value) {
  if (!value) return '-';

  return String(value).slice(0, 5);
}

function formatNumber(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat('id-ID').format(number);
}

function showToast(message, type = 'success') {
  let toast = qs('#appToast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';

    document.body.appendChild(toast);
  }

  toast.className = `app-toast ${type}`;
  toast.innerHTML = `
    <div class="app-toast-content">
      <span>${escapeHtml(message)}</span>
      <button type="button" aria-label="Tutup">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  `;

  const closeButton = qs('button', toast);

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function showLoading(message = 'Memuat data...') {
  let loading = qs('#appLoading');

  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'appLoading';
    loading.className = 'app-loading';

    loading.innerHTML = `
      <div class="app-loading-box">
        <div class="app-loading-spinner"></div>
        <div class="app-loading-text"></div>
      </div>
    `;

    document.body.appendChild(loading);
  }

  const text = qs('.app-loading-text', loading);

  if (text) {
    text.textContent = message;
  }

  loading.classList.add('show');
}

function closeLoading() {
  const loading = qs('#appLoading');

  if (loading) {
    loading.classList.remove('show');
  }
}

function confirmDelete(message = 'Hapus data ini?') {
  return window.confirm(message);
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sortAlphabetically(items, key = 'name') {
  return [...items].sort((a, b) => {
    return String(a[key] || '')
      .localeCompare(
        String(b[key] || ''),
        'id',
        {
          sensitivity: 'base'
        }
      );
  });
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

function setText(element, value) {
  if (!element) return;

  element.textContent = value ?? '';
}

function setHtml(element, value) {
  if (!element) return;

  element.innerHTML = value ?? '';
}

function emptyState(
  message = 'Belum ada data.'
) {
  return `
    <div class="empty-state">
      <i class="bi bi-inbox"></i>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

function statusBadge(status) {
  const value = String(status || '')
    .toLowerCase();

  const labels = {
    scheduled: 'Terjadwal',
    validated: 'Selesai',
    postponed: 'Ditunda',
    draft: 'Draft',
    active: 'Aktif',
    inactive: 'Nonaktif',
    finished: 'Selesai',
    group_finished: 'Fase Grup Selesai'
  };

  const label = labels[value] || status || '-';

  return `
    <span class="status-badge status-${escapeHtml(value)}">
      ${escapeHtml(label)}
    </span>
  `;
}

function createToggle(
  checked,
  attributes = ''
) {
  return `
    <label class="switch">
      <input
        type="checkbox"
        ${checked ? 'checked' : ''}
        ${attributes}
      >
      <span class="switch-slider"></span>
    </label>
  `;
}

document.addEventListener('click', event => {
  const logoutButton =
    event.target.closest('[data-logout]');

  if (logoutButton) {
    App.logout();
  }
});