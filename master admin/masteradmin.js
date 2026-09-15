const MasterAdmin = {
  state: {
    events: [],
    admins: [],
    contacts: [],
    seasons: [],
    currentSection: 'dashboard',
    editingId: null,
    contactEditingId: null
  },

  init() {
    this.bindEvents();
    this.restoreSession();
  },

  bindEvents() {
    document.addEventListener('click', event => {
      const nav = event.target.closest('[data-section]');
      if (nav) {
        event.preventDefault();
        this.openSection(nav.dataset.section);
      }

      const sectionButton = event.target.closest('[data-section-button]');
      if (sectionButton) {
        event.preventDefault();
        this.openSection(sectionButton.dataset.sectionButton);
      }

      const logout = event.target.closest('[data-master-logout]');
      if (logout) {
        event.preventDefault();
        App.logout();
      }

      const openModal = event.target.closest('[data-open-modal]');
      if (openModal) {
        this.openModal(openModal.dataset.openModal);
      }

      const closeModal = event.target.closest('[data-close-modal]');
      if (closeModal) {
        this.closeModal(closeModal.dataset.closeModal);
      }

      const editEvent = event.target.closest('[data-edit-event]');
      if (editEvent) {
        this.editEvent(editEvent.dataset.editEvent);
      }

      const deleteEvent = event.target.closest('[data-delete-event]');
      if (deleteEvent) {
        this.deleteEvent(deleteEvent.dataset.deleteEvent);
      }

      const editAdmin = event.target.closest('[data-edit-admin]');
      if (editAdmin) {
        this.editAdmin(editAdmin.dataset.editAdmin);
      }

      const deleteAdmin = event.target.closest('[data-delete-admin]');
      if (deleteAdmin) {
        this.deleteAdmin(deleteAdmin.dataset.deleteAdmin);
      }

      const editContact = event.target.closest('[data-edit-contact]');
      if (editContact) {
        this.editContact(editContact.dataset.editContact);
      }

      const deleteContact = event.target.closest('[data-delete-contact]');
      if (deleteContact) {
        this.deleteContact(deleteContact.dataset.deleteContact);
      }

      const passwordToggle = event.target.closest('[data-password-toggle]');
      if (passwordToggle) {
        this.togglePassword(passwordToggle.dataset.passwordToggle);
      }
    });

    const loginForm = qs('#masterLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', event => {
        event.preventDefault();
        this.login();
      });
    }

    const eventForm = qs('#eventForm');
    if (eventForm) {
      eventForm.addEventListener('submit', event => {
        event.preventDefault();
        this.saveEvent();
      });
    }

    const adminForm = qs('#adminForm');
    if (adminForm) {
      adminForm.addEventListener('submit', event => {
        event.preventDefault();
        this.saveAdmin();
      });
    }

    const contactForm = qs('#contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', event => {
        event.preventDefault();
        this.saveContact();
      });
    }

    const eventSearch = qs('#eventSearch');
    if (eventSearch) {
      eventSearch.addEventListener('input', () => this.renderEvents());
    }

    const adminSearch = qs('#adminSearch');
    if (adminSearch) {
      adminSearch.addEventListener('input', () => this.renderAdmins());
    }

    const contactSearch = qs('#contactSearch');
    if (contactSearch) {
      contactSearch.addEventListener('input', () => this.renderContacts());
    }

    const sidebarToggle = qs('[data-sidebar-toggle]');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        const sidebar = qs('.master-sidebar');
        const overlay = qs('.master-sidebar-overlay');

        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show');
      });
    }

    let touchStartX = 0;

    document.addEventListener('touchstart', event => {
      if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
      }
    }, { passive: true });

    document.addEventListener('touchend', event => {
      if (!touchStartX || event.changedTouches.length !== 1) return;

      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;
      const sidebar = qs('.master-sidebar');
      const overlay = qs('.master-sidebar-overlay');

      if (Math.abs(distance) >= 55 && window.innerWidth <= 900) {
        if (distance > 0 && touchStartX <= 48) {
          sidebar?.classList.add('open');
          overlay?.classList.add('show');
        } else if (distance < 0) {
          sidebar?.classList.remove('open');
          overlay?.classList.remove('show');
        }
      }

      touchStartX = 0;
    }, { passive: true });

    const sidebarOverlay = qs('.master-sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        const sidebar = qs('.master-sidebar');
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
      });
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        document.querySelectorAll('.master-modal.show').forEach(modal => {
          modal.classList.remove('show');
        });
      }
    });
  },

  async restoreSession() {
    const user = App.getUser();
    const token = App.getToken();

    if (!user || !token) {
      window.location.href = '../index.html';
      return;
    }

    const role = String(user.role || user.Role || '').toUpperCase();

    if (
      role &&
      role !== 'MASTER_ADMIN' &&
      role !== 'MASTER' &&
      role !== 'MASTERADMIN'
    ) {
      App.logout();
      return;
    }

    if (!await App.validateSession()) {
      App.logout();
      return;
    }

    this.showApplication();
    await this.loadAll();
  },

  async login() {
    const usernameInput = qs('#masterUsername');
    const passwordInput = qs('#masterPassword');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username || !password) {
      showToast('Username dan password wajib diisi.', 'error');
      return;
    }

    showLoading('Memeriksa akses Master Admin...');

    try {
      const result = await App.login(username, password);

      if (!result || !result.success) {
        showToast(
          result && result.message
            ? result.message
            : 'Login Master Admin gagal.',
          'error'
        );
        return;
      }

      const user = App.getUser() || result.user || {};
      const role = String(user.role || user.Role || '').toUpperCase();

      if (
        role &&
        role !== 'MASTER_ADMIN' &&
        role !== 'MASTER' &&
        role !== 'MASTERADMIN'
      ) {
        App.logout();
        showToast('Akun ini bukan akun Master Admin.', 'error');
        return;
      }

      this.showApplication();
      await this.loadAll();
      showToast('Login Master Admin berhasil.', 'success');
    } catch (error) {
      showToast('Terjadi kesalahan saat login.', 'error');
    } finally {
      closeLoading();
    }
  },

  showLogin() {
    const login = qs('#masterLogin');
    const app = qs('#masterApp');

    if (login) login.classList.remove('hidden');
    if (app) app.classList.add('hidden');
  },

  showApplication() {
    const login = qs('#masterLogin');
    const app = qs('#masterApp');

    if (login) login.classList.add('hidden');
    if (app) app.classList.remove('hidden');

    this.setUserInfo();
  },

  setUserInfo() {
    const user = App.getUser() || {};

    const name =
      user.name ||
      user.nama ||
      user.username ||
      user.Username ||
      'Master Admin';

    const nameElements = document.querySelectorAll(
      '[data-master-user-name]'
    );

    nameElements.forEach(element => {
      element.textContent = name;
    });

    const roleElements = document.querySelectorAll(
      '[data-master-user-role]'
    );

    roleElements.forEach(element => {
      element.textContent = 'MASTER ADMIN';
    });
  },

  async loadAll() {
    showLoading('Memuat data Master Admin...');

    try {
      const results = await Promise.all([
        this.loadEvents(),
        this.loadAdmins(),
        this.loadContacts(),
        this.loadSeasons()
      ]);

      this.updateDashboard();
      return results;
    } catch (error) {
      showToast('Sebagian data gagal dimuat.', 'error');
    } finally {
      closeLoading();
    }
  },

  async loadEvents() {
    const result = await App.list('EVENTS');

    if (result && result.success) {
      this.state.events = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.rows)
          ? result.rows
          : [];
    } else {
      this.state.events = [];
    }

    this.renderEvents();
    this.populateEventDropdowns();
  },

  async loadAdmins() {
    const result = await App.list('USERS');

    if (result && result.success) {
      const rows = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.rows)
          ? result.rows
          : [];

      this.state.admins = rows.filter(item => {
        const role = String(
          item.role ||
          item.Role ||
          item.ROLE ||
          item.user_role ||
          ''
        ).toUpperCase();

        return (
          role === 'ADMIN_EVENT' ||
          role === 'ADMIN EVENT' ||
          role === 'EVENT_ADMIN' ||
          role === 'ADMIN'
        );
      });
    } else {
      this.state.admins = [];
    }

    this.renderAdmins();
  },

  async loadContacts() {
    const result = await App.list('CONTACTS');

    if (result && result.success) {
      this.state.contacts = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.rows)
          ? result.rows
          : [];
    } else {
      this.state.contacts = [];
    }

    this.renderContacts();
  },

  async loadSeasons() {
    const result = await App.list('SEASONS');

    if (result && result.success) {
      this.state.seasons = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.rows)
          ? result.rows
          : [];
    } else {
      this.state.seasons = [];
    }

    this.updateDashboard();
  },

  openSection(section) {
    this.state.currentSection = section;
    const sectionId = `section-${section}`;

    document.querySelectorAll('.master-section').forEach(item => {
      item.classList.toggle(
        'active',
        item.dataset.section === section ||
        item.id === sectionId
      );
    });

    document.querySelectorAll('[data-section]').forEach(item => {
      item.classList.toggle(
        'active',
        item.dataset.section === section
      );
    });

    const title = qs('[data-page-title]');
    const description = qs('[data-page-description]');

    const pages = {
      dashboard: {
        title: 'Dashboard',
        description: 'Ringkasan data Jurnal Kasent'
      },
      events: {
        title: 'Event',
        description: 'Kelola event dan organizer'
      },
      admins: {
        title: 'Admin Event',
        description: 'Kelola akun administrator event'
      },
      contacts: {
        title: 'Kontak Publik',
        description: 'Kelola kontak yang tampil di halaman publik'
      }
    };

    const page = pages[section] || pages.dashboard;

    if (title) title.textContent = page.title;
    if (description) description.textContent = page.description;

    const sidebar = qs('.master-sidebar');
    const overlay = qs('.master-sidebar-overlay');

    if (window.innerWidth <= 900) {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    }

    if (section === 'dashboard') {
      this.updateDashboard();
    }
  },

  updateDashboard() {
    const eventCount = this.state.events.length;

    const seasonCount = this.state.seasons.filter(item => {
      const status = String(
        item.status ||
        item.Status ||
        item.season_status ||
        ''
      ).toUpperCase();

      return status !== 'DELETED';
    }).length;

    const adminCount = this.state.admins.length;

    const activeContactCount = this.state.contacts.filter(item => {
      return this.isActive(item);
    }).length;

    this.setValue('#statEvents', eventCount);
    this.setValue('#statSeasons', seasonCount);
    this.setValue('#statAdmins', adminCount);
    this.setValue('#statContacts', activeContactCount);

    const latestEvents = [...this.state.events]
      .sort((a, b) => {
        const da = new Date(
          a.createdAt ||
          a.created_at ||
          a.tanggal ||
          0
        ).getTime();

        const db = new Date(
          b.createdAt ||
          b.created_at ||
          b.tanggal ||
          0
        ).getTime();

        return db - da;
      })
      .slice(0, 5);

    const container = qs('#dashboardEvents');

    if (!container) return;

    if (!latestEvents.length) {
      container.innerHTML = `
        <div class="master-empty">
          <div class="master-empty-icon">
            <i class="bi bi-calendar-event"></i>
          </div>
          <div class="master-empty-title">Belum ada event</div>
          <div class="master-empty-text">Buat event pertama untuk memulai.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = latestEvents.map(event => {
      const id = this.getId(event);
      const name = this.getEventName(event);

      return `
        <div class="master-event-item">
          <div class="master-event-title">${escapeHtml(name)}</div>
          <div class="master-event-meta">
            ${this.getEventIdText(event)}
          </div>
          <div class="master-event-actions">
            <button
              type="button"
              class="master-btn master-btn-light master-btn-sm"
              data-edit-event="${escapeHtml(id)}"
            >
              <i class="bi bi-pencil"></i>
              Edit
            </button>
            <button
              type="button"
              class="master-btn master-btn-outline master-btn-sm"
              data-section="events"
            >
              <i class="bi bi-arrow-right"></i>
              Kelola
            </button>
          </div>
        </div>
      `;
    }).join('');

    const adminContainer = qs('#dashboardAdmins');

    if (adminContainer) {
      const latestAdmins = this.state.admins.slice(0, 5);

      adminContainer.innerHTML = latestAdmins.length
        ? latestAdmins.map(admin => `
            <div class="master-mini-item">
              <strong>${escapeHtml(admin.name || admin.username || '-')}</strong>
              <span>${escapeHtml(admin.username || '-')}</span>
            </div>
          `).join('')
        : `
            <div class="master-empty">
              <div class="master-empty-text">Belum ada admin event.</div>
            </div>
          `;
    }
  },

  setValue(selector, value) {
    const element = qs(selector);

    if (element) {
      element.textContent = value;
    }
  },

  getId(item) {
    return String(
      item.id ||
      item.ID ||
      item.Id ||
      item.eventId ||
      item.event_id ||
      item.userId ||
      item.user_id ||
      item.contactId ||
      item.contact_id ||
      ''
    );
  },

  getEventName(event) {
    return String(
      event.name ||
      event.nama ||
      event.eventName ||
      event.event_name ||
      event.EventName ||
      '-'
    );
  },

  getEventIdText(event) {
    const id = this.getId(event);

    return id
      ? `ID Event: ${escapeHtml(id)}`
      : 'Event Jurnal Kasent';
  },

  isActive(item) {
    const value =
      item.active ??
      item.aktif ??
      item.isActive ??
      item.is_active ??
      item.enabled ??
      item.status;

    if (
      value === true ||
      value === 1 ||
      String(value).toLowerCase() === 'true' ||
      String(value).toLowerCase() === 'aktif' ||
      String(value).toLowerCase() === 'active'
    ) {
      return true;
    }

    return false;
  },

  populateEventDropdowns() {
    const selects = document.querySelectorAll(
      '#adminEvent, [data-event-dropdown]'
    );

    selects.forEach(select => {
      const current = select.value;

      select.innerHTML = `
        <option value="">Pilih event</option>
        ${this.state.events.map(event => {
          const id = this.getId(event);
          const name = this.getEventName(event);

          return `
            <option value="${escapeHtml(id)}">
              ${escapeHtml(name)}
            </option>
          `;
        }).join('')}
      `;

      if (current) {
        select.value = current;
      }
    });
  },

  openModal(type) {
    if (type === 'event' || type === 'eventModal') {
      this.prepareEventForm();
      this.showModal('eventModal');
      return;
    }

    if (type === 'admin' || type === 'adminModal') {
      this.prepareAdminForm();
      this.showModal('adminModal');
      return;
    }

    if (type === 'contact' || type === 'contactModal') {
      this.prepareContactForm();
      this.showModal('contactModal');
    }
  },

  showModal(id) {
    const modal = qs(`#${id}`);

    if (modal) {
      modal.classList.add('show');
    }
  },

  closeModal(id) {
    const modal = qs(`#${id}`);

    if (modal) {
      modal.classList.remove('show');
    }
  },

  prepareEventForm(event = null) {
    this.state.editingId = event
      ? this.getId(event)
      : null;

    const form = qs('#eventForm');

    if (!form) return;

    form.reset();

    const id = qs('#eventId');
    const name = qs('#eventName');

    if (id) {
      id.value = event ? this.getId(event) : '';
    }

    if (name) {
      name.value = event
        ? this.getEventName(event)
        : '';
    }

    const title = qs('#eventModalTitle');

    if (title) {
      title.textContent = event
        ? 'Edit Event'
        : 'Tambah Event';
    }
  },

  async saveEvent() {
    const nameInput = qs('#eventName');

    if (!nameInput) return;

    const name = nameInput.value.trim();

    if (!name) {
      showToast('Nama event wajib diisi.', 'error');
      nameInput.focus();
      return;
    }

    const id = qs('#eventId')
      ? qs('#eventId').value.trim()
      : '';

    showLoading('Menyimpan event...');

    try {
      const data = {
        id,
        name,
        eventName: name,
        status: 'ACTIVE'
      };

      const result = await App.save('EVENTS', data);

      if (!result || !result.success) {
        showToast(
          result && result.message
            ? result.message
            : 'Event gagal disimpan.',
          'error'
        );
        return;
      }

      this.closeModal('eventModal');
      await this.loadEvents();
      this.updateDashboard();

      showToast(
        id
          ? 'Event berhasil diperbarui.'
          : 'Event berhasil dibuat.',
        'success'
      );
    } finally {
      closeLoading();
    }
  },

  editEvent(id) {
    const event = this.state.events.find(
      item => this.getId(item) === String(id)
    );

    if (!event) {
      showToast('Data event tidak ditemukan.', 'error');
      return;
    }

    this.prepareEventForm(event);
    this.showModal('eventModal');
  },

  async deleteEvent(id) {
    const event = this.state.events.find(
      item => this.getId(item) === String(id)
    );

    if (!event) {
      showToast('Data event tidak ditemukan.', 'error');
      return;
    }

    const name = this.getEventName(event);

    if (!confirm(`Hapus event "${name}"?`)) {
      return;
    }

    showLoading('Menghapus event...');

    try {
      const result = await App.remove('EVENTS', id);

      if (!result || !result.success) {
        showToast(
          result && result.message
            ? result.message
            : 'Event gagal dihapus.',
          'error'
        );
        return;
      }

      await this.loadEvents();
      await this.loadAdmins();
      await this.loadSeasons();

      this.updateDashboard();

      showToast('Event berhasil dihapus.', 'success');
    } finally {
      closeLoading();
    }
  },

  renderEvents() {
    const container = qs('#eventsTableBody');

    if (!container) return;

    const searchInput = qs('#eventSearch');

    const keyword = searchInput
      ? searchInput.value.trim().toLowerCase()
      : '';

    let rows = [...this.state.events];

    if (keyword) {
      rows = rows.filter(event => {
        const name = this.getEventName(event).toLowerCase();
        const id = this.getId(event).toLowerCase();

        return name.includes(keyword) || id.includes(keyword);
      });
    }

    rows.sort((a, b) => {
      return this.getEventName(a).localeCompare(
        this.getEventName(b),
        'id',
        { sensitivity: 'base' }
      );
    });

    if (!rows.length) {
      container.innerHTML = `
        <tr>
          <td colspan="4" class="master-table-empty">
            <i class="bi bi-calendar-x"></i>
            Belum ada data event.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = rows.map((event, index) => {
      const id = this.getId(event);
      const name = this.getEventName(event);
      const active = this.isActive(event);

      const adminCount = this.state.admins.filter(admin => {
        const eventId = String(
          admin.eventId ||
          admin.event_id ||
          admin.EventID ||
          ''
        );

        return eventId === id;
      }).length;

      const seasonCount = this.state.seasons.filter(season => {
        const eventId = String(
          season.eventId ||
          season.event_id ||
          season.EventID ||
          ''
        );

        return eventId === id;
      }).length;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${escapeHtml(name)}</strong>
          </td>
          <td>
            <span class="master-badge master-badge-primary">
              ${adminCount} Admin
            </span>
          </td>
          <td>
            <span class="master-badge master-badge-primary">
              ${seasonCount} Season
            </span>
          </td>
          <td>
            <span class="master-badge ${
              active
                ? 'master-badge-success'
                : 'master-badge-muted'
            }">
              ${active ? 'Aktif' : 'Tidak Aktif'}
            </span>
          </td>
          <td>
            <div class="master-table-actions">
              <button
                type="button"
                class="master-btn master-btn-light master-btn-sm master-btn-icon"
                data-edit-event="${escapeHtml(id)}"
                title="Edit"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                type="button"
                class="master-btn master-btn-danger master-btn-sm master-btn-icon"
                data-delete-event="${escapeHtml(id)}"
                title="Hapus"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  prepareAdminForm(admin = null) {
    this.state.editingId = admin
      ? this.getId(admin)
      : null;

    const form = qs('#adminForm');

    if (!form) return;

    form.reset();

    const id = qs('#adminId');
    const event = qs('#adminEvent');
    const name = qs('#adminName');
    const username = qs('#adminUsername');
    const password = qs('#adminPassword');
    const active = qs('#adminActive');

    if (id) {
      id.value = admin ? this.getId(admin) : '';
    }

    if (event) {
      event.value = admin
        ? String(
            admin.eventId ||
            admin.event_id ||
            admin.EventID ||
            ''
          )
        : '';
    }

    if (name) {
      name.value = admin
        ? String(
            admin.name ||
            admin.nama ||
            admin.fullName ||
            admin.full_name ||
            ''
          )
        : '';
    }

    if (username) {
      username.value = admin
        ? String(
            admin.username ||
            admin.Username ||
            ''
          )
        : '';
    }

    if (password) {
      password.value = admin
        ? String(
            admin.password ||
            admin.Password ||
            ''
          )
        : '';
    }

    if (active) {
      active.checked = admin
        ? this.isActive(admin)
        : true;
    }

    const title = qs('#adminModalTitle');

    if (title) {
      title.textContent = admin
        ? 'Edit Admin Event'
        : 'Tambah Admin Event';
    }

    this.populateEventDropdowns();
  },

  async saveAdmin() {
    const idInput = qs('#adminId');
    const eventInput = qs('#adminEvent');
    const nameInput = qs('#adminName');
    const usernameInput = qs('#adminUsername');
    const passwordInput = qs('#adminPassword');
    const activeInput = qs('#adminActive');

    const id = idInput ? idInput.value.trim() : '';
    const eventId = eventInput ? eventInput.value.trim() : '';
    const name = nameInput ? nameInput.value.trim() : '';
    const username = usernameInput
      ? usernameInput.value.trim()
      : '';
    const password = passwordInput
      ? passwordInput.value
      : '';
    const active = activeInput
      ? activeInput.checked
      : true;

    if (!eventId) {
      showToast('Event wajib dipilih.', 'error');
      return;
    }

    if (!name) {
      showToast('Nama admin wajib diisi.', 'error');
      return;
    }

    if (!username) {
      showToast('Username wajib diisi.', 'error');
      return;
    }

    if (!password) {
      showToast('Password wajib diisi.', 'error');
      return;
    }

    const duplicate = this.state.admins.find(admin => {
      const currentId = this.getId(admin);

      const currentUsername = String(
        admin.username ||
        admin.Username ||
        ''
      ).toLowerCase();

      return (
        currentUsername === username.toLowerCase() &&
        currentId !== id
      );
    });

    if (duplicate) {
      showToast('Username sudah digunakan.', 'error');
      return;
    }

    showLoading('Menyimpan akun admin...');

    try {
      const data = {
        id,
        eventId,
        name,
        username,
        password,
        role: 'ADMIN_EVENT',
        active,
        status: active ? 'ACTIVE' : 'INACTIVE'
      };

      const result = await App.save('USERS', data);

      if (!result || !result.success) {
        showToast(
          result && result.message
            ? result.message
            : 'Admin gagal disimpan.',
          'error'
        );
        return;
      }

      this.closeModal('adminModal');
      await this.loadAdmins();
      this.updateDashboard();

      showToast(
        id
          ? 'Admin berhasil diperbarui.'
          : 'Admin event berhasil dibuat.',
        'success'
      );
    } finally {
      closeLoading();
    }
  },

  editAdmin(id) {
    const admin = this.state.admins.find(
      item => this.getId(item) === String(id)
    );

    if (!admin) {
      showToast('Data admin tidak ditemukan.', 'error');
      return;
    }

    this.prepareAdminForm(admin);
    this.showModal('adminModal');
  },

  async deleteAdmin(id) {
    const admin = this.state.admins.find(
      item => this.getId(item) === String(id)
    );

    if (!admin) {
      showToast('Data admin tidak ditemukan.', 'error');
      return;
    }

    const username = String(
      admin.username ||
      admin.Username ||
      '-'
    );

    if (!confirm(`Hapus akun admin "${username}"?`)) {
      return;
    }

    showLoading('Menghapus akun admin...');

    try {
      const result = await App.remove('USERS', id);

      if (!result || !result.success) {
        showToast(
          result && result.message
            ? result.message
            : 'Admin gagal dihapus.',
          'error'
        );
        return;
      }

      await this.loadAdmins();
      this.updateDashboard();

      showToast('Akun admin berhasil dihapus.', 'success');
    } finally {
      closeLoading();
    }
  },

  renderAdmins() {
    const container = qs('#adminsTableBody');

    if (!container) return;

    const searchInput = qs('#adminSearch');

    const keyword = searchInput
      ? searchInput.value.trim().toLowerCase()
      : '';

    let rows = [...this.state.admins];

    if (keyword) {
      rows = rows.filter(admin => {
        const name = String(
          admin.name ||
          admin.nama ||
          admin.fullName ||
          ''
        ).toLowerCase();

        const username = String(
          admin.username ||
          admin.Username ||
          ''
        ).toLowerCase();

        return (
          name.includes(keyword) ||
          username.includes(keyword)
        );
      });
    }

    rows.sort((a, b) => {
      const aName = String(
        a.name ||
        a.nama ||
        a.fullName ||
        ''
      );

      const bName = String(
        b.name ||
        b.nama ||
        b.fullName ||
        ''
      );

      return aName.localeCompare(
        bName,
        'id',
        { sensitivity: 'base' }
      );
    });

    if (!rows.length) {
      container.innerHTML = `
        <tr>
          <td colspan="7" class="master-table-empty">
            <i class="bi bi-person-x"></i>
            Belum ada admin event.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = rows.map((admin, index) => {
      const id = this.getId(admin);

      const name = String(
        admin.name ||
        admin.nama ||
        admin.fullName ||
        '-'
      );

      const username = String(
        admin.username ||
        admin.Username ||
        '-'
      );

      const password = String(
        admin.password ||
        admin.Password ||
        '-'
      );

      const eventId = String(
        admin.eventId ||
        admin.event_id ||
        admin.EventID ||
        ''
      );

      const event = this.state.events.find(
        item => this.getId(item) === eventId
      );

      const eventName = event
        ? this.getEventName(event)
        : eventId || '-';

      const active = this.isActive(admin);

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(username)}</td>
          <td>
            <span class="master-password-text">
              ${escapeHtml(password)}
            </span>
          </td>
          <td>${escapeHtml(eventName)}</td>
          <td>
            <span class="master-badge ${
              active
                ? 'master-badge-success'
                : 'master-badge-muted'
            }">
              ${active ? 'Aktif' : 'Tidak Aktif'}
            </span>
          </td>
          <td>
            <div class="master-table-actions">
              <button
                type="button"
                class="master-btn master-btn-light master-btn-sm master-btn-icon"
                data-edit-admin="${escapeHtml(id)}"
                title="Edit"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                type="button"
                class="master-btn master-btn-danger master-btn-sm master-btn-icon"
                data-delete-admin="${escapeHtml(id)}"
                title="Hapus"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  prepareContactForm(contact = null) {
    this.state.contactEditingId = contact
      ? this.getId(contact)
      : null;

    const form = qs('#contactForm');

    if (!form) return;

    form.reset();

    const id = qs('#contactId');
    const type = qs('#contactType');
    const name = qs('#contactName');
    const link = qs('#contactLink');
    const active = qs('#contactActive');

    if (id) {
      id.value = contact
        ? this.getId(contact)
        : '';
    }

    if (type) {
      type.value = contact
        ? String(
            contact.type ||
            contact.tipe ||
            contact.platform ||
            ''
          )
        : '';
    }

    if (name) {
      name.value = contact
        ? String(
            contact.name ||
            contact.nama ||
            ''
          )
        : '';
    }

    if (link) {
      link.value = contact
        ? String(
            contact.link ||
            contact.url ||
            contact.URL ||
            ''
          )
        : '';
    }

    if (active) {
      active.checked = contact
        ? this.isActive(contact)
        : true;
    }

    const title = qs('#contactModalTitle');

    if (title) {
      title.textContent = contact
        ? 'Edit Kontak'
        : 'Tambah Kontak';
    }
  },

  async saveContact() {
    const idInput = qs('#contactId');
    const typeInput = qs('#contactType');
    const nameInput = qs('#contactName');
    const linkInput = qs('#contactLink');
    const activeInput = qs('#contactActive');

    const id = idInput
      ? idInput.value.trim()
      : '';

    const type = typeInput
      ? typeInput.value.trim()
      : '';

    const name = nameInput
      ? nameInput.value.trim()
      : '';

    const link = linkInput
      ? linkInput.value.trim()
      : '';

    const active = activeInput
      ? activeInput.checked
      : true;

    if (!type) {
      showToast('Jenis kontak wajib dipilih.', 'error');
      return;
    }

    if (!name) {
      showToast('Nama kontak wajib diisi.', 'error');
      return;
    }

    if (!link) {
      showToast('Link kontak wajib diisi.', 'error');
      return;
    }

    showLoading('Menyimpan kontak...');

    try {
      const data = {
        id,
        type,
        name,
        link,
        active,
        status: active ? 'ACTIVE' : 'INACTIVE'
      };

      const result = await App.save('CONTACTS', data);

      if (!result || !result.success) {
        showToast(
          result && result.message
            ? result.message
            : 'Kontak gagal disimpan.',
          'error'
        );
        return;
      }

      this.closeModal('contactModal');
      await this.loadContacts();
      this.updateDashboard();

      showToast(
        id
          ? 'Kontak berhasil diperbarui.'
          : 'Kontak berhasil ditambahkan.',
        'success'
      );
    } finally {
      closeLoading();
    }
  },

  editContact(id) {
    const contact = this.state.contacts.find(
      item => this.getId(item) === String(id)
    );

    if (!contact) {
      showToast('Data kontak tidak ditemukan.', 'error');
      return;
    }

    this.prepareContactForm(contact);
    this.showModal('contactModal');
  },

  async deleteContact(id) {
    const contact = this.state.contacts.find(
      item => this.getId(item) === String(id)
    );

    if (!contact) {
      showToast('Data kontak tidak ditemukan.', 'error');
      return;
    }

    const name = String(
      contact.name ||
      contact.nama ||
      '-'
    );

    if (!confirm(`Hapus kontak "${name}"?`)) {
      return;
    }

    showLoading('Menghapus kontak...');

    try {
      const result = await App.remove('CONTACTS', id);

      if (!result || !result.success) {
        showToast(
          result && result.message
            ? result.message
            : 'Kontak gagal dihapus.',
          'error'
        );
        return;
      }

      await this.loadContacts();
      this.updateDashboard();

      showToast('Kontak berhasil dihapus.', 'success');
    } finally {
      closeLoading();
    }
  },

  renderContacts() {
    const container = qs('#contactsTableBody');

    if (!container) return;

    const searchInput = qs('#contactSearch');

    const keyword = searchInput
      ? searchInput.value.trim().toLowerCase()
      : '';

    let rows = [...this.state.contacts];

    if (keyword) {
      rows = rows.filter(contact => {
        const type = String(
          contact.type ||
          contact.tipe ||
          ''
        ).toLowerCase();

        const name = String(
          contact.name ||
          contact.nama ||
          ''
        ).toLowerCase();

        const link = String(
          contact.link ||
          contact.url ||
          ''
        ).toLowerCase();

        return (
          type.includes(keyword) ||
          name.includes(keyword) ||
          link.includes(keyword)
        );
      });
    }

    rows.sort((a, b) => {
      const aName = String(
        a.name ||
        a.nama ||
        ''
      );

      const bName = String(
        b.name ||
        b.nama ||
        ''
      );

      return aName.localeCompare(
        bName,
        'id',
        { sensitivity: 'base' }
      );
    });

    if (!rows.length) {
      container.innerHTML = `
        <tr>
          <td colspan="6" class="master-table-empty">
            <i class="bi bi-person-lines-fill"></i>
            Belum ada kontak.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = rows.map((contact, index) => {
      const id = this.getId(contact);

      const type = String(
        contact.type ||
        contact.tipe ||
        contact.platform ||
        '-'
      );

      const name = String(
        contact.name ||
        contact.nama ||
        '-'
      );

      const link = String(
        contact.link ||
        contact.url ||
        '-'
      );

      const active = this.isActive(contact);

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <span class="master-badge master-badge-primary">
              ${escapeHtml(type)}
            </span>
          </td>
          <td>${escapeHtml(name)}</td>
          <td>
            <a
              class="master-link"
              href="${escapeHtml(link)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka Link
            </a>
          </td>
          <td>
            <span class="master-badge ${
              active
                ? 'master-badge-success'
                : 'master-badge-muted'
            }">
              ${active ? 'Aktif' : 'Tidak Aktif'}
            </span>
          </td>
          <td>
            <div class="master-table-actions">
              <button
                type="button"
                class="master-btn master-btn-light master-btn-sm master-btn-icon"
                data-edit-contact="${escapeHtml(id)}"
                title="Edit"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                type="button"
                class="master-btn master-btn-danger master-btn-sm master-btn-icon"
                data-delete-contact="${escapeHtml(id)}"
                title="Hapus"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  togglePassword(id) {
    const input = qs(`#${id}`);

    if (!input) return;

    input.type =
      input.type === 'password'
        ? 'text'
        : 'password';

    const button = document.querySelector(
      `[data-password-toggle="${id}"]`
    );

    if (!button) return;

    const icon = button.querySelector('i');

    if (icon) {
      icon.className =
        input.type === 'password'
          ? 'bi bi-eye'
          : 'bi bi-eye-slash';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MasterAdmin.init();
});
