// Shared Event Admin JavaScript Module
// Handles common functionality for all individual event admin pages

import { db } from '../../assets/js/firebase-config.js';
import { collection, getDocs, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Event data from events-list.html
const EVENTS_DATA = [
  {
    id: 'coding',
    title: 'Coding (C)',
    description: 'Solve programming problems in C within the time limit.',
    maxParticipants: 2
  },
  {
    id: 'debugging',
    title: 'Debugging',
    description: 'Find and fix bugs in given code.',
    maxParticipants: 2
  },
  {
    id: 'solo-dance',
    title: 'Solo Dance',
    description: 'Showcase your dancing skills in individual performance.',
    maxParticipants: 1
  },
  {
    id: 'group-dance',
    title: 'Group Dance',
    description: 'Team dance performance with choreography.',
    maxParticipants: 8
  },
  {
    id: 'solo-singing',
    title: 'Solo Singing',
    description: 'Individual singing performance showcasing vocal talent.',
    maxParticipants: 1
  },
  {
    id: 'solo-instrumental',
    title: 'Solo Instrumental',
    description: 'Individual instrumental music performance.',
    maxParticipants: 1
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Capture the best moments and showcase photography skills.',
    maxParticipants: 1
  },
  {
    id: 'face-painting',
    title: 'Face Painting',
    description: 'Creative face painting competition with artistic designs.',
    maxParticipants: 1
  },
  {
    id: 'reels-creation',
    title: 'Reels Creation',
    description: 'Create engaging short video content and reels.',
    maxParticipants: 3
  },
  {
    id: 'general-quiz',
    title: 'General Quiz',
    description: 'Test your general knowledge in quiz competition.',
    maxParticipants: 2
  },
  {
    id: 'hindi-essay',
    title: 'Hindi Essay',
    description: 'Write compelling essays in Hindi on given topics.',
    maxParticipants: 1
  },
  {
    id: 'kannada-essay',
    title: 'Kannada Essay',
    description: 'Write compelling essays in Kannada on given topics.',
    maxParticipants: 1
  },
  {
    id: 'fireless-cooking',
    title: 'Fireless Cooking',
    description: 'Prepare delicious dishes without using fire or heat.',
    maxParticipants: 2
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Present and launch your innovative product idea.',
    maxParticipants: 3
  },
  {
    id: 'best-manager',
    title: 'Best Manager',
    description: 'Demonstrate your management and leadership skills.',
    maxParticipants: 1
  },
  {
    id: 'red-carpet',
    title: 'Red Carpet',
    description: 'Fashion show and modeling competition.',
    maxParticipants: 1
  },
  {
    id: 'elocution',
    title: 'Elocution',
    description: 'One member per college. Max 3 minutes. Topic: The Impact of Social Media on Indian Youth Mental Health. Judges\' decision will be final.',
    maxParticipants: 1
  }
];

class EventAdminPage {
  constructor(eventId) {
    this.eventId = eventId;
    this.eventData = null;
    this.participants = [];
    this.filteredParticipants = [];
    this.unsubscribe = null;
    
    // DOM elements
    this.participantCountEl = null;
    this.searchInput = null;
    this.participantsTable = null;
    this.loadingEl = null;
    this.emptyStateEl = null;
  }

  async init() {
    try {
      // Validate event ID
      this.eventData = EVENTS_DATA.find(event => event.id === this.eventId);
      if (!this.eventData) {
        this.showError('Event not found');
        return;
      }

      // Initialize DOM elements
      this.initDOMElements();
      
      // Set page title and header
      this.updatePageHeader();
      
      // Ensure Support UI & footer are present
      this.ensureSupportUI();

      // Load participants
      await this.loadParticipants();
      
      // Setup event listeners
      this.setupEventListeners();
      
    } catch (error) {
      console.error('Error initializing event admin page:', error);
      this.showError('Failed to initialize page');
    }
  }

  // Create Support button, modal and footer if missing
  ensureSupportUI() {
    try {
      // Insert Support button in toolbar
      const toolbarRight = document.querySelector('.event-toolbar .toolbar-right');
      if (toolbarRight && !document.getElementById('supportBtn')) {
        const btn = document.createElement('button');
        btn.id = 'supportBtn';
        btn.className = 'btn btn-secondary';
        btn.textContent = '🆘 Support';
        toolbarRight.appendChild(btn);
      }

      // Ensure Score Board button/link exists
      const hasScoreBoard = toolbarRight && Array.from(toolbarRight.querySelectorAll('a,button')).some(el => /score\s*board/i.test(el.textContent || ''));
      if (toolbarRight && !hasScoreBoard) {
        const a = document.createElement('a');
        a.href = '../events/redirect.html';
        a.className = 'btn btn-primary';
        a.textContent = '🏆 Score Board';
        toolbarRight.appendChild(a);
      }

      // Insert footer at end of main
      const main = document.querySelector('main.container.event-admin-container');
      if (main && !document.querySelector('.admin-footer')) {
        const footer = document.createElement('footer');
        footer.className = 'admin-footer';
        footer.textContent = 'Anny Sarah Owner';
        main.appendChild(footer);
      }

      // Insert modal once per page
      if (!document.getElementById('supportModal')) {
        const modal = document.createElement('div');
        modal.id = 'supportModal';
        modal.className = 'support-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'supportModalTitle');
        modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="supportModalTitle" class="modal-title">Support – Illumina Coordination</h3>
              <button class="btn btn-secondary" id="closeSupportModal" aria-label="Close support modal">✖</button>
            </div>
            <div class="modal-body">
              <p>Choose who to contact for <strong id="supportEventName">this event</strong>.</p>
              <div class="contact-options">
                <div class="contact-card">
                  <h4 class="contact-title">Rahul</h4>
                  <div class="contact-role">Site Admin & Developer</div>
                  <button class="btn btn-whatsapp contact-btn" data-support-name="Rahul" data-support-role="Site Admin & Developer" data-phone="919739904620">💬 WhatsApp</button>
                </div>
                <div class="contact-card">
                  <h4 class="contact-title">Vishal</h4>
                  <div class="contact-role">Registration & Site Designer</div>
                  <button class="btn btn-whatsapp contact-btn" data-support-name="Vishal" data-support-role="Registration & Site Designer" data-phone="917349321463">💬 WhatsApp</button>
                </div>
              </div>
              <div class="modal-actions">
                <button class="btn btn-secondary" id="closeSupportModal2">Close</button>
              </div>
            </div>
          </div>`;
        document.body.appendChild(modal);
      }

      // Wire handlers
      this.wireSupportHandlers();
    } catch (e) {
      console.warn('Failed to ensure Support UI:', e);
    }
  }

  wireSupportHandlers() {
    const supportBtn = document.getElementById('supportBtn');
    const modal = document.getElementById('supportModal');
    const close1 = document.getElementById('closeSupportModal');
    const close2 = document.getElementById('closeSupportModal2');

    const eventTitleEl = document.getElementById('eventTitle');
    const eventName = eventTitleEl ? eventTitleEl.textContent.trim() : (this.eventData?.title || 'Event');
    const supportEventNameEl = document.getElementById('supportEventName');
    if (supportEventNameEl) supportEventNameEl.textContent = eventName;

    function buildMessage(name, role) {
      return `Hello Illumina Coordination, I need support for ${eventName}. Contacting: ${name} (${role}).`;
    }
    function openWhatsAppWith(phone, name, role) {
      const text = encodeURIComponent(buildMessage(name, role));
      const url = `https://wa.me/${phone}?text=${text}`;
      window.open(url, '_blank');
    }

    if (supportBtn && modal) {
      supportBtn.onclick = () => {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
      };
    }
    [close1, close2].forEach(btn => {
      if (btn) btn.onclick = () => {
        modal?.classList.remove('show');
        modal?.setAttribute('aria-hidden', 'true');
      };
    });
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }
    document.querySelectorAll('.contact-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const phone = btn.getAttribute('data-phone');
        const name = btn.getAttribute('data-support-name');
        const role = btn.getAttribute('data-support-role');
        if (phone) openWhatsAppWith(phone, name, role);
      });
    });
  }

  // Hide the Payment column regardless of its position
  hidePaymentColumn() {
    try {
      const table = this.participantsTable || document.getElementById('participantsTable');
      if (!table) return;
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      if (!thead) return;

      const ths = Array.from(thead.querySelectorAll('th'));
      const payIndex = ths.findIndex(th => (th.textContent || '').toLowerCase().includes('payment'));
      if (payIndex === -1) return;

      // mark header
      ths[payIndex].setAttribute('data-col-payment', 'true');
      // mark cells in each row
      if (tbody) {
        Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
          const tds = tr.children;
          if (tds && tds[payIndex]) {
            tds[payIndex].setAttribute('data-col-payment', 'true');
          }
        });
      }
    } catch (e) {
      // non-fatal
    }
  }

  initDOMElements() {
    this.participantCountEl = document.getElementById('participantCount');
    this.searchInput = document.getElementById('searchInput');
    this.participantsTable = document.getElementById('participantsTable');
    this.loadingEl = document.getElementById('loading');
    this.emptyStateEl = document.getElementById('emptyState');
  }

  updatePageHeader() {
    // Update page title
    document.title = `${this.eventData.title} Admin - ILLUMINA`;
    
    // Update breadcrumb and header
    const eventNameEl = document.getElementById('eventName');
    const eventTitleEl = document.getElementById('eventTitle');
    const eventDescEl = document.getElementById('eventDescription');
    
    if (eventNameEl) eventNameEl.textContent = this.eventData.title;
    if (eventTitleEl) eventTitleEl.textContent = this.eventData.title;
    if (eventDescEl) eventDescEl.textContent = this.eventData.description;
  }

  async loadParticipants() {
    try {
      this.showLoading(true);
      
      // Query eventSelections for this specific event
      const eventSelectionsRef = collection(db, 'eventSelections');
      
      // Set up real-time listener
      this.unsubscribe = onSnapshot(eventSelectionsRef, async (snapshot) => {
        const eventParticipants = [];
        
        // Filter selections that include this event
        for (const doc of snapshot.docs) {
          const data = doc.data();
          if (data.selections && Array.isArray(data.selections)) {
            const hasThisEvent = data.selections.some(selection => 
              selection.eventId === this.eventId
            );
            
            if (hasThisEvent) {
              // Get user details from registrations
              try {
                const registrationsRef = collection(db, 'registrations');
                const userQuery = query(registrationsRef, where('shortId', '==', data.userToken));
                const userSnapshot = await getDocs(userQuery);
                
                if (!userSnapshot.empty) {
                  const userData = userSnapshot.docs[0].data();
                  // Skip soft-deleted users
                  if (userData && (userData.deleted === true || userData.isDeleted === true)) {
                    continue;
                  }
                  eventParticipants.push({
                    ...userData,
                    eventSelectionId: doc.id,
                    paymentStatus: data.paymentStatus || 'pending',
                    registrationDate: data.createdAt
                  });
                }
              } catch (error) {
                console.warn('Error fetching user data for token:', data.userToken, error);
              }
            }
          }
        }
        
        this.participants = eventParticipants;
        this.filteredParticipants = [...this.participants];
        this.renderParticipants();
        this.updateParticipantCount();
        // Ensure Payment column is hidden after rendering rows
        this.hidePaymentColumn();
        this.showLoading(false);
      });
      
    } catch (error) {
      console.error('Error loading participants:', error);
      this.showError('Failed to load participants');
      this.showLoading(false);
    }
  }

  renderParticipants() {
    if (!this.participantsTable) return;

    if (this.filteredParticipants.length === 0) {
      this.showEmptyState(true);
      this.participantsTable.style.display = 'none';
      return;
    }

    this.showEmptyState(false);
    this.participantsTable.style.display = 'table';

    const tbody = this.participantsTable.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = this.filteredParticipants.map((participant, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${participant.name || participant.username || 'N/A'}</td>
        <td>${participant.phone || 'N/A'}</td>
        <td>${participant.college || 'N/A'}</td>
        <td>${participant.course || 'N/A'}</td>
        <td></td>
        <td>${participant.shortId || 'N/A'}</td>
        <td>${this.formatDate(participant.createdAt)}</td>
      </tr>
    `).join('');

    // After populating rows, hide Payment column if present
    this.hidePaymentColumn();
  }

  updateParticipantCount() {
    if (this.participantCountEl) {
      this.participantCountEl.textContent = this.filteredParticipants.length;
    }
    
    // Show/hide max team badge based on participant count
    const maxTeamBadge = document.getElementById('maxTeamBadge');
    if (maxTeamBadge) {
      if (this.filteredParticipants.length > 0) {
        maxTeamBadge.style.display = 'inline-block';
      } else {
        maxTeamBadge.style.display = 'none';
      }
    }
  }

  setupEventListeners() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filterParticipants(e.target.value);
      });
    }

    // Export CSV button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportCSV();
      });
    }
  }

  filterParticipants(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredParticipants = [...this.participants];
    } else {
      this.filteredParticipants = this.participants.filter(participant => 
        (participant.name || participant.username || '').toLowerCase().includes(term) ||
        (participant.phone || '').toLowerCase().includes(term) ||
        (participant.college || '').toLowerCase().includes(term) ||
        (participant.shortId || '').toLowerCase().includes(term)
      );
    }
    
    this.renderParticipants();
    this.updateParticipantCount();
  }

  exportCSV() {
    if (this.filteredParticipants.length === 0) {
      alert('No participants to export');
      return;
    }

    const headers = ['#', 'Name', 'Phone', 'College', 'Course', 'Token', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...this.filteredParticipants.map((participant, index) => [
        index + 1,
        `"${participant.name || participant.username || 'N/A'}"`,
        `"${participant.phone || 'N/A'}"`,
        `"${participant.college || 'N/A'}"`,
        `"${participant.course || 'N/A'}"`,
        `"${participant.shortId || 'N/A'}"`,
        `"${this.formatDate(participant.createdAt)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${this.eventData.title.replace(/[^a-zA-Z0-9]/g, '-')}-participants-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid Date';
    }
  }

  showLoading(show) {
    if (this.loadingEl) {
      this.loadingEl.style.display = show ? 'block' : 'none';
    }
  }

  showEmptyState(show) {
    if (this.emptyStateEl) {
      this.emptyStateEl.style.display = show ? 'block' : 'none';
    }
  }

  showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    } else {
      alert(message);
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Utility function to extract event ID from URL
export function getEventIdFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/\/a\/admin-(.+)\.html$/);
  return match ? match[1] : null;
}

