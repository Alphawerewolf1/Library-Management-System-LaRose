// Organizations / Building Libraries (Schoology-style Multi-Tenant Directory)
const ORGANIZATIONS = [
  {
    orgId: 'ORG-LRN',
    name: 'LRN Main Building Library',
    siteCode: 'LRN-HQ',
    visibility: 'public', // 'public' | 'private'
    inviteCode: '',
    libAdminId: 'EMP-1002'
  },
  {
    orgId: 'ORG-TC',
    name: 'Tech Center Engineering Library',
    siteCode: 'TC-BLDG2',
    visibility: 'private',
    inviteCode: 'PRIV-TC-99',
    libAdminId: 'EMP-1005'
  },
  {
    orgId: 'ORG-FD',
    name: 'Finance & Operations Resource Hub',
    siteCode: 'FD-NORTH',
    visibility: 'public',
    inviteCode: '',
    libAdminId: 'EMP-1006'
  }
];

// Users & Library Memberships
// Roles: 'it_admin' (Global), 'library_admin' (Scoped to own orgId), 'member' (Default on public sign up)
const USERS_DB = [
  {
    id: 'EMP-1001',
    fullName: 'Cruz, Marco',
    username: 'marco_itadmin',
    email: 'marco.cruz@company.com',
    role: 'it_admin',
    primaryOrgId: 'ORG-LRN',
    memberships: [
      { orgId: 'ORG-LRN', status: 'Active' },
      { orgId: 'ORG-TC', status: 'Active' },
      { orgId: 'ORG-FD', status: 'Active' }
    ]
  },
  {
    id: 'EMP-1002',
    fullName: 'Reyes, Sophia',
    username: 'sophia_libadmin',
    email: 'sophia.reyes@company.com',
    role: 'library_admin',
    primaryOrgId: 'ORG-LRN',
    memberships: [
      { orgId: 'ORG-LRN', status: 'Active' }
    ]
  },
  {
    id: 'EMP-1005',
    fullName: 'Tan, Adrian',
    username: 'adrian_tcadmin',
    email: 'adrian.tan@company.com',
    role: 'library_admin',
    primaryOrgId: 'ORG-TC',
    memberships: [
      { orgId: 'ORG-TC', status: 'Active' }
    ]
  },
  {
    id: 'EMP-1006',
    fullName: 'Lim, Clarissa',
    username: 'clarissa_fdadmin',
    email: 'clarissa.lim@company.com',
    role: 'library_admin',
    primaryOrgId: 'ORG-FD',
    memberships: [
      { orgId: 'ORG-FD', status: 'Active' }
    ]
  },
  {
    id: 'EMP-1003',
    fullName: 'Mendoza, Sofia',
    username: 'sofia_member',
    email: 'sofia.mendoza@company.com',
    role: 'member',
    primaryOrgId: 'ORG-LRN',
    memberships: [
      { orgId: 'ORG-LRN', status: 'Active' },
      { orgId: 'ORG-FD', status: 'Active' }
    ]
  },
  {
    id: 'EMP-1004',
    fullName: 'Gomez, Patricia',
    username: 'patricia_member',
    email: 'patricia.gomez@company.com',
    role: 'member',
    primaryOrgId: 'ORG-TC',
    memberships: [
      { orgId: 'ORG-TC', status: 'Active' },
      { orgId: 'ORG-LRN', status: 'Pending' }
    ]
  }
];

const SEED_USER = window.CURRENT_USER || {
  employee_id: 'EMP-1001',
  full_name: 'Cruz, Marco',
  role: 'it_admin'
};

let ACTIVE_USER = USERS_DB.find(u => u.id === SEED_USER.employee_id) || USERS_DB[0];
let SELECTED_PORTAL_ORG_ID = SEED_USER.selected_org_code || ACTIVE_USER.primaryOrgId || 'ORG-LRN';

const BOOK_CATEGORIES = [
  'Software Engineering',
  'Networking & Security',
  'Database Systems',
  'IT Management & SOPs',
  'Hardware & Systems'
];

const BOOKS = [
  {
    id: 'BK-101',
    orgId: 'ORG-LRN',
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    shelf: 'Rack A - Shelf 1',
    total: 3,
    available: 2,
    activeLoans: [
      { loanId: 'LN-301', assetCode: 'AST-CC-02', qty: 1, borrowerId: 'EMP-1003', borrowerName: 'Mendoza, Sofia', borrowedAt: '2026-11-20', dueDate: '2026-12-04', overdue: false, extension: null, incident: null }
    ],
    reservations: [],
    incidents: []
  },
  {
    id: 'BK-102',
    orgId: 'ORG-TC',
    isbn: '978-1491950357',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Database Systems',
    shelf: 'TC Rack B - Shelf 2',
    total: 2,
    available: 1,
    activeLoans: [
      { loanId: 'LN-302', assetCode: 'AST-DDIA-01', qty: 1, borrowerId: 'EMP-1004', borrowerName: 'Gomez, Patricia', borrowedAt: '2026-11-18', dueDate: '2026-12-02', overdue: false, extension: null, incident: null }
    ],
    reservations: [
      { resId: 'RS-201', userId: 'EMP-1004', userName: 'Gomez, Patricia', qty: 1, reservedAt: '2026-11-25', pickupDate: '2026-12-02', status: 'Pending', declineReason: '' }
    ],
    incidents: []
  },
  {
    id: 'BK-103',
    orgId: 'ORG-LRN',
    isbn: '978-1587147029',
    title: 'CCNA 200-301 Official Cert Guide, Volume 1',
    author: 'Wendell Odom',
    category: 'Networking & Security',
    shelf: 'Rack C - Shelf 1',
    total: 2,
    available: 0,
    activeLoans: [
      { loanId: 'LN-303', assetCode: 'AST-CCNA-01', qty: 1, borrowerId: 'EMP-1003', borrowerName: 'Mendoza, Sofia', borrowedAt: '2026-11-01', dueDate: '2026-11-15', overdue: true, extension: null, incident: null },
      { loanId: 'LN-304', assetCode: 'AST-CCNA-02', qty: 1, borrowerId: 'EMP-1001', borrowerName: 'Cruz, Marco', borrowedAt: '2026-11-21', dueDate: '2026-12-05', overdue: false, extension: null, incident: null }
    ],
    reservations: [],
    incidents: []
  },
  {
    id: 'BK-104',
    orgId: 'ORG-FD',
    isbn: 'CORP-SOP-FD-001',
    title: 'Corporate Compliance & Procurement SOP Manual',
    author: 'Operations Department - FD',
    category: 'IT Management & SOPs',
    shelf: 'FD Rack A - Reference',
    total: 3,
    available: 3,
    activeLoans: [],
    reservations: [],
    incidents: []
  },
  {
    id: 'BK-105',
    orgId: 'ORG-TC',
    isbn: '978-1260463415',
    title: 'CompTIA A+ Certification All-in-One Exam Guide',
    author: 'Mike Meyers',
    category: 'Hardware & Systems',
    shelf: 'TC Rack C - Shelf 3',
    total: 2,
    available: 1,
    activeLoans: [
      { loanId: 'LN-305', assetCode: 'AST-APLUS-02', qty: 1, borrowerId: 'EMP-1005', borrowerName: 'Tan, Adrian', borrowedAt: '2026-11-19', dueDate: '2026-12-03', overdue: false, extension: null, incident: null }
    ],
    reservations: [],
    incidents: []
  }
];

const PAGE_SIZE = 5;
let currentPage = 1;
let activeKpiFilter = '';
let activeBookId = null;
let activeExtContext = null;
let loanModalTab = 'APPEAL';
let manageActionMode = 'ISSUE';
let pendingStockConfirm = null;
let pendingDeleteBookConfirm = false;
let myRecordsFilter = 'ALL';

const esc = (str) => String(str ?? '').replace(/[&<>"']/g, ch => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[ch]));

function getOrgById(orgId) {
  return ORGANIZATIONS.find(o => o.orgId === orgId) || null;
}

function getOrgName(orgId) {
  const org = getOrgById(orgId);
  return org ? org.name : orgId;
}

function isItAdmin() {
  return ACTIVE_USER.role === 'it_admin';
}

function isLibraryAdmin() {
  return ACTIVE_USER.role === 'library_admin';
}

function isStaffCirculator() {
  return ACTIVE_USER.role === 'it_admin' || ACTIVE_USER.role === 'library_admin';
}

function getAccessibleOrgIds() {
  if (isItAdmin()) {
    return ORGANIZATIONS.map(o => o.orgId);
  }
  if (isLibraryAdmin()) {
    return [ACTIVE_USER.primaryOrgId];
  }
  return ACTIVE_USER.memberships
    .filter(m => m.status === 'Active')
    .map(m => m.orgId);
}

function canManageOrg(orgId) {
  if (isItAdmin()) return true;
  if (isLibraryAdmin()) return ACTIVE_USER.primaryOrgId === orgId;
  return false;
}

function defaultDueISO(daysAhead = 7) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

function getBookStatus(book) {
  if (book.available <= 0) return 'OUT OF STOCK';
  if (book.available === 1) return 'LOW STOCK';
  return 'AVAILABLE';
}

function getIncidentCount(book) {
  return (book.incidents || []).reduce((sum, inc) => sum + (inc.qty || 1), 0);
}

function showToast(msg) {
  const banner = document.getElementById('toastBanner');
  if (!banner) return;
  banner.textContent = msg;
  banner.classList.add('show');
  clearTimeout(banner._t);
  banner._t = setTimeout(() => banner.classList.remove('show'), 3600);
}

// DOM References
const libraryFilter = document.getElementById('libraryFilter');
const myLibraryFilter = document.getElementById('myLibraryFilter');
const categoryFilter = document.getElementById('categoryFilter');
const bookCategorySelect = document.getElementById('bookCategory');
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');
const bookBody = document.getElementById('bookBody');
const paginationBar = document.getElementById('paginationBar');

BOOK_CATEGORIES.forEach(cat => {
  categoryFilter.insertAdjacentHTML('beforeend', `<option value="${esc(cat)}">${esc(cat)}</option>`);
  bookCategorySelect.insertAdjacentHTML('beforeend', `<option value="${esc(cat)}">${esc(cat)}</option>`);
});

function syncSessionUI() {
  const accessibleIds = getAccessibleOrgIds();
  const activePortalOrg = getOrgById(SELECTED_PORTAL_ORG_ID) || getOrgById(accessibleIds[0]);

  document.getElementById('brandTitle').textContent = isItAdmin() && activePortalOrg
    ? `Company Library — ${activePortalOrg.siteCode}`
    : isLibraryAdmin() && activePortalOrg
      ? `${activePortalOrg.name}`
      : 'Company Library Portal';

  document.getElementById('sidebarUserName').textContent = ACTIVE_USER.fullName;
  document.getElementById('sidebarUserRole').textContent = ACTIVE_USER.role.replace('_', ' ').toUpperCase();
  document.getElementById('sidebarUserDept').textContent = isItAdmin()
    ? `Global IT Admin • Active: ${activePortalOrg ? activePortalOrg.name : 'All'}`
    : isLibraryAdmin()
      ? `${getOrgName(ACTIVE_USER.primaryOrgId)} (Library Admin)`
      : `Member • ${accessibleIds.length} Joined ${accessibleIds.length === 1 ? 'Library' : 'Libraries'}`;

  const addBookBtn = document.getElementById('openNewBookBtn');
  if (addBookBtn) addBookBtn.style.display = isStaffCirculator() ? '' : 'none';

  const navUsersBtn = document.getElementById('navUsersBtn');
  if (navUsersBtn) navUsersBtn.style.display = isStaffCirculator() ? '' : 'none';

  const libOptions = accessibleIds.map(id => `<option value="${esc(id)}">${esc(getOrgName(id))}</option>`).join('');

  if (libraryFilter) {
    libraryFilter.innerHTML = (accessibleIds.length > 1 ? `<option value="">All Joined Libraries (${accessibleIds.length})</option>` : '') + libOptions;
    if (isItAdmin() && SELECTED_PORTAL_ORG_ID) {
      libraryFilter.value = SELECTED_PORTAL_ORG_ID;
    } else if (accessibleIds.length === 1) {
      libraryFilter.value = accessibleIds[0];
    } else {
      libraryFilter.value = '';
    }
  }

  if (myLibraryFilter) {
    myLibraryFilter.innerHTML = `<option value="">All My Libraries</option>` + libOptions;
    if (isItAdmin() && SELECTED_PORTAL_ORG_ID) {
      myLibraryFilter.value = SELECTED_PORTAL_ORG_ID;
    } else {
      myLibraryFilter.value = '';
    }
  }

  const quickListEl = document.getElementById('quickList');
  quickListEl.innerHTML = `
    <button type="button" class="quick-link" data-quick="my-loans">
      <svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
      My Loans &amp; Reservations
    </button>
    <button type="button" class="quick-link" data-quick="apply-lib">
      <svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
      Apply to Library
    </button>
    ${isStaffCirculator() ? `
      <button type="button" class="quick-link" data-quick="add-book">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Add New Book
      </button>
      <button type="button" class="quick-link" data-quick="manage-users">
        <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/></svg>
        Manage Org Members
      </button>
    ` : ''}
  `;

  const footerEl = document.getElementById('myLoansFooterUser');
  if (footerEl) {
    footerEl.innerHTML = `Signed in as <strong>${esc(ACTIVE_USER.fullName)}</strong> (${esc(ACTIVE_USER.id)}) &bull; Role: <strong>${esc(ACTIVE_USER.role.toUpperCase())}</strong>`;
  }

  renderTable();
  renderMyLoansView();
  renderLibraryDirectory();
  renderUsersManagement();
}

// Top Ribbon Navigation & Sidebar Collapse
const sidebar = document.querySelector('.sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const toggleSidebarLabel = document.getElementById('toggleSidebarLabel');

toggleSidebarBtn.addEventListener('click', () => {
  const hidden = sidebar.classList.toggle('collapsed');
  toggleSidebarBtn.setAttribute('aria-pressed', hidden);
  toggleSidebarBtn.classList.toggle('active', hidden);
  toggleSidebarLabel.textContent = hidden ? 'Show Panel' : 'Hide Panel';
});

const VIEW_MAP = {
  library: document.getElementById('libraryView'),
  myloans: document.getElementById('myloansView'),
  applylib: document.getElementById('applylibView'),
  dashboard: document.getElementById('dashboardView'),
  audit: document.getElementById('auditView'),
  users: document.getElementById('usersView')
};

function switchTab(tabKey) {
  if (tabKey === 'users' && !isStaffCirculator()) {
    showToast('User Management is only accessible to IT Admins and Library Admins.');
    return;
  }
  document.querySelectorAll('.nav-action[data-nav]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nav === tabKey);
  });
  Object.entries(VIEW_MAP).forEach(([key, el]) => {
    if (el) el.style.display = key === tabKey ? 'block' : 'none';
  });
  if (tabKey === 'library') renderTable();
  if (tabKey === 'myloans') renderMyLoansView();
  if (tabKey === 'applylib') renderLibraryDirectory();
  if (tabKey === 'users') renderUsersManagement();
}

document.getElementById('topActions').addEventListener('click', (e) => {
  const navBtn = e.target.closest('.nav-action[data-nav]');
  if (navBtn) switchTab(navBtn.dataset.nav);
});

document.getElementById('quickList').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-quick]');
  if (!btn) return;
  const act = btn.dataset.quick;
  if (act === 'my-loans') switchTab('myloans');
  if (act === 'apply-lib') switchTab('applylib');
  if (act === 'add-book') openNewBookModal();
  if (act === 'manage-users') switchTab('users');
});

