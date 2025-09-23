// Script to update all event admin pages with password protection and remove email column
// This is a helper script to batch update all pages

const events = [
  'solo-dance', 'group-dance', 'solo-singing', 'solo-instrumental', 
  'photography', 'face-painting', 'reels-creation', 'general-quiz',
  'hindi-essay', 'kannada-essay', 'fireless-cooking', 'product-launch',
  'best-manager', 'red-carpet'
];

// Template for login form HTML
const loginFormHTML = `
  <!-- Login Form -->
  <div id="loginContainer" class="container" style="max-width: 400px; margin: 100px auto;">
    <div class="form-card">
      <h1 class="title" style="text-align: center; margin-bottom: 24px;">{{EVENT_TITLE}} Event Admin</h1>
      <form id="loginForm">
        <div class="form-group">
          <label for="password">Access Password</label>
          <input id="password" class="input" type="password" placeholder="Enter password" required>
        </div>
        <button class="btn btn-primary btn-block" type="submit">Access Event Admin</button>
      </form>
      <div id="loginError" class="error-message" style="margin-top: 16px; display: none;"></div>
    </div>
  </div>
`;

// Template for updated script
const scriptTemplate = `
  <script type="module">
    import { EventAdminPage } from './event-admin.js';

    const PASSWORD = 'helloworld';
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const pageLoader = document.getElementById('pageLoader');
    const showPageLoader = (text) => { if (pageLoader) { document.getElementById('pageLoaderText').textContent = text; pageLoader.classList.add('show'); } };
    const hidePageLoader = () => { if (pageLoader) pageLoader.classList.remove('show'); };

    function checkAuth() {
      const isLoggedIn = sessionStorage.getItem('eventAdminAuth') === 'true';
      if (isLoggedIn) {
        showMainContent();
      } else {
        showLogin();
      }
    }

    function showLogin() {
      loginContainer.style.display = 'block';
      mainContainer.style.display = 'none';
      passwordInput.focus();
    }

    function showMainContent() {
      loginContainer.style.display = 'none';
      mainContainer.style.display = 'block';
      initPage();
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = passwordInput.value.trim();
      if (password === PASSWORD) {
        sessionStorage.setItem('eventAdminAuth', 'true');
        showMainContent();
        loginError.style.display = 'none';
      } else {
        loginError.textContent = 'Invalid password. Please try again.';
        loginError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
      }
    });

    async function initPage() {
      try {
        showPageLoader('Loading {{EVENT_ID}} event data...');
        const eventAdminPage = new EventAdminPage('{{EVENT_ID}}');
        await eventAdminPage.init();
        window.eventAdminPage = eventAdminPage;
      } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = \`Failed to load: \${error.message}\`;
        document.getElementById('errorMessage').classList.add('show');
      } finally { hidePageLoader(); }
    }
    
    window.addEventListener('beforeunload', () => { if (window.eventAdminPage) window.eventAdminPage.destroy(); });
    checkAuth();
    window.addEventListener('pageshow', () => { checkAuth(); });
  </script>
`;

console.log('Use this template to update all event admin pages');
console.log('Events to update:', events);