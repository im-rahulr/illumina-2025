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
      
      // Load participants
      await this.loadParticipants();
      
      // Setup event listeners
      this.setupEventListeners();
      
    } catch (error) {
      console.error('Error initializing event admin page:', error);
      this.showError('Failed to initialize page');
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