// KPIs & Catalog Filtering
function getVisibleLibraryBooks() {
  const accessibleIds = getAccessibleOrgIds();
  const selectedOrg = libraryFilter ? libraryFilter.value : '';
  return BOOKS.filter(b => {
    if (!accessibleIds.includes(b.orgId)) return false;
    if (selectedOrg && b.orgId !== selectedOrg) return false;
    return true;
  });
}

function updateKpis() {
  const scopedBooks = getVisibleLibraryBooks().filter(b => !(b.total <= 0 && getIncidentCount(b) > 0));
  const totalTitles = scopedBooks.length;
  const availableCopies = scopedBooks.reduce((sum, b) => sum + b.available, 0);
  const borrowedCopies = scopedBooks.reduce((sum, b) => sum + b.activeLoans.reduce((s, l) => s + (l.qty || 1), 0), 0);
  const outOfStock = scopedBooks.filter(b => b.available === 0).length;
  const overdueLoans = scopedBooks.reduce((sum, b) => sum + b.activeLoans.filter(l => l.overdue).length, 0);

  document.getElementById('kpiTotalTitles').textContent = totalTitles;
  document.getElementById('kpiAvailableCopies').textContent = availableCopies;
  document.getElementById('kpiBorrowedCopies').textContent = borrowedCopies;
  document.getElementById('kpiOutOfStock').textContent = outOfStock;
  document.getElementById('kpiOverdueCount').textContent = overdueLoans;
}

function getFilteredBooks() {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;
  const st = statusFilter.value;

  return getVisibleLibraryBooks().filter(b => {
    const incidentTotal = getIncidentCount(b);

    if (st === 'DESTROYED_MISSING') {
      if (incidentTotal <= 0) return false;
    } else {
      if (b.total <= 0 && incidentTotal > 0) return false;
      const status = getBookStatus(b);
      if (st && status !== st) return false;
    }

    if (cat && b.category !== cat) return false;
    if (activeKpiFilter === 'BORROWED' && b.activeLoans.length === 0) return false;
    if (activeKpiFilter === 'OVERDUE' && !b.activeLoans.some(l => l.overdue)) return false;

    if (q) {
      const borrowersText = b.activeLoans.map(l => `${l.borrowerName} ${l.borrowerId} ${l.dueDate}`).join(' ');
      const incidentsText = (b.incidents || []).map(i => `${i.type} ${i.reportedBy} ${i.reason}`).join(' ');
      const hay = `${b.id} ${b.isbn} ${b.title} ${b.author} ${b.category} ${b.shelf} ${getOrgName(b.orgId)} ${borrowersText} ${incidentsText}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    paginationBar.innerHTML = '';
    return;
  }

  let middleHtml = '';
  if (totalPages <= 5) {
    for (let p = 1; p <= totalPages; p++) {
      middleHtml += `<button type="button" class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
  } else {
    [1, 2].forEach(p => {
      middleHtml += `<button type="button" class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    });

    const isMiddlePage = currentPage > 2 && currentPage < totalPages - 1;
    middleHtml += `
      <span class="page-jump-wrap">
        <input
          type="number"
          id="pageJumpInput"
          class="page-jump-input ${isMiddlePage ? 'active' : ''}"
          min="1"
          max="${totalPages}"
          value="${isMiddlePage ? currentPage : ''}"
          placeholder="Jump to"
          title="Enter page 1 to ${totalPages} and press Enter"
        >
        <span class="page-jump-hint" id="pageJumpHint"></span>
      </span>
    `;

    [totalPages - 1, totalPages].forEach(p => {
      middleHtml += `<button type="button" class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    });
  }

  paginationBar.innerHTML = `
    <button type="button" class="page-btn" data-page="first" title="First Page" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>
    <button type="button" class="page-btn" data-page="prev" title="Previous Page" ${currentPage === 1 ? 'disabled' : ''}>&lsaquo;</button>
    ${middleHtml}
    <button type="button" class="page-btn" data-page="next" title="Next Page" ${currentPage === totalPages ? 'disabled' : ''}>&rsaquo;</button>
    <button type="button" class="page-btn" data-page="last" title="Last Page" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>
  `;
}

function renderTable() {
  updateKpis();
  const accessibleIds = getAccessibleOrgIds();
  if (!accessibleIds.length) {
    bookBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:28px; color:#686270;">You are not enrolled in any library yet. Open <strong>Apply to Library</strong> to join a library.</td></tr>`;
    paginationBar.innerHTML = '';
    return;
  }

  const filtered = getFilteredBooks();
  const isIncidentFilter = statusFilter.value === 'DESTROYED_MISSING';
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  const hasFilters = Boolean(searchInput.value.trim() || categoryFilter.value || statusFilter.value || activeKpiFilter);
  resetBtn.classList.toggle('has-filters', hasFilters);

  const start = (currentPage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  if (!items.length) {
    bookBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:26px; color:#686270;">No matching books found in the selected library.</td></tr>`;
    paginationBar.innerHTML = '';
    return;
  }

  bookBody.innerHTML = items.map(b => {
    const incidentTotal = getIncidentCount(b);
    const status = isIncidentFilter ? 'DESTROYED / MISSING' : getBookStatus(b);
    const pillClass = isIncidentFilter
      ? 'st-out'
      : status === 'AVAILABLE'
        ? 'st-available'
        : status === 'LOW STOCK'
          ? 'st-low'
          : 'st-out';

    const pendingResCount = b.reservations.filter(r => r.status === 'Pending').length;
    const pendingExtCount = b.activeLoans.filter(l => l.extension && l.extension.status === 'Pending').length;
    const pendingIncCount = b.activeLoans.filter(l => l.incident && l.incident.status === 'Pending').length;

    const copyMeterHtml = isIncidentFilter
      ? `<span class="copy-meter" style="color:#dc3545;">${incidentTotal} <span>of ${incidentTotal} affected</span></span>`
      : `<span class="copy-meter">${b.available} <span>of ${b.total} available</span></span>`;

    const rightColHtml = isIncidentFilter
      ? `<div class="borrower-mini-list">
          ${(b.incidents || []).map(inc => `
            <div>
              <span class="due-tag overdue">${esc(inc.type.toUpperCase())}</span>
              <strong>${inc.qty} ${inc.qty === 1 ? 'copy' : 'copies'}</strong> &bull; ${esc(inc.reportedBy)}
            </div>
          `).join('')}
        </div>`
      : b.activeLoans.length
        ? `<div class="borrower-mini-list">
            ${b.activeLoans.map(l => {
              const qtyTag = (l.qty || 1) > 1 ? ` (${l.qty} copies)` : '';
              return `
                <div>
                  <strong>${esc(l.borrowerName)}</strong>${qtyTag}
                  <span class="due-tag ${l.overdue ? 'overdue' : ''}">${l.overdue ? 'OVERDUE' : 'Due'} ${esc(l.dueDate)}</span>
                </div>
              `;
            }).join('')}
          </div>`
        : `<span style="color:#8c8594; font-size:0.78rem;">None</span>`;

    const actionLabel = canManageOrg(b.orgId) ? 'Manage' : 'Details';

    return `
      <tr>
        <td>
          <span class="book-code">${esc(b.id)}</span>
          <span class="isbn-sub">${esc(b.isbn)}</span>
        </td>
        <td><span class="pill ${pillClass}">${status}</span></td>
        <td>
          <strong>${esc(b.title)}</strong>
          <div style="font-size:0.74rem; color:#686270; margin-top:2px;">&#127970; ${esc(getOrgName(b.orgId))}</div>
          ${pendingResCount ? `<div style="margin-top:3px;"><span class="due-tag reserved">${pendingResCount} Pending Reservation</span></div>` : ''}
          ${pendingExtCount ? `<div style="margin-top:3px;"><span class="due-tag reserved">${pendingExtCount} Extension Appeal</span></div>` : ''}
          ${pendingIncCount ? `<div style="margin-top:3px;"><span class="due-tag overdue">${pendingIncCount} Missing/Destroyed Report</span></div>` : ''}
        </td>
        <td>${esc(b.author)}</td>
        <td>${esc(b.category)}</td>
        <td>${esc(b.shelf)}</td>
        <td>${copyMeterHtml}</td>
        <td>${rightColHtml}</td>
        <td><button type="button" class="action-btn" data-book-id="${esc(b.id)}">${actionLabel}</button></td>
      </tr>
    `;
  }).join('');

  renderPagination(totalPages);
}

// Pagination Events
function applyPageJump(inputEl) {
  const filtered = getFilteredBooks();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const raw = inputEl.value.trim();
  if (!raw) return;

  const target = Number(raw);
  const hintEl = document.getElementById('pageJumpHint');

  if (!Number.isInteger(target) || target < 1 || target > totalPages) {
    inputEl.classList.add('invalid');
    if (hintEl) hintEl.textContent = `Max: ${totalPages}`;
    showToast(`Page out of range. Enter a page between 1 and ${totalPages}.`);
    return;
  }

  inputEl.classList.remove('invalid');
  if (hintEl) hintEl.textContent = '';
  currentPage = target;
  renderTable();
}

paginationBar.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-page]');
  if (!btn || btn.disabled) return;

  const filtered = getFilteredBooks();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const val = btn.dataset.page;

  if (val === 'first') currentPage = 1;
  else if (val === 'prev') currentPage = Math.max(1, currentPage - 1);
  else if (val === 'next') currentPage = Math.min(totalPages, currentPage + 1);
  else if (val === 'last') currentPage = totalPages;
  else currentPage = Number(val);

  renderTable();
});

paginationBar.addEventListener('keydown', (e) => {
  if (e.target && e.target.id === 'pageJumpInput' && e.key === 'Enter') {
    e.preventDefault();
    applyPageJump(e.target);
  }
});

paginationBar.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'pageJumpInput') {
    e.target.classList.remove('invalid');
    const hintEl = document.getElementById('pageJumpHint');
    if (hintEl) hintEl.textContent = '';
  }
});