// Export the class
export { EventAdminPage, EVENTS_DATA };

// --- Enhance simple login forms to the new lock UI (runs on module import) ---
(() => {
  try {
    const container = document.getElementById('loginContainer');
    // Only proceed if a login container exists and it's not already enhanced
    if (container && !container.querySelector('#togglePassword')) {
      container.style.maxWidth = '480px';
      container.style.margin = '80px auto 120px';
      container.style.padding = '0 20px';
      container.innerHTML = `
        <div class="form-card" style="background: rgba(0, 0, 0, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary), #90d15b); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 8px 20px rgba(123, 191, 68, 0.3);">
              <span style="font-size: 32px;">💻</span>
            </div>
            <h1 class="title" style="margin: 0; font-size: 28px; background: linear-gradient(135deg, #fff, #f0f0f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Event Admin Access</h1>
            <p style="color: rgba(255, 255, 255, 0.7); margin: 8px 0 0; font-size: 16px;">Secure access to event management</p>
          </div>

          <form id="loginForm" style="display: flex; flex-direction: column; gap: 20px;">
            <div class="form-group" style="position: relative;">
              <label for="password" style="display: block; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9); font-weight: 600; font-size: 14px;">
                🔐 Access Password
              </label>
              <div style="position: relative;">
                <input id="password" class="input" type="password" placeholder="Enter password" required style="width: 100%; padding: 16px 50px 16px 20px; background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; color: rgba(255, 255, 255, 0.95); font-size: 16px; transition: all 0.3s ease; box-sizing: border-box;" oninput="this.value = this.value.toLowerCase().replace(/\s/g, '')">
                <button id="togglePassword" class="btn-icon password-toggle" type="button" aria-label="Show password" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255, 255, 255, 0.6); font-size: 18px; cursor: pointer; padding: 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">👁️</button>
              </div>
            </div>

            <button class="btn btn-primary btn-block login-btn" type="submit" style="padding: 16px 24px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, var(--primary), #90d15b); border: none; border-radius: 12px; cursor: pointer; position: relative; overflow: hidden;">
              <span class="btn-text">Access Event Admin</span>
              <span class="btn-loading" style="display: none; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">
                <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #fff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              </span>
            </button>
          </form>

          <div id="loginError" class="error-message" style="margin-top: 20px; padding: 12px; background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.3); border-radius: 8px; color: #ff6b6b; font-size: 14px; display: none; text-align: center;">
            <span style="font-size: 16px; margin-right: 8px;">⚠️</span>
            Invalid password. Please try again.
          </div>

          <div style="margin-top: 24px; text-align: center; color: rgba(255, 255, 255, 0.6); font-size: 12px;">
            <p>🔒 Secure login required for event management</p>
            <p style="margin: 4px 0;">Contact admin if you need access assistance</p>
          </div>
        </div>
      `;

      // Inject small style helpers (spin + focus)
      const style = document.createElement('style');
      style.textContent = `
        .password-toggle:hover { background: rgba(255, 255, 255, 0.1) !important; color: rgba(255, 255, 255, 0.9) !important; transform: translateY(-50%) scale(1.1) !important; }
        .form-group .input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(123, 191, 68, 0.2) !important; background: rgba(255, 255, 255, 0.15) !important; transform: translateY(-1px); }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `;
      document.head.appendChild(style);

      // Wire simple visibility toggle for eye icon to avoid errors in pages that don't handle it
      const toggle = container.querySelector('#togglePassword');
      const pwd = container.querySelector('#password');
      if (toggle && pwd) {
        toggle.addEventListener('click', () => {
          const isPwd = pwd.type === 'password';
          pwd.type = isPwd ? 'text' : 'password';
          toggle.textContent = isPwd ? '🙈' : '👁️';
          toggle.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
        });
      }
    }
  } catch (e) {
    // Non-fatal; keep page working even if enhancement fails
    console.warn('Login UI enhancement failed:', e);
  }
})();