[searchInput, libraryFilter, categoryFilter, statusFilter].forEach(el => {
  if (!el) return;
  el.addEventListener('input', () => { currentPage = 1; renderTable(); });
  el.addEventListener('change', () => {
    if (el === libraryFilter && isItAdmin() && libraryFilter.value) {
      SELECTED_PORTAL_ORG_ID = libraryFilter.value;
    }
    currentPage = 1;
    renderTable();
  });
});

document.querySelectorAll('.kpi-card').forEach(card => {
  card.addEventListener('click', () => {
    const kpi = card.dataset.kpi;
    if (!kpi) return;
    document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active'));
    activeKpiFilter = '';
    statusFilter.value = '';

    if (kpi === 'AVAILABLE' || kpi === 'OUT OF STOCK') {
      statusFilter.value = kpi;
      card.classList.add('active');
    } else if (kpi === 'BORROWED' || kpi === 'OVERDUE') {
      activeKpiFilter = kpi;
      card.classList.add('active');
    }
    currentPage = 1;
    renderTable();
  });
});

resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = '';
  statusFilter.value = '';
  activeKpiFilter = '';
  document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active'));
  currentPage = 1;
  renderTable();
});

// Self Borrow / Reserve Modal
const selfBorrowOverlay = document.getElementById('selfBorrowOverlay');
const selfBookInput = document.getElementById('selfBookInput');
const selfBookDatalist = document.getElementById('selfBookDatalist');
const selfActionType = document.getElementById('selfActionType');
const selfQuantityInput = document.getElementById('selfQuantityInput');
const selfDueDate = document.getElementById('selfDueDate');
const confirmSelfBorrowBtn = document.getElementById('confirmSelfBorrowBtn');

function getEligibleBooks() {
  const actionType = selfActionType ? selfActionType.value : 'BORROW';
  const accessibleIds = getAccessibleOrgIds();
  const selectedMyOrg = myLibraryFilter ? myLibraryFilter.value : '';

  return BOOKS.filter(b => {
    if (!accessibleIds.includes(b.orgId)) return false;
    if (selectedMyOrg && b.orgId !== selectedMyOrg) return false;
    if (b.total <= 0 && getIncidentCount(b) > 0) return false;

    const hasActiveLoan = b.activeLoans.some(l => l.borrowerId === ACTIVE_USER.id);
    const hasOpenRes = b.reservations.some(r => r.userId === ACTIVE_USER.id && (r.status === 'Pending' || r.status === 'Approved'));
    if (hasActiveLoan || hasOpenRes) return false;
    if (actionType === 'BORROW' && b.available <= 0) return false;
    return true;
  });
}

function resolveSelectedBook() {
  if (!selfBookInput) return null;
  const raw = selfBookInput.value.trim().toLowerCase();
  if (!raw) return null;
  const eligible = getEligibleBooks();
  return eligible.find(b => b.title.toLowerCase() === raw)
    || eligible.find(b => b.title.toLowerCase().includes(raw));
}

function syncQuantityLimit() {
  if (!selfQuantityInput) return;
  const book = resolveSelectedBook();
  const actionType = selfActionType ? selfActionType.value : 'BORROW';
  const maxAllowed = !book
    ? 1
    : actionType === 'BORROW'
      ? Math.max(1, book.available)
      : Math.max(1, book.total);

  selfQuantityInput.max = String(maxAllowed);
  if (Number(selfQuantityInput.value) > maxAllowed) selfQuantityInput.value = String(maxAllowed);
  if (Number(selfQuantityInput.value) < 1) selfQuantityInput.value = '1';
}

function updateDynamicBookOptions() {
  if (!selfBookDatalist) return;
  const eligible = getEligibleBooks();
  selfBookDatalist.innerHTML = eligible.map(b =>
    `<option value="${esc(b.title)}">${esc(getOrgName(b.orgId))} — ${b.available} of ${b.total} avail</option>`
  ).join('');
  if (confirmSelfBorrowBtn) confirmSelfBorrowBtn.disabled = eligible.length === 0;
  syncQuantityLimit();
}

function openSelfBorrowModal() {
  if (!getAccessibleOrgIds().length) {
    showToast('Join a library first in "Apply to Library" before borrowing or reserving.');
    return;
  }
  if (selfBookInput) selfBookInput.value = '';
  if (selfQuantityInput) selfQuantityInput.value = '1';
  if (selfDueDate) selfDueDate.value = defaultDueISO(7);
  updateDynamicBookOptions();
  selfBorrowOverlay.classList.add('open');
  selfBorrowOverlay.setAttribute('aria-hidden', 'false');
  if (selfBookInput) setTimeout(() => selfBookInput.focus(), 40);
}

function closeSelfBorrowModal() {
  selfBorrowOverlay.classList.remove('open');
  selfBorrowOverlay.setAttribute('aria-hidden', 'true');
}

document.getElementById('openSelfBorrowBtn')?.addEventListener('click', openSelfBorrowModal);
document.getElementById('closeSelfBorrowBtn')?.addEventListener('click', closeSelfBorrowModal);
selfBorrowOverlay?.addEventListener('click', (e) => { if (e.target === selfBorrowOverlay) closeSelfBorrowModal(); });
selfBookInput?.addEventListener('input', syncQuantityLimit);
selfBookInput?.addEventListener('change', syncQuantityLimit);

selfActionType?.addEventListener('change', () => {
  if (selfBookInput) selfBookInput.value = '';
  if (selfQuantityInput) selfQuantityInput.value = '1';
  updateDynamicBookOptions();
});

document.getElementById('selfBorrowForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const book = resolveSelectedBook();
  if (!book) {
    showToast('Please select a valid available book from your joined libraries.');
    return;
  }

  const actionType = selfActionType.value;
  const targetDate = selfDueDate.value;
  const qty = Math.max(1, Number(selfQuantityInput?.value) || 1);

  if (actionType === 'BORROW') {
    if (qty > book.available) {
      showToast(`Only ${book.available} cop${book.available === 1 ? 'y' : 'ies'} available.`);
      return;
    }
    const assignedAssets = [];
    for (let i = 0; i < qty; i++) {
      assignedAssets.push(`${book.id}-CP${book.total - book.available + 1 + i}`);
    }
    book.available -= qty;
    book.activeLoans.push({
      loanId: 'LN-' + Math.floor(400 + Math.random() * 500),
      assetCode: assignedAssets.join(', '),
      qty,
      borrowerId: ACTIVE_USER.id,
      borrowerName: ACTIVE_USER.fullName,
      borrowedAt: new Date().toISOString().slice(0, 10),
      dueDate: targetDate,
      overdue: false,
      extension: null,
      incident: null
    });
    showToast(`Borrowed ${qty} cop${qty === 1 ? 'y' : 'ies'} of "${book.title}" from ${getOrgName(book.orgId)}.`);
  } else {
    book.reservations.push({
      resId: 'RS-' + Math.floor(300 + Math.random() * 500),
      userId: ACTIVE_USER.id,
      userName: ACTIVE_USER.fullName,
      qty,
      reservedAt: new Date().toISOString().slice(0, 10),
      pickupDate: targetDate,
      status: 'Pending',
      declineReason: ''
    });
    showToast(`Reservation submitted for ${qty} cop${qty === 1 ? 'y' : 'ies'} of "${book.title}" (${getOrgName(book.orgId)}).`);
  }

  closeSelfBorrowModal();
  renderTable();
  renderMyLoansView();
});

// My Loans & Reservations View
const mySearchInput = document.getElementById('mySearchInput');
const myStatusFilter = document.getElementById('myStatusFilter');
const mySortSelect = document.getElementById('mySortSelect');
const myResetBtn = document.getElementById('myResetBtn');

function getMyRecords() {
  const records = [];
  const accessibleIds = getAccessibleOrgIds();
  const selectedMyOrg = myLibraryFilter ? myLibraryFilter.value : '';

  BOOKS.forEach(b => {
    if (!accessibleIds.includes(b.orgId)) return;
    if (selectedMyOrg && b.orgId !== selectedMyOrg) return;

    b.activeLoans.forEach(l => {
      if (l.borrowerId === ACTIVE_USER.id) {
        records.push({
          kind: 'BORROWED',
          recordId: l.loanId,
          assetOrBookId: l.assetCode,
          bookId: b.id,
          orgId: b.orgId,
          title: b.title,
          qty: l.qty || 1,
          status: l.overdue ? 'OVERDUE' : 'ACTIVE LOAN',
          dateStart: l.borrowedAt,
          dateTarget: l.dueDate,
          overdue: l.overdue,
          extension: l.extension,
          incident: l.incident,
          note: ''
        });
      }
    });
    b.reservations.forEach(r => {
      if (r.userId === ACTIVE_USER.id) {
        records.push({
          kind: 'RESERVED',
          recordId: r.resId,
          assetOrBookId: b.id,
          bookId: b.id,
          orgId: b.orgId,
          title: b.title,
          qty: r.qty || 1,
          status: String(r.status || 'Pending').toUpperCase(),
          dateStart: r.reservedAt,
          dateTarget: r.pickupDate,
          overdue: false,
          extension: null,
          incident: null,
          note: r.declineReason || ''
        });
      }
    });
  });
  return records;
}

function renderMyLoansView() {
  const tableBody = document.getElementById('myLoansTableBody');
  if (!tableBody) return;
  const allRecords = getMyRecords();

  document.getElementById('myKpiTotal').textContent = allRecords.length;
  document.getElementById('myKpiBorrowed').textContent = allRecords.filter(r => r.kind === 'BORROWED').length;
  document.getElementById('myKpiReserved').textContent = allRecords.filter(r => r.kind === 'RESERVED').length;
  document.getElementById('myKpiOverdue').textContent = allRecords.filter(r => r.overdue).length;

  document.querySelectorAll('[data-my-kpi]').forEach(card => {
    card.classList.toggle('active', card.dataset.myKpi === myRecordsFilter);
  });

  const q = mySearchInput ? mySearchInput.value.trim().toLowerCase() : '';
  const st = myStatusFilter ? myStatusFilter.value : '';
  const sortMode = mySortSelect ? mySortSelect.value : 'DUE_SOONEST';

  const hasMyFilters = Boolean(q || st || (myLibraryFilter && myLibraryFilter.value) || myRecordsFilter !== 'ALL' || sortMode !== 'DUE_SOONEST');
  if (myResetBtn) myResetBtn.classList.toggle('has-filters', hasMyFilters);

  let visible = allRecords.filter(r => {
    if (myRecordsFilter === 'BORROWED' && r.kind !== 'BORROWED') return false;
    if (myRecordsFilter === 'RESERVED' && r.kind !== 'RESERVED') return false;
    if (myRecordsFilter === 'OVERDUE' && !r.overdue) return false;
    if (st && r.status !== st) return false;
    if (q) {
      const hay = `${r.recordId} ${r.assetOrBookId} ${r.title} ${getOrgName(r.orgId)} ${r.status} ${r.note}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  visible.sort((a, b) => {
    if (sortMode === 'DUE_SOONEST') return String(a.dateTarget).localeCompare(String(b.dateTarget));
    if (sortMode === 'DUE_LATEST') return String(b.dateTarget).localeCompare(String(a.dateTarget));
    if (sortMode === 'TITLE_ASC') return a.title.localeCompare(b.title);
    if (sortMode === 'TITLE_DESC') return b.title.localeCompare(a.title);
    return String(b.dateStart).localeCompare(String(a.dateStart));
  });

  if (!visible.length) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:26px; color:#686270;">No matching loans or reservations found for the selected library.</td></tr>`;
    return;
  }

  tableBody.innerHTML = visible.map(r => {
    const pillClass = (r.overdue || r.status === 'DECLINED')
      ? 'st-out'
      : (r.kind === 'BORROWED' || r.status === 'APPROVED')
        ? 'st-available'
        : 'st-low';

    let actionCell = '';
    if (r.kind === 'BORROWED') {
      const extBadge = r.extension
        ? `<div class="loan-item-meta">Extension: <strong>${esc(r.extension.status)}</strong>${r.extension.status === 'Denied' && r.extension.denyReason ? ` — <span style="color:#dc3545;">${esc(r.extension.denyReason)}</span>` : ''}</div>`
        : '';
      const incBadge = r.incident
        ? `<div class="loan-item-meta" style="color:#b91c1c;">Report (${esc(r.incident.type)} &times;${r.incident.qty}): <strong>${esc(r.incident.status)}</strong></div>`
        : '';

      actionCell = `
        <button type="button" class="action-btn" data-open-ext-book="${esc(r.bookId)}" data-open-ext-loan="${esc(r.recordId)}">
          Appeal / Report
        </button>
        ${extBadge}
        ${incBadge}
      `;
    } else if (r.status === 'PENDING') {
      actionCell = `<button type="button" class="action-btn" data-cancel-res-book="${esc(r.bookId)}" data-cancel-res-id="${esc(r.recordId)}">Cancel Request</button>`;
    } else if (r.status === 'DECLINED') {
      actionCell = `<span style="color:#dc3545; font-size:0.78rem; font-weight:600;">Declined: ${esc(r.note || 'No reason provided')}</span>`;
    } else {
      actionCell = `<span style="color:#1e5bb8; font-size:0.78rem; font-weight:600;">Ready for Pickup</span>`;
    }

    return `
      <tr>
        <td>
          <span class="book-code">${esc(r.recordId)}</span>
          <span class="isbn-sub">${esc(r.assetOrBookId)}</span>
        </td>
        <td><strong>${r.kind === 'BORROWED' ? 'Loan' : 'Reservation'}</strong> (${r.qty} ${r.qty === 1 ? 'copy' : 'copies'})</td>
        <td><span class="pill ${pillClass}">${esc(r.status)}</span></td>
        <td>
          <strong>${esc(r.title)}</strong>
          <div style="font-size:0.74rem; color:#686270; margin-top:2px;">&#127970; ${esc(getOrgName(r.orgId))}</div>
        </td>
        <td>${esc(r.dateStart)}</td>
        <td><strong>${esc(r.dateTarget)}</strong></td>
        <td>${actionCell}</td>
      </tr>
    `;
  }).join('');
}

[mySearchInput, myLibraryFilter, myStatusFilter, mySortSelect].forEach(el => {
  if (!el) return;
  el.addEventListener('input', renderMyLoansView);
  el.addEventListener('change', renderMyLoansView);
});

myResetBtn?.addEventListener('click', () => {
  if (mySearchInput) mySearchInput.value = '';
  if (myLibraryFilter) myLibraryFilter.value = '';
  if (myStatusFilter) myStatusFilter.value = '';
  if (mySortSelect) mySortSelect.value = 'DUE_SOONEST';
  myRecordsFilter = 'ALL';
  renderMyLoansView();
});

// Apply to Library Directory
const dirSearchInput = document.getElementById('dirSearchInput');
const dirVisibilityFilter = document.getElementById('dirVisibilityFilter');

function renderLibraryDirectory() {
  const tbody = document.getElementById('libraryDirTableBody');
  if (!tbody) return;

  const q = dirSearchInput ? dirSearchInput.value.trim().toLowerCase() : '';
  const vis = dirVisibilityFilter ? dirVisibilityFilter.value : '';

  const listedOrgs = ORGANIZATIONS.filter(org => {
    const membership = ACTIVE_USER.memberships.find(m => m.orgId === org.orgId);
    const isJoined = Boolean(membership && membership.status === 'Active');

    if (org.visibility === 'private' && !isJoined && !isItAdmin()) return false;
    if (vis === 'public' && org.visibility !== 'public') return false;
    if (vis === 'JOINED' && !isJoined) return false;

    if (q) {
      const hay = `${org.orgId} ${org.name} ${org.siteCode} ${org.visibility}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (!listedOrgs.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:26px; color:#686270;">No matching public libraries found. If your company library is Private, enter its Access Code above.</td></tr>`;
    return;
  }

  tbody.innerHTML = listedOrgs.map(org => {
    const admin = USERS_DB.find(u => u.id === org.libAdminId);
    const bookCount = BOOKS.filter(b => b.orgId === org.orgId && !(b.total <= 0 && getIncidentCount(b) > 0)).length;
    const membership = ACTIVE_USER.memberships.find(m => m.orgId === org.orgId);

    let statusActionHtml = '';
    if (isItAdmin() || (membership && membership.status === 'Active')) {
      statusActionHtml = `<span class="pill st-available">ACTIVE MEMBER</span>`;
    } else if (membership && membership.status === 'Pending') {
      statusActionHtml = `<span class="pill st-low">PENDING APPROVAL</span>`;
    } else {
      statusActionHtml = `<button type="button" class="action-btn" data-apply-org-id="${esc(org.orgId)}">Apply to Library</button>`;
    }

    return `
      <tr>
        <td><span class="book-code">${esc(org.orgId)}</span></td>
        <td><span class="pill ${org.visibility === 'public' ? 'st-available' : 'st-low'}">${esc(org.visibility.toUpperCase())}</span></td>
        <td><strong>${esc(org.name)}</strong></td>
        <td>${esc(org.siteCode)}</td>
        <td>${admin ? esc(admin.fullName) : 'Assigned Admin'}</td>
        <td>${bookCount} ${bookCount === 1 ? 'Title' : 'Titles'}</td>
        <td>${statusActionHtml}</td>
      </tr>
    `;
  }).join('');
}

[dirSearchInput, dirVisibilityFilter].forEach(el => {
  if (!el) return;
  el.addEventListener('input', renderLibraryDirectory);
  el.addEventListener('change', renderLibraryDirectory);
});

document.getElementById('libraryDirTableBody')?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-apply-org-id]');
  if (!btn) return;
  const org = getOrgById(btn.dataset.applyOrgId);
  if (!org) return;

  const existing = ACTIVE_USER.memberships.find(m => m.orgId === org.orgId);
  if (!existing) {
    ACTIVE_USER.memberships.push({ orgId: org.orgId, status: 'Active' });
    syncSessionUI();
    showToast(`Joined "${org.name}" as a Member! Its catalog is now available in your Library filter.`);
  }
});

document.getElementById('joinPrivateCodeBtn')?.addEventListener('click', () => {
  const code = document.getElementById('privateCodeInput')?.value.trim().toUpperCase();
  if (!code) {
    showToast('Enter a Private Library Access Code first.');
    return;
  }
  const org = ORGANIZATIONS.find(o => o.visibility === 'private' && o.inviteCode.toUpperCase() === code);
  if (!org) {
    showToast('Invalid Private Library Access Code.');
    return;
  }
  const existing = ACTIVE_USER.memberships.find(m => m.orgId === org.orgId);
  if (existing && existing.status === 'Active') {
    showToast(`You are already a member of "${org.name}".`);
    return;
  }
  if (existing) {
    existing.status = 'Active';
  } else {
    ACTIVE_USER.memberships.push({ orgId: org.orgId, status: 'Active' });
  }
  document.getElementById('privateCodeInput').value = '';
  syncSessionUI();
  showToast(`Joined Private Library "${org.name}" as a Member!`);
});

// Scoped User Management
const userSearchInput = document.getElementById('userSearchInput');
const userOrgFilter = document.getElementById('userOrgFilter');
const userStatusFilter = document.getElementById('userStatusFilter');

function renderUsersManagement() {
  const tbody = document.getElementById('usersMgmtTableBody');
  if (!tbody || !isStaffCirculator()) return;

  const headingEl = document.getElementById('usersViewHeading');
  if (headingEl) {
    headingEl.textContent = isItAdmin()
      ? 'User Management (All Organizations)'
      : `User Management — ${getOrgName(ACTIVE_USER.primaryOrgId)}`;
  }

  if (userOrgFilter) {
    const allowedOrgs = isItAdmin() ? ORGANIZATIONS : ORGANIZATIONS.filter(o => o.orgId === ACTIVE_USER.primaryOrgId);
    const prevVal = userOrgFilter.value;
    userOrgFilter.innerHTML = (allowedOrgs.length > 1 ? `<option value="">All Organizations</option>` : '') +
      allowedOrgs.map(o => `<option value="${esc(o.orgId)}">${esc(o.name)}</option>`).join('');
    if (allowedOrgs.length === 1) {
      userOrgFilter.value = allowedOrgs[0].orgId;
    } else if (prevVal) {
      userOrgFilter.value = prevVal;
    }
  }

  const q = userSearchInput ? userSearchInput.value.trim().toLowerCase() : '';
  const selectedOrg = userOrgFilter ? userOrgFilter.value : '';
  const stFilter = userStatusFilter ? userStatusFilter.value : '';

  const rows = [];
  USERS_DB.forEach(user => {
    user.memberships.forEach(mem => {
      if (isLibraryAdmin() && mem.orgId !== ACTIVE_USER.primaryOrgId) return;
      if (selectedOrg && mem.orgId !== selectedOrg) return;
      if (stFilter && mem.status !== stFilter) return;

      const org = getOrgById(mem.orgId);
      if (!org) return;

      if (q) {
        const hay = `${user.id} ${user.fullName} ${user.email} ${user.role} ${org.name} ${mem.status}`.toLowerCase();
        if (!hay.includes(q)) return;
      }

      rows.push({ user, mem, org });
    });
  });

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:26px; color:#686270;">No members or applicants found for this organization.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(({ user, mem, org }) => {
    const isPending = mem.status === 'Pending';
    const actionHtml = isPending
      ? `<div style="display:flex; gap:6px;">
          <button type="button" class="action-btn" data-approve-member-user="${esc(user.id)}" data-approve-member-org="${esc(org.orgId)}">Approve</button>
          <button type="button" class="btn-return" style="height:30px; padding:0 10px; font-size:0.75rem;" data-remove-member-user="${esc(user.id)}" data-remove-member-org="${esc(org.orgId)}">Decline</button>
        </div>`
      : user.id === ACTIVE_USER.id
        ? `<span style="font-size:0.78rem; color:#686270;">Current Account</span>`
        : `<button type="button" class="btn-return" style="height:30px; padding:0 10px; font-size:0.75rem;" data-remove-member-user="${esc(user.id)}" data-remove-member-org="${esc(org.orgId)}">Remove</button>`;

    return `
      <tr>
        <td><span class="book-code">${esc(user.id)}</span></td>
        <td><span class="pill st-available">${esc(user.role.replace('_', ' ').toUpperCase())}</span></td>
        <td>
          <strong>${esc(user.fullName)}</strong>
          <span class="isbn-sub">${esc(user.email)}</span>
        </td>
        <td>${esc(org.name)}</td>
        <td><span class="pill ${org.visibility === 'public' ? 'st-available' : 'st-low'}">${esc(org.visibility.toUpperCase())}</span></td>
        <td><span class="pill ${isPending ? 'st-low' : 'st-available'}">${esc(mem.status.toUpperCase())}</span></td>
        <td>${actionHtml}</td>
      </tr>
    `;
  }).join('');
}

[userSearchInput, userOrgFilter, userStatusFilter].forEach(el => {
  if (!el) return;
  el.addEventListener('input', renderUsersManagement);
  el.addEventListener('change', renderUsersManagement);
});

document.getElementById('usersMgmtTableBody')?.addEventListener('click', (e) => {
  const appBtn = e.target.closest('[data-approve-member-user]');
  if (appBtn) {
    const user = USERS_DB.find(u => u.id === appBtn.dataset.approveMemberUser);
    const mem = user && user.memberships.find(m => m.orgId === appBtn.dataset.approveMemberOrg);
    if (mem) {
      mem.status = 'Active';
      renderUsersManagement();
      showToast(`Approved ${user.fullName} as an active Member of ${getOrgName(mem.orgId)}.`);
    }
    return;
  }

  const remBtn = e.target.closest('[data-remove-member-user]');
  if (remBtn) {
    const user = USERS_DB.find(u => u.id === remBtn.dataset.removeMemberUser);
    if (!user) return;
    const idx = user.memberships.findIndex(m => m.orgId === remBtn.dataset.removeMemberOrg);
    if (idx !== -1) {
      const removedOrg = getOrgName(user.memberships[idx].orgId);
      user.memberships.splice(idx, 1);
      renderUsersManagement();
      showToast(`Removed ${user.fullName} from ${removedOrg}.`);
    }
  }
});

// Library Admin / IT Admin: Register Member Directly Modal
const registerMemberOverlay = document.getElementById('registerMemberOverlay');

function openRegisterMemberModal() {
  if (!isStaffCirculator()) return;
  const orgSelect = document.getElementById('regMemberOrgSelect');
  const allowedOrgs = isItAdmin() ? ORGANIZATIONS : ORGANIZATIONS.filter(o => o.orgId === ACTIVE_USER.primaryOrgId);
  orgSelect.innerHTML = allowedOrgs.map(o => `<option value="${esc(o.orgId)}">${esc(o.name)} (${o.visibility.toUpperCase()})</option>`).join('');
  registerMemberOverlay.classList.add('open');
  registerMemberOverlay.setAttribute('aria-hidden', 'false');
}

function closeRegisterMemberModal() {
  registerMemberOverlay.classList.remove('open');
  registerMemberOverlay.setAttribute('aria-hidden', 'true');
}

document.getElementById('openRegisterMemberBtn')?.addEventListener('click', openRegisterMemberModal);
document.getElementById('closeRegisterMemberBtn')?.addEventListener('click', closeRegisterMemberModal);
registerMemberOverlay?.addEventListener('click', (e) => { if (e.target === registerMemberOverlay) closeRegisterMemberModal(); });

document.getElementById('registerMemberForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const orgId = document.getElementById('regMemberOrgSelect').value;
  const fullName = document.getElementById('regMemberNameInput').value.trim();
  const email = document.getElementById('regMemberEmailInput').value.trim();
  const username = document.getElementById('regMemberUsernameInput').value.trim();

  let user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: 'EMP-' + (1001 + USERS_DB.length),
      fullName,
      username,
      email,
      role: 'member',
      primaryOrgId: orgId,
      memberships: []
    };
    USERS_DB.push(user);
  }

  const existingMem = user.memberships.find(m => m.orgId === orgId);
  if (existingMem) {
    existingMem.status = 'Active';
  } else {
    user.memberships.push({ orgId, status: 'Active' });
  }

  e.target.reset();
  closeRegisterMemberModal();
  renderUsersManagement();
  showToast(`Registered ${user.fullName} as a Member of ${getOrgName(orgId)}.`);
});

// Public Entry / Sign In / Sign Up / Register Company & Library Admin Modal
const authPortalOverlay = document.getElementById('authPortalOverlay');
const loginAccountSelect = document.getElementById('loginAccountSelect');
const itAdminOrgPickerGroup = document.getElementById('itAdminOrgPickerGroup');
const loginItAdminOrgSelect = document.getElementById('loginItAdminOrgSelect');

function switchAuthTab(tab) {
  document.querySelectorAll('[data-auth-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.authTab === tab);
  });
  document.getElementById('portalLoginForm').style.display = tab === 'LOGIN' ? 'block' : 'none';
  document.getElementById('portalSignupForm').style.display = tab === 'SIGNUP' ? 'block' : 'none';
  document.getElementById('portalRegisterOrgForm').style.display = tab === 'REGISTER_ORG' ? 'block' : 'none';
}

function populateAuthPortalDropdowns() {
  if (loginAccountSelect) {
    loginAccountSelect.innerHTML = USERS_DB.map(u => {
      const roleLabel = u.role.replace('_', ' ').toUpperCase();
      const orgHint = u.role === 'it_admin' ? 'All Organizations' : getOrgName(u.primaryOrgId);
      return `<option value="${esc(u.id)}" ${u.id === ACTIVE_USER.id ? 'selected' : ''}>${esc(u.fullName)} — [${roleLabel}] (${esc(orgHint)})</option>`;
    }).join('');
  }
  if (loginItAdminOrgSelect) {
    loginItAdminOrgSelect.innerHTML = ORGANIZATIONS.map(o =>
      `<option value="${esc(o.orgId)}" ${o.orgId === SELECTED_PORTAL_ORG_ID ? 'selected' : ''}>${esc(o.name)} (${esc(o.siteCode)})</option>`
    ).join('');
  }
  syncLoginItAdminVisibility();
}

function syncLoginItAdminVisibility() {
  const selectedUser = USERS_DB.find(u => u.id === loginAccountSelect?.value);
  if (itAdminOrgPickerGroup) {
    itAdminOrgPickerGroup.style.display = selectedUser && selectedUser.role === 'it_admin' ? 'block' : 'none';
  }
}

function openAuthPortalModal(initialTab = 'LOGIN') {
  populateAuthPortalDropdowns();
  switchAuthTab(initialTab);
  authPortalOverlay.classList.add('open');
  authPortalOverlay.setAttribute('aria-hidden', 'false');
}

function closeAuthPortalModal() {
  authPortalOverlay.classList.remove('open');
  authPortalOverlay.setAttribute('aria-hidden', 'true');
}

document.getElementById('openAuthPortalBtn')?.addEventListener('click', () => openAuthPortalModal('LOGIN'));
document.getElementById('openRegisterOrgFromDirBtn')?.addEventListener('click', () => openAuthPortalModal('REGISTER_ORG'));
document.getElementById('closeAuthPortalBtn')?.addEventListener('click', closeAuthPortalModal);
authPortalOverlay?.addEventListener('click', (e) => { if (e.target === authPortalOverlay) closeAuthPortalModal(); });
loginAccountSelect?.addEventListener('change', syncLoginItAdminVisibility);

authPortalOverlay?.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-auth-tab]');
  if (tabBtn) switchAuthTab(tabBtn.dataset.authTab);
});

document.getElementById('portalLoginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = USERS_DB.find(u => u.id === loginAccountSelect.value);
  if (!user) return;
  ACTIVE_USER = user;

  if (user.role === 'it_admin') {
    SELECTED_PORTAL_ORG_ID = loginItAdminOrgSelect.value || ORGANIZATIONS[0].orgId;
  } else {
    SELECTED_PORTAL_ORG_ID = user.primaryOrgId || (user.memberships[0] && user.memberships[0].orgId) || '';
  }

  closeAuthPortalModal();
  switchTab('library');
  syncSessionUI();
  showToast(`Signed in as ${ACTIVE_USER.fullName} (${ACTIVE_USER.role.replace('_', ' ').toUpperCase()}).`);
});

document.getElementById('portalSignupForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fullName = document.getElementById('signupFullName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const username = document.getElementById('signupUsername').value.trim();

  if (USERS_DB.some(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase())) {
    showToast('An account with that email or username already exists.');
    return;
  }

  const newMember = {
    id: 'EMP-' + (1001 + USERS_DB.length),
    fullName,
    username,
    email,
    role: 'member',
    primaryOrgId: '',
    memberships: []
  };
  USERS_DB.push(newMember);
  ACTIVE_USER = newMember;
  SELECTED_PORTAL_ORG_ID = '';

  e.target.reset();
  closeAuthPortalModal();
  syncSessionUI();
  switchTab('applylib');
  showToast(`Account created for ${fullName} (Member). Apply to a Public library or enter a Private access code.`);
});

document.getElementById('portalRegisterOrgForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const orgName = document.getElementById('orgNameInput').value.trim();
  const siteCode = document.getElementById('orgSiteCodeInput').value.trim().toUpperCase();
  const visibility = document.getElementById('orgVisibilitySelect').value;
  const inviteCode = document.getElementById('orgInviteCodeInput').value.trim() || `PRIV-${siteCode}-2026`;

  const adminName = document.getElementById('libAdminNameInput').value.trim();
  const adminEmail = document.getElementById('libAdminEmailInput').value.trim();
  const adminUsername = document.getElementById('libAdminUsernameInput').value.trim();

  const newOrgId = 'ORG-' + siteCode.replace(/[^A-Z0-9]/g, '').slice(0, 6) + '-' + (ORGANIZATIONS.length + 1);
  const newAdminId = 'EMP-' + (1001 + USERS_DB.length);

  const newLibAdmin = {
    id: newAdminId,
    fullName: adminName,
    username: adminUsername,
    email: adminEmail,
    role: 'library_admin',
    primaryOrgId: newOrgId,
    memberships: [{ orgId: newOrgId, status: 'Active' }]
  };

  ORGANIZATIONS.push({
    orgId: newOrgId,
    name: orgName,
    siteCode,
    visibility,
    inviteCode: visibility === 'private' ? inviteCode : '',
    libAdminId: newAdminId
  });

  USERS_DB.push(newLibAdmin);
  ACTIVE_USER = newLibAdmin;
  SELECTED_PORTAL_ORG_ID = newOrgId;

  e.target.reset();
  closeAuthPortalModal();
  switchTab('library');
  syncSessionUI();
  showToast(`Registered "${orgName}" (${visibility.toUpperCase()}) and signed in as Library Admin ${adminName}.`);
});

// Add Book Modal
const newBookOverlay = document.getElementById('newBookOverlay');
const bookTargetOrgSelect = document.getElementById('bookTargetOrgSelect');
const bookTitleInput = document.getElementById('bookTitle');
const bookDuplicateWarning = document.getElementById('bookDuplicateWarning');
const saveBookBtn = document.getElementById('saveBookBtn');

function normalizeTitle(str) {
  return String(str || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function findDuplicateBook(title, orgId) {
  const norm = normalizeTitle(title);
  if (!norm) return null;
  return BOOKS.find(b => b.orgId === orgId && normalizeTitle(b.title) === norm) || null;
}

function checkDuplicateBookTitle() {
  if (!bookTitleInput || !bookDuplicateWarning || !saveBookBtn) return null;
  const targetOrg = bookTargetOrgSelect ? bookTargetOrgSelect.value : SELECTED_PORTAL_ORG_ID;
  const dup = findDuplicateBook(bookTitleInput.value, targetOrg);

  if (dup) {
    bookDuplicateWarning.style.display = 'block';
    bookDuplicateWarning.innerHTML = `"${esc(dup.title)}" already exists in ${esc(getOrgName(targetOrg))} (${esc(dup.id)}). Use <strong>Manage</strong> on that book to add more copies.`;
    bookTitleInput.style.borderColor = '#dc3545';
    saveBookBtn.disabled = true;
  } else {
    bookDuplicateWarning.style.display = 'none';
    bookDuplicateWarning.innerHTML = '';
    bookTitleInput.style.borderColor = '';
    saveBookBtn.disabled = false;
  }
  return dup;
}

function openNewBookModal() {
  if (!isStaffCirculator()) {
    showToast('Only IT Admins or Library Admins can add books.');
    return;
  }
  document.getElementById('newBookForm')?.reset();
  const allowedOrgs = isItAdmin() ? ORGANIZATIONS : ORGANIZATIONS.filter(o => o.orgId === ACTIVE_USER.primaryOrgId);
  if (bookTargetOrgSelect) {
    bookTargetOrgSelect.innerHTML = allowedOrgs.map(o => `<option value="${esc(o.orgId)}" ${o.orgId === SELECTED_PORTAL_ORG_ID ? 'selected' : ''}>${esc(o.name)}</option>`).join('');
  }
  checkDuplicateBookTitle();
  newBookOverlay.classList.add('open');
  newBookOverlay.setAttribute('aria-hidden', 'false');
}

function closeNewBookModal() {
  newBookOverlay.classList.remove('open');
  newBookOverlay.setAttribute('aria-hidden', 'true');
}

bookTitleInput?.addEventListener('input', checkDuplicateBookTitle);
bookTargetOrgSelect?.addEventListener('change', checkDuplicateBookTitle);
document.getElementById('openNewBookBtn').addEventListener('click', openNewBookModal);
document.getElementById('closeNewBookBtn').addEventListener('click', closeNewBookModal);
newBookOverlay.addEventListener('click', (e) => { if (e.target === newBookOverlay) closeNewBookModal(); });

document.getElementById('newBookForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const targetOrg = bookTargetOrgSelect.value;
  const dup = checkDuplicateBookTitle();
  if (dup) return;

  const nextNum = 101 + BOOKS.length;
  const copies = Math.max(1, Number(document.getElementById('bookCopies').value) || 1);
  const newId = `BK-${nextNum}`;

  BOOKS.unshift({
    id: newId,
    orgId: targetOrg,
    isbn: document.getElementById('bookIsbn').value.trim(),
    title: bookTitleInput.value.trim(),
    author: document.getElementById('bookAuthor').value.trim(),
    category: bookCategorySelect.value,
    shelf: document.getElementById('bookShelf').value.trim(),
    total: copies,
    available: copies,
    activeLoans: [],
    reservations: [],
    incidents: []
  });

  e.target.reset();
  closeNewBookModal();
  renderTable();
  showToast(`Added ${newId} to ${getOrgName(targetOrg)}.`);
});

// Combined Loan Appeal & Missing/Destroyed Report Modal
const extensionModalOverlay = document.getElementById('extensionModalOverlay');
const extensionModalBody = document.getElementById('extensionModalBody');

function applyApprovedIncident(book, loan, inc) {
  const affectedQty = Math.min(inc.qty || 1, loan.qty || 1);
  book.incidents = book.incidents || [];
  book.incidents.push({
    incId: 'INC-' + Math.floor(200 + Math.random() * 700),
    type: inc.type,
    qty: affectedQty,
    reportedBy: `${loan.borrowerName} (${loan.borrowerId})`,
    reportedAt: new Date().toISOString().slice(0, 10),
    reason: inc.reason || ''
  });

  book.total = Math.max(0, book.total - affectedQty);
  loan.qty = (loan.qty || 1) - affectedQty;
  loan.incident = null;

  if (loan.qty <= 0) {
    const idx = book.activeLoans.findIndex(item => item.loanId === loan.loanId);
    if (idx !== -1) book.activeLoans.splice(idx, 1);
  }
}

function openExtensionModal(bookId, loanId, initialTab = null) {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book) return;
  const loan = book.activeLoans.find(l => l.loanId === loanId);
  if (!loan) return;

  activeExtContext = { bookId, loanId };
  if (initialTab) loanModalTab = initialTab;

  const ext = loan.extension;
  const inc = loan.incident;
  const staffCanReview = canManageOrg(book.orgId);
  const maxLoanQty = loan.qty || 1;

  const appealTabHtml = `
    ${ext ? `<div class="ext-summary-box">
      <div><strong>Latest Appeal Status:</strong> <span class="due-tag ${ext.status === 'Denied' ? 'overdue' : ext.status === 'Approved' ? '' : 'reserved'}">${esc(ext.status)}</span></div>
      <div class="loan-item-meta">Requested New Due Date: <strong>${esc(ext.requestedDueDate)}</strong> &bull; Reason: ${esc(ext.reason || 'None')}</div>
      ${ext.status === 'Denied' ? `<div style="color:#dc3545; font-size:0.78rem; margin-top:4px;"><strong>Library Note:</strong> ${esc(ext.denyReason || 'No reason given')}</div>` : ''}
    </div>` : ''}

    <form id="submitExtensionForm">
      <div class="form-field">
        <label for="extNewDueDate">Requested New Due Date</label>
        <input type="date" id="extNewDueDate" class="modal-input" value="${esc(ext && ext.status === 'Pending' ? ext.requestedDueDate : defaultDueISO(7))}" required>
      </div>
      <div class="form-field">
        <label for="extReasonInput">Reason for Extension Appeal</label>
        <input type="text" id="extReasonInput" class="modal-input" value="${esc(ext && ext.status === 'Pending' ? ext.reason : '')}" placeholder="e.g. Ongoing project / training review" required>
      </div>
      <button type="submit" class="btn-submit-modal">SUBMIT EXTENSION APPEAL</button>
    </form>

    ${(staffCanReview && ext && ext.status === 'Pending') ? `
      <div class="ext-review-panel">
        <div class="section-heading">LIBRARY ADMIN EXTENSION REVIEW</div>
        <div class="form-field">
          <label for="extDenyReasonInput">Optional Reason if Denying</label>
          <input type="text" id="extDenyReasonInput" class="modal-input" placeholder="e.g. Reserved by another member">
        </div>
        <div class="ext-review-actions">
          <button type="button" class="btn-approve-ext" id="approveExtBtn">Approve Extension</button>
          <button type="button" class="btn-deny-ext" id="denyExtBtn">Deny Extension</button>
        </div>
      </div>
    ` : ''}
  `;

  const reportTabHtml = `
    ${inc ? `<div class="ext-summary-box" style="border-color:#fca5a5; background:#fff5f5;">
      <div><strong>Incident Report Status:</strong> <span class="due-tag overdue">${esc(inc.status)}</span> (${esc(inc.type)} &bull; ${inc.qty} ${inc.qty === 1 ? 'copy' : 'copies'})</div>
      <div class="loan-item-meta">Details: ${esc(inc.reason || 'None')}</div>
    </div>` : ''}

    <form id="submitIncidentForm">
      <div class="form-row-2">
        <div class="form-field">
          <label for="incTypeSelect">Incident Type</label>
          <select id="incTypeSelect" class="modal-select" required>
            <option value="Missing" ${inc && inc.type === 'Missing' ? 'selected' : ''}>Missing / Lost</option>
            <option value="Destroyed" ${inc && inc.type === 'Destroyed' ? 'selected' : ''}>Destroyed / Damaged Beyond Use</option>
          </select>
        </div>
        <div class="form-field">
          <label for="incQtyInput">Copies Affected (Max ${maxLoanQty})</label>
          <input type="number" id="incQtyInput" class="modal-input" min="1" max="${maxLoanQty}" value="${inc ? Math.min(inc.qty, maxLoanQty) : 1}" required>
        </div>
      </div>
      <div class="form-field">
        <label for="incReasonInput">What Happened?</label>
        <input type="text" id="incReasonInput" class="modal-input" value="${esc(inc ? inc.reason : '')}" placeholder="e.g. Water damage / misplaced at site" required>
      </div>
      <button type="submit" class="btn-submit-modal" style="background:#dc3545;">SUBMIT MISSING / DESTROYED REPORT</button>
    </form>

    ${(staffCanReview && inc && inc.status === 'Pending') ? `
      <div class="ext-review-panel">
        <div class="section-heading">LIBRARY ADMIN INCIDENT APPROVAL</div>
        <div class="form-field">
          <label for="incDenyReasonInput">Optional Note if Rejecting Report</label>
          <input type="text" id="incDenyReasonInput" class="modal-input" placeholder="e.g. Copy found at front desk">
        </div>
        <div class="ext-review-actions">
          <button type="button" class="btn-approve-ext" id="approveIncBtn">Accept &amp; Tag ${esc(inc.type)}</button>
          <button type="button" class="btn-deny-ext" id="denyIncBtn">Reject Report</button>
        </div>
      </div>
    ` : ''}
  `;

  extensionModalBody.innerHTML = `
    <div class="ext-summary-box">
      <div><strong>Book:</strong> ${esc(book.title)} (${esc(loan.assetCode)})</div>
      <div class="loan-item-meta">Library: <strong>${esc(getOrgName(book.orgId))}</strong> &bull; Borrower: <strong>${esc(loan.borrowerName)}</strong> &bull; Due: <strong>${esc(loan.dueDate)}</strong></div>
    </div>

    <div class="manage-tabs">
      <button type="button" class="manage-tab-btn ${loanModalTab === 'APPEAL' ? 'active' : ''}" data-loan-modal-tab="APPEAL">Appeal Extension</button>
      <button type="button" class="manage-tab-btn ${loanModalTab === 'REPORT' ? 'active' : ''}" data-loan-modal-tab="REPORT">Report Missing / Destroyed</button>
    </div>

    ${loanModalTab === 'APPEAL' ? appealTabHtml : reportTabHtml}
  `;

  extensionModalOverlay.classList.add('open');
  extensionModalOverlay.setAttribute('aria-hidden', 'false');
}

function closeExtensionModal() {
  if (!extensionModalOverlay) return;
  extensionModalOverlay.classList.remove('open');
  extensionModalOverlay.setAttribute('aria-hidden', 'true');
  activeExtContext = null;
}

document.getElementById('closeExtensionBtn')?.addEventListener('click', closeExtensionModal);
extensionModalOverlay?.addEventListener('click', (e) => { if (e.target === extensionModalOverlay) closeExtensionModal(); });

extensionModalBody?.addEventListener('submit', (e) => {
  if (!activeExtContext) return;
  const book = BOOKS.find(b => b.id === activeExtContext.bookId);
  const loan = book && book.activeLoans.find(l => l.loanId === activeExtContext.loanId);
  if (!loan) return;

  if (e.target.id === 'submitExtensionForm') {
    e.preventDefault();
    const newDue = document.getElementById('extNewDueDate').value;
    const reason = document.getElementById('extReasonInput').value.trim();

    loan.extension = { requestedDueDate: newDue, reason, status: 'Pending', denyReason: '' };
    renderTable();
    renderMyLoansView();
    openExtensionModal(book.id, loan.loanId, 'APPEAL');
    showToast(`Extension appeal submitted for "${book.title}".`);
  } else if (e.target.id === 'submitIncidentForm') {
    e.preventDefault();
    const type = document.getElementById('incTypeSelect').value;
    const qty = Math.max(1, Math.min(loan.qty || 1, Number(document.getElementById('incQtyInput').value) || 1));
    const reason = document.getElementById('incReasonInput').value.trim();

    loan.incident = { type, qty, reason, status: 'Pending', denyReason: '' };
    renderTable();
    renderMyLoansView();
    openExtensionModal(book.id, loan.loanId, 'REPORT');
    showToast(`Submitted ${type.toLowerCase()} report for "${book.title}".`);
  }
});

extensionModalBody?.addEventListener('click', (e) => {
  if (!activeExtContext) return;
  const book = BOOKS.find(b => b.id === activeExtContext.bookId);
  const loan = book && book.activeLoans.find(l => l.loanId === activeExtContext.loanId);
  if (!loan) return;

  const tabBtn = e.target.closest('[data-loan-modal-tab]');
  if (tabBtn) {
    openExtensionModal(book.id, loan.loanId, tabBtn.dataset.loanModalTab);
    return;
  }

  if (!canManageOrg(book.orgId)) return;

  if (e.target.id === 'approveExtBtn' && loan.extension) {
    loan.dueDate = loan.extension.requestedDueDate;
    loan.overdue = false;
    loan.extension.status = 'Approved';
    loan.extension.denyReason = '';
    renderTable();
    renderMyLoansView();
    openExtensionModal(book.id, loan.loanId, 'APPEAL');
    showToast(`Extension approved — due date updated to ${loan.dueDate}.`);
  } else if (e.target.id === 'denyExtBtn' && loan.extension) {
    const reasonEl = document.getElementById('extDenyReasonInput');
    loan.extension.status = 'Denied';
    loan.extension.denyReason = (reasonEl ? reasonEl.value.trim() : '') || '';
    renderTable();
    renderMyLoansView();
    openExtensionModal(book.id, loan.loanId, 'APPEAL');
    showToast(`Extension appeal denied.`);
  } else if (e.target.id === 'approveIncBtn' && loan.incident) {
    const incCopy = { ...loan.incident };
    applyApprovedIncident(book, loan, incCopy);
    closeExtensionModal();
    renderTable();
    renderMyLoansView();
    showToast(`Accepted report: ${incCopy.qty} ${incCopy.qty === 1 ? 'copy' : 'copies'} tagged as ${incCopy.type}.`);
  } else if (e.target.id === 'denyIncBtn' && loan.incident) {
    const reasonEl = document.getElementById('incDenyReasonInput');
    loan.incident.status = 'Denied';
    loan.incident.denyReason = (reasonEl ? reasonEl.value.trim() : '') || '';
    renderTable();
    renderMyLoansView();
    openExtensionModal(book.id, loan.loanId, 'REPORT');
    showToast(`Rejected incident report.`);
  }
});

document.getElementById('myloansView')?.addEventListener('click', (e) => {
  const kpiCard = e.target.closest('[data-my-kpi]');
  if (kpiCard) {
    myRecordsFilter = kpiCard.dataset.myKpi;
    renderMyLoansView();
    return;
  }

  const extBtn = e.target.closest('[data-open-ext-book]');
  if (extBtn) {
    openExtensionModal(extBtn.dataset.openExtBook, extBtn.dataset.openExtLoan, 'APPEAL');
    return;
  }

  const cancelBtn = e.target.closest('[data-cancel-res-book]');
  if (cancelBtn) {
    const book = BOOKS.find(b => b.id === cancelBtn.dataset.cancelResBook);
    if (!book) return;
    const idx = book.reservations.findIndex(r => r.resId === cancelBtn.dataset.cancelResId);
    if (idx !== -1) {
      book.reservations.splice(idx, 1);
      renderTable();
      renderMyLoansView();
      showToast(`Cancelled reservation for "${book.title}".`);
    }
  }
});

// Manage Book Modal (Scoped to Organization Members & Staff)
const bookDetailsOverlay = document.getElementById('bookDetailsOverlay');
const bookDetailsBody = document.getElementById('bookDetailsBody');

function openBookDetails(bookId) {
  const b = BOOKS.find(item => item.id === bookId);
  if (!b) return;
  activeBookId = bookId;

  const staffCanCirculate = canManageOrg(b.orgId);
  const checkedOutCount = b.activeLoans.reduce((sum, l) => sum + (l.qty || 1), 0);
  const incidentTotal = getIncidentCount(b);
  const canDeleteBook = checkedOutCount === 0;

  // Only list members actively enrolled in this book's organization
  const orgMembers = USERS_DB.filter(u =>
    u.role === 'it_admin' || u.memberships.some(m => m.orgId === b.orgId && m.status === 'Active')
  );
  const memberOptionsHtml = orgMembers.map(m =>
    `<option value="${esc(m.id)}">${esc(m.fullName)} (${esc(m.id)})</option>`
  ).join('');

  let actionFormHtml = '';
  if (!staffCanCirculate) {
    actionFormHtml = `<div class="meta-box" style="color:#686270; font-size:0.83rem;">You are viewing <strong>${esc(getOrgName(b.orgId))}</strong> as a Member. Use <strong>My Loans &amp; Reserve</strong> to borrow or reserve available copies.</div>`;
  } else if (manageActionMode === 'ISSUE') {
    actionFormHtml = `
      <div class="circ-form-grid" style="grid-template-columns: 1.5fr 0.7fr 1fr auto;">
        <div class="field-group">
          <label for="manageEmpSelect">Issue Copy To (Org Member)</label>
          <select id="manageEmpSelect" class="ctrl">${memberOptionsHtml}</select>
        </div>
        <div class="field-group">
          <label for="manageIssueQty">Copies</label>
          <input type="number" id="manageIssueQty" class="ctrl" min="1" max="${Math.max(1, b.available)}" value="1">
        </div>
        <div class="field-group">
          <label for="manageDueDate">Due Date</label>
          <input type="date" id="manageDueDate" class="ctrl" value="${defaultDueISO(14)}">
        </div>
        <button type="button" class="btn-issue" style="height:40px;" id="confirmIssueBtn" ${b.available <= 0 ? 'disabled' : ''}>Issue</button>
      </div>
    `;
  } else if (manageActionMode === 'RESERVE') {
    actionFormHtml = `
      <div class="circ-form-grid" style="grid-template-columns: 1.5fr 0.7fr 1fr auto;">
        <div class="field-group">
          <label for="manageResEmpSelect">Reserve Title For</label>
          <select id="manageResEmpSelect" class="ctrl">${memberOptionsHtml}</select>
        </div>
        <div class="field-group">
          <label for="manageResQty">Copies</label>
          <input type="number" id="manageResQty" class="ctrl" min="1" max="${Math.max(1, b.total)}" value="1">
        </div>
        <div class="field-group">
          <label for="managePickupDate">Pickup Date</label>
          <input type="date" id="managePickupDate" class="ctrl" value="${defaultDueISO(3)}">
        </div>
        <button type="button" class="btn-reserve" id="confirmReserveBtn">Reserve</button>
      </div>
    `;
  } else if (manageActionMode === 'STOCK') {
    const confirmBoxHtml = pendingStockConfirm
      ? `<div style="margin-top:12px; padding:12px 14px; border-radius:9px; background:#fff8eb; border:1px solid #f59e0b; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px;">
          <div style="font-size:0.84rem; color:#78350f;">
            Are you sure you want to <strong>${pendingStockConfirm.action === 'ADD' ? 'add' : 'remove'} ${pendingStockConfirm.amount} ${pendingStockConfirm.amount === 1 ? 'copy' : 'copies'}</strong>
            ${pendingStockConfirm.action === 'ADD' ? 'to' : 'from'} <strong>"${esc(b.title)}"</strong>?
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-reset" style="height:34px; padding:0 12px;" id="cancelStockConfirmBtn">Cancel</button>
            <button type="button" class="${pendingStockConfirm.action === 'ADD' ? 'btn-issue' : 'btn-return'}" style="height:34px; padding:0 14px;" id="executeStockConfirmBtn">
              Yes, ${pendingStockConfirm.action === 'ADD' ? 'Add' : 'Remove'} ${pendingStockConfirm.amount}
            </button>
          </div>
        </div>`
      : '';

    const incidentsRestoreHtml = (b.incidents || []).length
      ? `<div style="margin-top:14px; padding-top:12px; border-top:1px dashed #d8ccd3;">
          <div class="section-heading">DESTROYED / MISSING COPIES (${incidentTotal}) &mdash; RESTORE OR REPLACE</div>
          ${b.incidents.map((inc, idx) => `
            <div class="borrower-pill-row" style="align-items:center;">
              <div>
                <span class="due-tag overdue">${esc(inc.type.toUpperCase())}</span>
                <strong>${inc.qty} ${inc.qty === 1 ? 'copy' : 'copies'}</strong> &bull; ${esc(inc.reportedBy)} (${esc(inc.reportedAt)})
                ${inc.reason ? `<div class="loan-item-meta">${esc(inc.reason)}</div>` : ''}
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <input type="number" class="ctrl" style="width:68px; height:32px; text-align:center;" min="1" max="${inc.qty}" value="1" data-restore-qty-idx="${idx}">
                <button type="button" class="btn-issue" style="height:32px; padding:0 11px; font-size:0.76rem;" data-restore-inc-idx="${idx}">Restore Copy</button>
              </div>
            </div>
          `).join('')}
        </div>`
      : '';

    const deleteConfirmHtml = pendingDeleteBookConfirm
      ? `<div style="margin-top:10px; padding:12px 14px; border-radius:9px; background:#fff1f2; border:1px solid #f43f5e; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px;">
          <div style="font-size:0.84rem; color:#9f1239;">
            Are you sure you want to permanently delete <strong>"${esc(b.title)}"</strong> (${esc(b.id)})?
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-reset" style="height:34px; padding:0 12px;" id="cancelDeleteBookBtn">Cancel</button>
            <button type="button" class="btn-return" style="height:34px; padding:0 14px;" id="confirmDeleteBookBtn">Yes, Delete Book</button>
          </div>
        </div>`
      : '';

    actionFormHtml = `
      <div class="meta-box">
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">
          <div>
            <div class="meta-lbl">Quick Single-Copy Adjustment</div>
            <div style="font-size:0.84rem; color:#2b2730; margin-top:2px;">
              Available on Shelf: <strong>${b.available}</strong> &bull; Active Total: <strong>${b.total}</strong> &bull; Checked Out: <strong>${checkedOutCount}</strong>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn-return" style="height:36px; padding:0 14px;" id="quickMinusOneBtn" ${b.available <= 0 ? 'disabled' : ''}>&minus; 1</button>
            <button type="button" class="btn-issue" style="height:36px; padding:0 14px;" id="quickPlusOneBtn">+ 1</button>
          </div>
        </div>

        <form id="stockBatchForm" style="margin-top:14px; padding-top:12px; border-top:1px dashed #d8ccd3; display:flex; flex-wrap:wrap; align-items:flex-end; gap:10px;">
          <div class="field-group" style="flex:1; min-width:160px;">
            <label for="stockAdjustAmount">Or Type Custom Amount (Press Enter to Add)</label>
            <input type="number" id="stockAdjustAmount" class="ctrl" style="height:38px;" min="1" max="500" placeholder="e.g. 20" value="${pendingStockConfirm ? pendingStockConfirm.amount : ''}" required>
          </div>
          <button type="submit" class="btn-issue" style="height:38px; padding:0 14px;" id="askAddBatchBtn">Add Amount</button>
          <button type="button" class="btn-return" style="height:38px; padding:0 14px;" id="askRemoveBatchBtn" ${b.available <= 0 ? 'disabled' : ''}>Remove Amount</button>
        </form>

        ${confirmBoxHtml}

        <div style="margin-top:14px; padding-top:12px; border-top:1px dashed #d8ccd3; display:flex; flex-wrap:wrap; align-items:flex-end; gap:8px;">
          <div class="field-group" style="min-width:130px;">
            <label for="staffIncType">Tag Shelf Copy As</label>
            <select id="staffIncType" class="ctrl" style="height:36px;">
              <option value="Destroyed">Destroyed</option>
              <option value="Missing">Missing</option>
            </select>
          </div>
          <div class="field-group" style="width:76px;">
            <label for="staffIncQty">Qty</label>
            <input type="number" id="staffIncQty" class="ctrl" style="height:36px;" min="1" max="${Math.max(1, b.available)}" value="1">
          </div>
          <div class="field-group" style="flex:1; min-width:150px;">
            <label for="staffIncReason">Reason / Note</label>
            <input type="text" id="staffIncReason" class="ctrl" style="height:36px;" placeholder="e.g. Damaged on shelf">
          </div>
          <button type="button" class="btn-return" style="height:36px; padding:0 12px;" id="staffLogIncidentBtn" ${b.available <= 0 ? 'disabled' : ''}>Tag Incident</button>
        </div>

        ${incidentsRestoreHtml}

        <div style="margin-top:16px; padding-top:12px; border-top:1px solid #e7dfe4; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px;">
          <div style="font-size:0.79rem; color:#686270;">
            ${canDeleteBook
              ? 'All copies are accounted for. You may delete this book entry.'
              : `Cannot delete while <strong>${checkedOutCount} ${checkedOutCount === 1 ? 'copy is' : 'copies are'}</strong> still checked out.`}
          </div>
          <button type="button" class="btn-return" style="height:36px; padding:0 14px;" id="askDeleteBookBtn" ${canDeleteBook ? '' : 'disabled'}>Delete Book Entry</button>
        </div>
        ${deleteConfirmHtml}
      </div>
    `;
  } else {
    actionFormHtml = b.activeLoans.length
      ? `<div>
          ${b.activeLoans.map(l => `
            <div class="borrower-pill-row">
              <div>
                <strong>${esc(l.borrowerName)}</strong> (${esc(l.borrowerId)}) &bull; Qty: <strong>${l.qty || 1}</strong> &bull; Asset: <strong>${esc(l.assetCode)}</strong>
                <div class="loan-item-meta">Borrowed: ${esc(l.borrowedAt)} &bull; Due: <strong>${esc(l.dueDate)}</strong></div>
              </div>
              <button type="button" class="btn-return" data-return-loan-id="${esc(l.loanId)}">Mark Returned</button>
            </div>
          `).join('')}
        </div>`
      : `<div class="meta-box" style="color:#686270; font-size:0.83rem;">All copies are currently on the shelf.</div>`;
  }

  const activeLoansListHtml = b.activeLoans.length
    ? b.activeLoans.map(l => {
        const extBadge = (staffCanCirculate && l.extension && l.extension.status === 'Pending')
          ? `<button type="button" class="action-btn" data-review-ext-loan="${esc(l.loanId)}" data-review-tab="APPEAL">Review Extension</button>`
          : '';
        const incBadge = (staffCanCirculate && l.incident && l.incident.status === 'Pending')
          ? `<button type="button" class="btn-return" style="height:30px; padding:0 10px; font-size:0.75rem;" data-review-ext-loan="${esc(l.loanId)}" data-review-tab="REPORT">Review ${esc(l.incident.type)} Report</button>`
          : '';
        const statusTag = (!extBadge && !incBadge)
          ? `<span class="due-tag ${l.overdue ? 'overdue' : ''}">${l.overdue ? 'OVERDUE' : 'ACTIVE'}</span>`
          : '';

        return `
          <div class="borrower-pill-row">
            <div>
              <strong>${esc(l.borrowerName)}</strong> (${esc(l.borrowerId)}) &bull; <strong>${l.qty || 1} ${(l.qty || 1) === 1 ? 'copy' : 'copies'}</strong> &mdash; <span style="color:#686270;">${esc(l.assetCode)}</span>
              <div class="loan-item-meta">Borrowed: ${esc(l.borrowedAt)} &bull; Due Date: <strong>${esc(l.dueDate)}</strong></div>
              ${l.extension ? `<div class="loan-item-meta">Extension: <strong>${esc(l.extension.status)}</strong> (New due: ${esc(l.extension.requestedDueDate)})</div>` : ''}
              ${l.incident ? `<div class="loan-item-meta" style="color:#dc3545;">Reported ${esc(l.incident.type)} (&times;${l.incident.qty}): <strong>${esc(l.incident.status)}</strong></div>` : ''}
            </div>
            <div style="display:flex; gap:6px; align-items:center;">${extBadge}${incBadge}${statusTag}</div>
          </div>
        `;
      }).join('')
    : `<div style="font-size:0.82rem; color:#686270;">No copies currently checked out.</div>`;

  const reservationsListHtml = b.reservations.length
    ? b.reservations.map(r => {
        const isPending = r.status === 'Pending';
        const staffControls = (staffCanCirculate && isPending)
          ? `
            <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-top:8px;">
              <button type="button" class="action-btn" data-approve-res-id="${esc(r.resId)}" ${b.available < (r.qty || 1) ? 'disabled' : ''}>Approve</button>
              <input type="text" class="ctrl" style="height:32px; width:210px; font-size:0.78rem;" data-decline-reason-input="${esc(r.resId)}" placeholder="Decline reason (optional)">
              <button type="button" class="btn-return" style="height:32px; padding:0 11px; font-size:0.76rem;" data-decline-res-id="${esc(r.resId)}">Decline</button>
            </div>
          `
          : '';

        return `
          <div class="borrower-pill-row" style="align-items:flex-start;">
            <div style="flex:1;">
              <strong>${esc(r.userName)}</strong> (${esc(r.userId)}) &bull; <strong>${r.qty || 1} ${(r.qty || 1) === 1 ? 'copy' : 'copies'}</strong>
              <div class="loan-item-meta">Requested: ${esc(r.reservedAt)} &bull; Pickup Date: <strong>${esc(r.pickupDate)}</strong></div>
              ${r.declineReason ? `<div style="color:#dc3545; font-size:0.76rem; margin-top:4px;"><strong>Reason:</strong> ${esc(r.declineReason)}</div>` : ''}
              ${staffControls}
            </div>
            <span class="due-tag ${r.status === 'Declined' ? 'overdue' : 'reserved'}">${esc(r.status)}</span>
          </div>
        `;
      }).join('')
    : `<div style="font-size:0.82rem; color:#686270;">No reservations on this title.</div>`;

  const bottomSectionsHtml = manageActionMode === 'STOCK'
    ? ''
    : `
      <div style="margin-top:16px;">
        <div class="section-heading">CURRENT BORROWERS &amp; DUE DATES (${b.activeLoans.length})</div>
        ${activeLoansListHtml}
      </div>

      <div style="margin-top:14px;">
        <div class="section-heading">RESERVATION REQUESTS &amp; APPROVALS (${b.reservations.length})</div>
        ${reservationsListHtml}
      </div>
    `;

  bookDetailsBody.innerHTML = `
    <div class="detail-grid">
      <div class="meta-box"><div class="meta-lbl">Book ID &amp; Library</div><div class="meta-val">${esc(b.id)} &bull; ${esc(getOrgName(b.orgId))}</div></div>
      <div class="meta-box"><div class="meta-lbl">ISBN / Code</div><div class="meta-val">${esc(b.isbn)}</div></div>
      <div class="meta-box"><div class="meta-lbl">Active Stock</div><div class="meta-val">${b.available} of ${b.total} Available${incidentTotal ? ` <span style="color:#dc3545; font-size:0.78rem;">(${incidentTotal} Destroyed/Missing)</span>` : ''}</div></div>
    </div>

    <div class="meta-box" style="margin-bottom:12px;">
      <div class="meta-lbl">Title, Author &amp; Shelf</div>
      <div class="meta-val">${esc(b.title)} &mdash; <span style="font-weight:500; color:#686270;">${esc(b.author)} &bull; ${esc(b.shelf)}</span></div>
    </div>

    ${staffCanCirculate ? `
      <div class="manage-tabs">
        <button type="button" class="manage-tab-btn ${manageActionMode === 'ISSUE' ? 'active' : ''}" data-manage-mode="ISSUE">Issue Copy</button>
        <button type="button" class="manage-tab-btn ${manageActionMode === 'RESERVE' ? 'active' : ''}" data-manage-mode="RESERVE">Reserve Title</button>
        <button type="button" class="manage-tab-btn ${manageActionMode === 'RETURN' ? 'active' : ''}" data-manage-mode="RETURN">Mark Returned (${b.activeLoans.length})</button>
        <button type="button" class="manage-tab-btn ${manageActionMode === 'STOCK' ? 'active' : ''}" data-manage-mode="STOCK">Adjust Copies</button>
      </div>
    ` : ''}

    ${actionFormHtml}
    ${bottomSectionsHtml}
  `;

  bookDetailsOverlay.classList.add('open');
  bookDetailsOverlay.setAttribute('aria-hidden', 'false');
}

function closeBookDetails() {
  bookDetailsOverlay.classList.remove('open');
  bookDetailsOverlay.setAttribute('aria-hidden', 'true');
  activeBookId = null;
  pendingStockConfirm = null;
  pendingDeleteBookConfirm = false;
}

bookBody.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-book-id]');
  if (btn) {
    manageActionMode = 'ISSUE';
    pendingStockConfirm = null;
    pendingDeleteBookConfirm = false;
    openBookDetails(btn.dataset.bookId);
  }
});

bookDetailsBody.addEventListener('submit', (e) => {
  if (e.target.id !== 'stockBatchForm') return;
  e.preventDefault();
  const b = BOOKS.find(item => item.id === activeBookId);
  if (!b || !canManageOrg(b.orgId)) return;

  const amt = Math.max(1, Number(document.getElementById('stockAdjustAmount')?.value) || 0);
  if (!amt) return;
  pendingStockConfirm = { action: 'ADD', amount: amt };
  openBookDetails(b.id);
});

bookDetailsBody.addEventListener('click', (e) => {
  const b = BOOKS.find(item => item.id === activeBookId);
  if (!b) return;

  const modeBtn = e.target.closest('[data-manage-mode]');
  if (modeBtn) {
    manageActionMode = modeBtn.dataset.manageMode;
    pendingStockConfirm = null;
    pendingDeleteBookConfirm = false;
    openBookDetails(b.id);
    return;
  }

  const reviewExtBtn = e.target.closest('[data-review-ext-loan]');
  if (reviewExtBtn) {
    const loanId = reviewExtBtn.dataset.reviewExtLoan;
    const tab = reviewExtBtn.dataset.reviewTab || 'APPEAL';
    const bookId = b.id;
    closeBookDetails();
    openExtensionModal(bookId, loanId, tab);
    return;
  }

  if (!canManageOrg(b.orgId)) return;

  if (e.target.id === 'quickPlusOneBtn') {
    pendingStockConfirm = { action: 'ADD', amount: 1 };
    openBookDetails(b.id);
    return;
  }

  if (e.target.id === 'quickMinusOneBtn') {
    if (b.available <= 0) {
      showToast('No available copies on the shelf to remove.');
      return;
    }
    pendingStockConfirm = { action: 'REMOVE', amount: 1 };
    openBookDetails(b.id);
    return;
  }

  if (e.target.id === 'askRemoveBatchBtn') {
    const amt = Math.max(1, Number(document.getElementById('stockAdjustAmount')?.value) || 0);
    if (!amt) {
      showToast('Enter how many copies to remove first.');
      return;
    }
    if (amt > b.available) {
      showToast(`Only ${b.available} available ${b.available === 1 ? 'copy' : 'copies'} on the shelf can be removed.`);
      return;
    }
    pendingStockConfirm = { action: 'REMOVE', amount: amt };
    openBookDetails(b.id);
    return;
  }

  if (e.target.id === 'cancelStockConfirmBtn') {
    pendingStockConfirm = null;
    openBookDetails(b.id);
    return;
  }

  if (e.target.id === 'executeStockConfirmBtn' && pendingStockConfirm) {
    const { action, amount } = pendingStockConfirm;
    if (action === 'ADD') {
      b.total += amount;
      b.available += amount;
      showToast(`Added ${amount} ${amount === 1 ? 'copy' : 'copies'} to "${b.title}".`);
    } else {
      const actualRemove = Math.min(amount, b.available);
      b.available -= actualRemove;
      const checkedOut = b.activeLoans.reduce((s, l) => s + (l.qty || 1), 0);
      b.total = Math.max(checkedOut, b.total - actualRemove);
      showToast(`Removed ${actualRemove} ${actualRemove === 1 ? 'copy' : 'copies'} from "${b.title}".`);
    }
    pendingStockConfirm = null;
    renderTable();
    openBookDetails(b.id);
    return;
  }

  if (e.target.id === 'staffLogIncidentBtn') {
    const type = document.getElementById('staffIncType')?.value || 'Destroyed';
    const qty = Math.max(1, Math.min(b.available, Number(document.getElementById('staffIncQty')?.value) || 1));
    const reason = document.getElementById('staffIncReason')?.value.trim() || 'Logged during library inspection';
    if (b.available <= 0) return;

    b.available -= qty;
    b.total = Math.max(0, b.total - qty);
    b.incidents = b.incidents || [];
    b.incidents.push({
      incId: 'INC-' + Math.floor(200 + Math.random() * 700),
      type,
      qty,
      reportedBy: `${ACTIVE_USER.fullName} (Staff)`,
      reportedAt: new Date().toISOString().slice(0, 10),
      reason
    });

    renderTable();
    openBookDetails(b.id);
    showToast(`Tagged ${qty} ${qty === 1 ? 'copy' : 'copies'} of "${b.title}" as ${type}.`);
    return;
  }

  const restoreBtn = e.target.closest('[data-restore-inc-idx]');
  if (restoreBtn) {
    const idx = Number(restoreBtn.dataset.restoreIncIdx);
    const inc = (b.incidents || [])[idx];
    if (!inc) return;
    const qtyInput = bookDetailsBody.querySelector(`[data-restore-qty-idx="${idx}"]`);
    const restoreQty = Math.max(1, Math.min(inc.qty, Number(qtyInput?.value) || 1));

    inc.qty -= restoreQty;
    if (inc.qty <= 0) b.incidents.splice(idx, 1);

    b.total += restoreQty;
    b.available += restoreQty;

    renderTable();
    openBookDetails(b.id);
    showToast(`Restored ${restoreQty} ${restoreQty === 1 ? 'copy' : 'copies'} back to "${b.title}".`);
    return;
  }

  if (e.target.id === 'askDeleteBookBtn') {
    const checkedOut = b.activeLoans.reduce((s, l) => s + (l.qty || 1), 0);
    if (checkedOut > 0) {
      showToast('Cannot delete book while copies are still borrowed.');
      return;
    }
    pendingDeleteBookConfirm = true;
    openBookDetails(b.id);
    return;
  }

  if (e.target.id === 'cancelDeleteBookBtn') {
    pendingDeleteBookConfirm = false;
    openBookDetails(b.id);
    return;
  }

  if (e.target.id === 'confirmDeleteBookBtn') {
    const checkedOut = b.activeLoans.reduce((s, l) => s + (l.qty || 1), 0);
    if (checkedOut > 0) return;
    const idx = BOOKS.findIndex(item => item.id === b.id);
    if (idx !== -1) {
      const removedTitle = BOOKS[idx].title;
      BOOKS.splice(idx, 1);
      closeBookDetails();
      renderTable();
      showToast(`Deleted "${removedTitle}".`);
    }
    return;
  }

  if (e.target.id === 'confirmIssueBtn' && b.available > 0) {
    const empId = document.getElementById('manageEmpSelect').value;
    const dueDate = document.getElementById('manageDueDate').value || defaultDueISO(14);
    const qty = Math.max(1, Number(document.getElementById('manageIssueQty')?.value) || 1);
    if (qty > b.available) {
      showToast(`Only ${b.available} cop${b.available === 1 ? 'y' : 'ies'} available.`);
      return;
    }
    const member = USERS_DB.find(item => item.id === empId);
    const cleanName = member ? member.fullName : empId;

    const assignedAssets = [];
    for (let i = 0; i < qty; i++) {
      assignedAssets.push(`${b.id}-CP${b.total - b.available + 1 + i}`);
    }
    b.available -= qty;
    b.activeLoans.push({
      loanId: 'LN-' + Math.floor(400 + Math.random() * 500),
      assetCode: assignedAssets.join(', '),
      qty,
      borrowerId: empId,
      borrowerName: cleanName,
      borrowedAt: new Date().toISOString().slice(0, 10),
      dueDate,
      overdue: false,
      extension: null,
      incident: null
    });

    renderTable();
    openBookDetails(b.id);
    showToast(`Issued ${qty} cop${qty === 1 ? 'y' : 'ies'} of "${b.title}" to ${cleanName}.`);
    return;
  }

  if (e.target.id === 'confirmReserveBtn') {
    const empId = document.getElementById('manageResEmpSelect').value;
    const pickupDate = document.getElementById('managePickupDate').value || defaultDueISO(3);
    const qty = Math.max(1, Math.min(b.total, Number(document.getElementById('manageResQty')?.value) || 1));
    const member = USERS_DB.find(item => item.id === empId);
    const cleanName = member ? member.fullName : empId;

    b.reservations.push({
      resId: 'RS-' + Math.floor(300 + Math.random() * 500),
      userId: empId,
      userName: cleanName,
      qty,
      reservedAt: new Date().toISOString().slice(0, 10),
      pickupDate,
      status: 'Pending',
      declineReason: ''
    });

    renderTable();
    openBookDetails(b.id);
    showToast(`Created reservation (${qty} cop${qty === 1 ? 'y' : 'ies'}) for ${cleanName}.`);
    return;
  }

  const approveBtn = e.target.closest('[data-approve-res-id]');
  if (approveBtn) {
    const res = b.reservations.find(r => r.resId === approveBtn.dataset.approveResId);
    if (res && b.available >= (res.qty || 1)) {
      res.status = 'Approved';
      res.declineReason = '';
      renderTable();
      openBookDetails(b.id);
      showToast(`Approved reservation for ${res.userName}.`);
    }
    return;
  }

  const declineBtn = e.target.closest('[data-decline-res-id]');
  if (declineBtn) {
    const resId = declineBtn.dataset.declineResId;
    const res = b.reservations.find(r => r.resId === resId);
    const reasonInput = bookDetailsBody.querySelector(`[data-decline-reason-input="${resId}"]`);
    if (res) {
      res.status = 'Declined';
      res.declineReason = (reasonInput ? reasonInput.value.trim() : '') || 'Request declined by Library Admin.';
      renderTable();
      openBookDetails(b.id);
      showToast(`Declined reservation for ${res.userName}.`);
    }
    return;
  }

  const returnBtn = e.target.closest('[data-return-loan-id]');
  if (returnBtn) {
    const idx = b.activeLoans.findIndex(l => l.loanId === returnBtn.dataset.returnLoanId);
    if (idx !== -1) {
      const [returned] = b.activeLoans.splice(idx, 1);
      b.available = Math.min(b.total, b.available + (returned.qty || 1));
      renderTable();
      openBookDetails(b.id);
      showToast(`Marked ${returned.qty || 1} cop${(returned.qty || 1) === 1 ? 'y' : 'ies'} from ${returned.borrowerName} as returned.`);
    }
  }
});

document.getElementById('closeDetailsBtn').addEventListener('click', closeBookDetails);
bookDetailsOverlay.addEventListener('click', (e) => { if (e.target === bookDetailsOverlay) closeBookDetails(); });

// Initialize Portal
syncSessionUI();